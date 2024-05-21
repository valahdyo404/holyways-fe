import { useState, useRef } from "react"
import { Button, Form, Row, Col, Alert } from "react-bootstrap"
import DatePicker from "react-datepicker"
import { useHistory } from "react-router-dom"

import { useMutation } from "react-query"
import { API } from "../../config/api"
export default function EditDonateForm({ refetch, fund, handleEditFund }) {
  let history = useHistory()

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
      if (form.thumbnail[0]) {
        formData.set("thumbnail", form?.thumbnail[0], form.thumbnail[0]?.name)
      }
      form.title.length !== 0 && formData.set("title", form.title)
      form.goal.length !== 0 && formData.set("goal", form.goal)
      form.description.length !== 0 &&
        formData.set("description", form.description)
      startDate && formData.set("targetDate", new Date(startDate).toISOString())

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      const response = await API.patch("/fund/" + fund?.id, formData, config)
      setMessage(null)
      handleEditFund()
      refetch()
      history.push("/fund/" + fund?.id)
    } catch (error) {
      console.log(error)
      const alert = (
        <Alert variant="danger" className="py-1">
          Cannot Update Fund Detail
        </Alert>
      )
      setMessage(alert)
    }
  })

  return (
    <>
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
            placeholder={fund?.title}
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
            style={{ width: "50%" }}
          >
            Edit Thumbnail
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
            </>
          )}
        </div>
        <Form.Group className="mb-3" controlId="formBasicGoals">
          <Row>
            <Col lg={6}>
              <Form.Control
                className="form-color"
                onChange={handleChange}
                value={goal}
                name="goal"
                size="sm"
                type="number"
                placeholder={fund?.goal}
              />
            </Col>

            <Col lg={4}>
              <DatePicker
                selected={startDate}
                onChange={handleChangeDate}
                dateFormat="yyyy/MM/dd"
                isClearable
                className="form-color form-control-sm form-control"
                minDate={new Date()}
                placeholderText={new Date(fund?.targetDate).toLocaleString()}
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
            placeholder={fund?.description}
          />
        </Form.Group>

        <Button
          onClick={(e) => handleSubmit.mutate(e)}
          // style={{ marginLeft: "75%" }}
          className="mt-5 donate-btn w-100"
          type="submit"
          size="sm"
        >
          Edit Fund
        </Button>
      </Form>
    </>
  )
}
