import NavbarComponent from "../components/Navbar"
import DonateDonateInfoComponet from "../components/DonateInfo"
import DonationListComponent from "../components/DonationList"
import DonationNotApproveComponent from "../components/DonationNotApprove"

import { useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useQuery } from "react-query"
import { API } from "../config/api"

function DetailDonatepage() {
  const [state] = useContext(AuthContext)
  const { id } = useParams()

  /**
   * Initiate variable for storing total transaction, money, and not Approved status from fund data
   */
  let total = {
    transaction: 0,
    money: 0,
    notApprove: 0,
  }

  /**
   * Request data fund detail from backend
   */
  let { data: fund, refetch } = useQuery("fundCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/fund/" + id)
    return response.data.data.fund
  })

  /**
   * Calculating total transaction and money collected from specific fund and pass it to fund component
   */
  fund?.userDonate.map((item, index) => {
    if (item.status === "success") {
      total.transaction = total.transaction + 1
      total.money = total.money + item.donateAmount
    } else {
      total.notApprove = total.notApprove + 1
    }
  })

  return (
    <>
      <NavbarComponent />
      <DonateDonateInfoComponet fund={fund} refetch={refetch} total={total} />
      <DonationListComponent list={fund?.userDonate} total={total} />
      {fund?.idUser === state.user.id && (
        <DonationNotApproveComponent
          list={fund?.userDonate}
          refetch={refetch}
          total={total}
        />
      )}
    </>
  )
}

export default DetailDonatepage
