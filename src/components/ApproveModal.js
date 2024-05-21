import { Modal, Form, Button, Row, Col } from "react-bootstrap"
import { convert } from "rupiah-format"

import { useMutation } from "react-query"
import { API } from "../config/api"

function ApproveModalComponent(props) {
  const { showDonate, handleCloseDonate, userDonate, refetch } = props

  /**
   * Handle approve button when clicked
   * Request to update status transaction become success
   */
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const body = { status: "success" }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      const response = await API.patch(
        `/transaction/${userDonate.id}`,
        body,
        config
      )

      refetch()
      handleCloseDonate()
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <Modal
      show={showDonate}
      onHide={handleCloseDonate}
      contentClassName="w-100 m-auto"
    >
      <Modal.Body>
        <Row className="d-flex justify-content-center">
          <Col lg="11">
            <h1 className="view-donate-heading">
              {userDonate?.userDetail.fullName}
            </h1>
            <Form /*onSubmit={handleOnSubmit}*/>
              <Form.Group className="mt-3 mb-3" controlId="formNominalDonation">
                <Form.Control
                  className="form-color"
                  // onChange={handleOnChange}
                  // value={state.fullname}
                  placeholder={convert(userDonate?.donateAmount)}
                  disabled
                />
              </Form.Group>
              <img
                className="approve-img"
                src={userDonate?.proofAttachment}
                alt="struk"
              ></img>
              <Button
                onClick={(e) => handleSubmit.mutate(e)}
                className="attach-donate-btn mt-3 mb-3"
                style={{ width: "100%" }}
              >
                Approve
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default ApproveModalComponent
