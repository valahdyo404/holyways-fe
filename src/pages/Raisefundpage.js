import { useHistory } from "react-router-dom"
import { useContext } from "react"
import { useQuery } from "react-query"
import { API } from "../config/api"
import { AuthContext } from "../context/AuthContext"
import { Button, Container, Row, Col } from "react-bootstrap"
import NavbarComponent from "../components/Navbar"
import DonateCardComponent from "../components/DonateCard"
import DonateImage_1 from "../assets/donate-1.png"

function Raisefundpage() {
  let history = useHistory()

  const [state] = useContext(AuthContext)
  let isLogin = localStorage.getItem("isLogin")

  /**
   * Request data fund list from backend
   */
  let { data: fundlist, refetch } = useQuery("fundListCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/user/fund/" + state.user.id)
    return response?.data.data.user.userFund
  })

  /**
   * Handle when make new fund clicked
   * @returns redirect to create new fund page
   */
  const handleRaisefund = () => history.push("/formfund")

  /**
   * Handle delete button when clicked and request to backend
   * @param {int} idFund
   * @param {int} idUser
   */
  const handleDelete = async (idFund, idUser) => {
    try {
      if (state.user.id === idUser) {
        await API.delete("/fund/" + idFund)
        refetch()
      } else {
        throw new Error("cannot delete, not authorized!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <NavbarComponent />
      <Container className="mt-5 pr-5">
        <Row className="d-flex justify-content-between pr-5">
          <div className="profile-heading mb-4">My Raise Fund</div>
          <div className="pt-2">
            <Button onClick={handleRaisefund} className="w-100 donate-btn">
              Make Raise Fund
            </Button>
          </div>
        </Row>
        <Row>
          {/* <DonateCardComponent
              isLogin={isLogin}
              image={DonateImage_1}
              title={"The Strength of a People. Power of Community"}
              desc={
                "Some quick example text to build on the card title and make up the bulk of the card's content."
              }
              total={"Rp 25.000.000"}
              progress={60}
            /> */}
          {fundlist?.map((item, index) => {
            let money = 0
            let dateExpired = new Date(item.targetDate) <= new Date()
            if (item.userDonate) {
              item.userDonate.map((fund, index) => {
                if (fund.status === "success") {
                  money += fund.donateAmount
                }
              })
            }
            let goalReached = money >= item.goal
            return (
              <>
                <Col lg={4} className="donate-box pl-0 pt-0">
                  {" "}
                  <DonateCardComponent
                    handleDelete={handleDelete}
                    dateExpired={dateExpired}
                    goalReached={goalReached}
                    id={item.id}
                    idUser={item.idUser}
                    isLogin={isLogin}
                    image={item.thumbnail}
                    title={item.title}
                    desc={item.description}
                    total={money}
                    progress={(money / item.goal) * 100}
                    btn={"View Fund"}
                  />
                </Col>
              </>
            )
          })}
        </Row>
      </Container>
    </>
  )
}

export default Raisefundpage
