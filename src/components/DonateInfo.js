import { useState, useRef } from "react"
import {
  Button,
  ProgressBar,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap"
import DatePicker from "react-datepicker"
import { useHistory } from "react-router-dom"
import { useContext } from "react"
import { useMutation } from "react-query"
import { API } from "../config/api"
import { AuthContext } from "../context/AuthContext"

import EditDonateForm from "./Form/EditFund"
import DonateModalComponent from "./DonateModal"
import DonateOnly from "./Button/DonateOnly"
import DonateChat from "./Button/DonateChat"
import DonateEdit from "./Button/DonateEdit"
import DonateDisabled from "./Button/DonateDisabled"
import convertRupiah from "rupiah-format"

function DonateInfoComponet({ fund, refetch, total }) {
  let history = useHistory()

  const [state] = useContext(AuthContext)

  const [showDonate, setShowDonate] = useState(false)
  const [editFund, setEditFund] = useState(false)

  /**
   * Calculate days from today to target date
   * @param {*} date1 from target date fund
   * @param {*} date2 this day
   * @returns number days
   */
  const getDays = (date1, date2) => {
    const DAY_UNIT_IN_MILLISECONDS = 24 * 3600 * 1000

    const diffInMilliseconds = Math.abs(
      new Date(date1).getTime() - new Date(date2).getTime()
    )
    const diffInDays = diffInMilliseconds / DAY_UNIT_IN_MILLISECONDS
    return parseInt(diffInDays)
  }

  /**
   * Handle donate modal
   */
  const handleShowDonate = () => {
    setShowDonate(true)
  }

  const handleCloseDonate = () => {
    setShowDonate(false)
  }

  /**
   * Handle when edit fund clicked for condtional rendering
   */
  const handleEditFund = () => {
    setEditFund(!editFund)
  }
  /**
   * Check if logged in user have been donated to this fund
   * Condtional rendering chat button
   */
  let isUserDonate = null
  isUserDonate = fund?.userDonate.filter(
    (item) => item.userDetail.email === state.user.email
  )

  return (
    <>
      <Container className="donate-info-wrapper">
        <Row>
          <Col className="pr-5" lg={6}>
            <img
              className="donate-info-photo"
              alt="donate-img"
              src={fund?.thumbnail}
            ></img>
          </Col>

          {editFund ? (
            <Col className="mr-4 pr-4" lg={5}>
              <EditDonateForm
                refetch={refetch}
                fund={fund}
                handleEditFund={handleEditFund}
              />
            </Col>
          ) : (
            <Col className="ml-4 pr-4" lg={5}>
              <h1 className="profile-heading">{fund?.title}</h1>
              <div className="donate-info-collected">
                <div className="donate-total d-flex justify-content-between">
                  <p>{convertRupiah.convert(total.money)} </p>
                  <span className="pt-1 fs-6 text-muted">gathered from</span>
                  <span className="donate-total text-muted">
                    {convertRupiah.convert(fund?.goal)}
                  </span>
                </div>
                <ProgressBar
                  className="donate-info-progress w-90"
                  variant="danger"
                  now={(total.money / fund?.goal) * 100}
                />
                <div className="mt-3 d-flex justify-content-between">
                  <p className="donate-info-detail">
                    {total.transaction}{" "}
                    <span className="fs-6 text-muted">Donation</span>
                  </p>
                  <p className="donate-info-detail">
                    {getDays(fund?.targetDate, new Date().toISOString())}
                    <span className="ml-1 fs-6 text-muted text-right">
                      More Day
                    </span>
                  </p>
                </div>
              </div>
              <p className="donate-info-desc">{fund?.description}</p>
              {total.money < fund?.goal ||
              new Date(fund?.targetDate) <= new Date() ? (
                <>
                  {fund?.idUser === state.user.id ? (
                    <DonateEdit
                      handleShowDonate={handleShowDonate}
                      handleEditFund={handleEditFund}
                    />
                  ) : (
                    <div className="d-flex justify-content-between">
                      {isUserDonate?.length > 0 ? (
                        <DonateChat
                          handleShowDonate={handleShowDonate}
                          fund={fund}
                        />
                      ) : (
                        <DonateOnly handleShowDonate={handleShowDonate} />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <DonateDisabled />
              )}
            </Col>
          )}
        </Row>
      </Container>

      <DonateModalComponent
        fund={fund}
        showDonate={showDonate}
        handleCloseDonate={handleCloseDonate}
        refetch={refetch}
      />
    </>
  )
}

export default DonateInfoComponet
