import { API } from "../config/api"
import { useQuery } from "react-query"
import { useRef, useState, useContext } from "react"
import { useMutation } from "react-query"
import { AuthContext } from "../context/AuthContext"
import { useHistory } from "react-router-dom"

import NavbarComponent from "../components/Navbar"
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap"
import NoImage from "../assets/noImage-1.svg"

function ProfileUpdatepage() {
  let history = useHistory()

  const [state] = useContext(AuthContext)
  const [preview, setPreview] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [message, setMessage] = useState(null)
  const inputRef = useRef(null)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    profileImage: "",
  })

  /**
   * Request data from backend for user data preview
   */
  let { data: profile } = useQuery("profileCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/user/" + state.user.id)
    return response.data.data.user
  })

  /**
   * Handle change value form input
   */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    })
    if (e.target.type === "file") {
      if (inputRef.current?.files) {
        setUploadedFileName(inputRef.current.files[0].name)
        let url = URL.createObjectURL(e.target.files[0])
        setPreview(url)
      }
    }
  }

  /**
   * Handle button upload image profile
   */
  const handleUploadImage = () => {
    inputRef.current?.click()
  }

  /**
   * Handle "X" button if profile image uploaded
   */
  const resetFile = () => {
    setUploadedFileName(null)
    inputRef.current.file = null
    form.profileImage = ""
  }

  /**
   * Handle update profile when user has been input data
   */
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData()
      if (form.profileImage[0]) {
        formData.set(
          "profileImage",
          form?.profileImage[0],
          form.profileImage[0]?.name
        )
      }
      form.fullName.length !== 0 && formData.set("fullName", form?.fullName)
      form.email.length !== 0 && formData.set("email", form?.email)
      form.phone.length !== 0 && formData.set("phone", form?.phone)

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      const response = await API.patch("/user", formData, config)
      history.push("/profile")
    } catch (error) {
      console.log(error)
      const alert = (
        <Alert variant="danger" className="py-1">
          {error.message}
        </Alert>
      )
      setMessage(alert)
    }
  })

  return (
    <>
      <NavbarComponent />
      <Container fluid className="profile-wrapper">
        <Row>
          <Col lg={6}>
            <h1 className="profile-heading">My Profile</h1>
            <Row>
              <Col>
                <img
                  style={{ width: "inherit", height: "auto" }}
                  src={profile?.profileImage ? profile?.profileImage : NoImage}
                  alt="profile"
                />
              </Col>
              <Col>
                <div className="profile-detail-wrapper">
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Full Name</p>
                    <p className="profile-detail-content">
                      {profile?.fullName}
                    </p>
                  </div>
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Email</p>
                    <p className="profile-detail-content">{profile?.email}</p>
                  </div>
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Phone</p>
                    <p className="profile-detail-content">{profile?.phone}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <h1 className="profile-heading">Edit Detail</h1>
            {true && message}
            <Form /*onSubmit={handleOnSubmit}*/>
              <div className="mb-3">
                <Button
                  onClick={handleUploadImage}
                  className="donate-btn"
                  style={{ width: "30%" }}
                >
                  Upload Photo
                </Button>
                <input
                  ref={inputRef}
                  onChange={handleChange}
                  name="profileImage"
                  className="d-none"
                  type="file"
                />
                {uploadedFileName && (
                  <>
                    <button
                      onClick={resetFile}
                      type="button"
                      class="close float-none ml-3"
                      aria-label=""
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <span className="ml-2">{uploadedFileName}</span>
                    <div>
                      <img
                        src={preview}
                        className="prev-img mt-3"
                        alt="preview"
                      />
                    </div>
                  </>
                )}
              </div>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={form.name}
                  name="fullName"
                  size="sm"
                  type="text"
                  placeholder={profile?.fullName}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={form.email}
                  name="email"
                  size="sm"
                  type="text"
                  placeholder={profile?.email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formNumber">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={form.phone}
                  name="phone"
                  size="sm"
                  type="text"
                  placeholder={profile?.phone}
                />
              </Form.Group>

              <Button
                onClick={(e) => handleSubmit.mutate(e)}
                className="mt-3 donate-btn w-100"
                type="submit"
                size="sm"
              >
                Update Detail
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ProfileUpdatepage
