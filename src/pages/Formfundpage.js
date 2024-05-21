import { useRef, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useHistory } from "react-router-dom"
import { useMutation } from "react-query"
import { API } from "../config/api"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap"
import DatePicker from "react-datepicker"
import NavbarComponent from "../components/Navbar"
import "react-datepicker/dist/react-datepicker.css"

function Formfundpage() {
  let history = useHistory()

  const [state] = useContext(AuthContext)
  const [startDate, setStartDate] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    title: "",
    thumbnail: "",
    goal: "",
    description: "",
  })
  const { title, goal, description } = form

  /**
   * Thumbnail upload image input ref form
   */
  const inputRef = useRef(null)

  /**
   * Handle input change value form
   * @param {object} e
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
   * Handle when attach thumbnail clicked
   */
  const handleUploadImage = () => {
    inputRef.current?.click()
  }

  /**
   * Handle "X" button when clicked to reset preview and name file
   */
  const resetFile = () => {
    setUploadedFileName(null)
    inputRef.current.file = null
    form.thumbnail = ""
  }

  /**
   * Handle change when date form selected
   * @param {date} date
   */
  const handleChangeDate = (date) => {
    setStartDate(date)
  }

  /**
   * Handle submit button when clicked and request post method to backend
   */
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const formData = new FormData()
      if (!form.thumbnail[0]) {
        console.log("error")
        throw new Error("Please fill in all fields!")
      }
      formData.set("thumbnail", form?.thumbnail[0], form.thumbnail[0]?.name)
      formData.set("title", form.title)
      formData.set("goal", form.goal)
      formData.set("description", form.description)
      formData.set("targetDate", new Date(startDate).toISOString())
      formData.set("idUser", state.user.id)

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      const response = await API.post("/fund", formData, config)
      history.push("/raisefund")
    } catch (error) {
      console.log(error)
      const alert = (
        <Alert variant="danger" className="py-1">
          Please fill in all fields!
        </Alert>
      )
      setMessage(alert)
    }
  })

  return (
    <>
      <NavbarComponent />
      <Container>
        <div className="profile-heading text-left h3 mt-5 mb-5">
          Make Raise Fund
        </div>
        <Row className="d-flex justify-content-left">
          <Col lg="11">
            {true && message}
            <Form /*onSubmit={handleOnSubmit}*/>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={title}
                  name="title"
                  size="sm"
                  type="text"
                  placeholder="Title"
                />
              </Form.Group>
              <div className="mb-3">
                <input
                  ref={inputRef}
                  onChange={handleChange}
                  name="thumbnail"
                  className="d-none"
                  type="file"
                />
                <Button
                  onClick={handleUploadImage}
                  className="donate-btn"
                  style={{ width: "15%" }}
                >
                  Attach Thumbnail
                </Button>
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
                        className="prev-img mt-2"
                        alt="preview"
                      />
                    </div>
                  </>
                )}
              </div>
              <Form.Group className="mb-3" controlId="formBasicGoals">
                <Row>
                  <Col lg={4}>
                    <Form.Control
                      className="form-color"
                      onChange={handleChange}
                      value={goal}
                      name="goal"
                      size="sm"
                      type="number"
                      placeholder="Goals Donation (Rp)"
                    />
                  </Col>

                  <Col lg={3}>
                    <DatePicker
                      selected={startDate}
                      onChange={handleChangeDate}
                      dateFormat="yyyy/MM/dd"
                      isClearable
                      className="form-color form-control-sm form-control"
                      minDate={new Date()}
                      placeholderText="Set Target Date"
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDescription">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={description}
                  as="textarea"
                  rows={6}
                  name="description"
                  size="sm"
                  type="text"
                  placeholder="Description"
                />
              </Form.Group>

              <Button
                onClick={(e) => handleSubmit.mutate(e)}
                style={{ marginLeft: "75%" }}
                className="mt-5 donate-btn w-25"
                type="submit"
                size="sm"
              >
                Public Fundraising
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Formfundpage
