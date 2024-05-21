import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap"
import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useHistory } from "react-router-dom"
import { API } from "../config/api"

function LoginModalComponent(props) {
  const { showLogin, handleShowRegister, closeLogin } = props

  const history = useHistory()

  const [state, dispatch] = useContext(AuthContext)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const { email, password } = form

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

      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      // Data body
      const body = JSON.stringify(form)

      // Insert data for login process
      const response = await API.post("/login", body, config)
      // Checking process
      if (response?.status === 200) {
        // Send data to useContext

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data.user,
        })
        const alert = (
          <Alert variant="success" className="py-1">
            Login Success
          </Alert>
        )
        setMessage(alert)
        history.push("/")
        closeLogin()
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login Failed
        </Alert>
      )
      setMessage(alert)
      console.log(error)
    }
  }

  const handleDemoUser = (e) => {
    setForm({ ...form, email: "user1@gmail.com", password: "123456" })
    handleSubmit(e)
  }

  /**
   * Handle klik here login modal
   */
  const handleClickHere = () => {
    closeLogin()
    handleShowRegister()
  }

  return (
    <>
      <Modal
        show={showLogin}
        onHide={closeLogin}
        contentClassName="w-75 m-auto"
      >
        <Modal.Body>
          <Row className="d-flex justify-content-center">
            <Col lg="11">
              <div className="profile-heading text-left mt-3 mb-4 h3">
                Login
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
                    type="text"
                    placeholder="Email"
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPassword">
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
                <Button
                  onClick={handleSubmit}
                  className="donate-btn mb-3"
                  style={{ width: "100%" }}
                >
                  Login
                </Button>
                <p className="text-center">
                  Don't have an account ? Klik{" "}
                  <strong>
                    <a
                      href="#"
                      className="a-register"
                      onClick={handleClickHere}
                    >
                      Here
                    </a>
                  </strong>
                </p>
                <Button
                  onClick={handleDemoUser}
                  className="donate-btn mb-3"
                  style={{ width: "100%" }}
                >
                  Demo User
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default LoginModalComponent
