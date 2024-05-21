import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useHistory } from "react-router-dom"
import { API } from "../config/api"

import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap"

function RegisterModalComponent(props) {
  const history = useHistory()

  const { showRegister, handleCloseRegister, closeRegister } = props
  const [state, dispatch] = useContext(AuthContext)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  })
  const { email, password, fullName } = form

  /**
   * Handle change form value
   * @param {object} e event value form input
   */
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  /**
   * Handle submit button
   * @param {object} e event value form
   */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      const body = JSON.stringify(form)
      const response = await API.post("/register", body, config)

      if (response?.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data.user,
        })
        history.push("/")
        closeRegister()
      }
    } catch (error) {
      if (error.response.status === 409) {
        const alert = (
          <Alert variant="danger" className="py-1">
            Email already exist!
          </Alert>
        )
        setMessage(alert)
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Register Failed
          </Alert>
        )
        setMessage(alert)
        console.log(error)
      }
    }
  }

  return (
    <Modal
      show={showRegister}
      onHide={closeRegister}
      contentClassName="w-75 m-auto"
    >
      <Modal.Body>
        <Row className="d-flex justify-content-center">
          <Col lg="11">
            <div className="profile-heading text-left mt-3 mb-4 h3">
              Register
            </div>
            {true && message}
            <Form /*onSubmit={handleOnSubmit}*/>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Control
                  className="form-color"
                  onChange={handleOnChange}
                  value={email}
                  name="email"
                  size="sm"
                  type="email"
                  placeholder="Email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Control
                  className="form-color"
                  onChange={handleOnChange}
                  value={password}
                  name="password"
                  size="sm"
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="formFullName">
                <Form.Control
                  className="form-color"
                  onChange={handleOnChange}
                  value={fullName}
                  name="fullName"
                  size="sm"
                  type="text"
                  placeholder="Full Name"
                />
              </Form.Group>
              <Button
                onClick={handleSubmit}
                className="donate-btn mb-3"
                style={{ width: "100%" }}
              >
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default RegisterModalComponent
