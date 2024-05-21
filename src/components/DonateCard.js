import { useHistory } from "react-router-dom"
import { Card, ProgressBar, Button } from "react-bootstrap"

import convertRupiah from "rupiah-format"

function DonateCardComponent(props) {
  const {
    image,
    title,
    total,
    desc,
    progress,
    isLogin,
    handleShowLogin,
    id,
    btn,
    goalReached,
    dateExpired,
    handleDelete,
    idUser,
  } = props

  const history = useHistory()

  /**
   * Handle button donate when click redirect to detail fund page
   */
  const handleDonate = () => {
    history.push("/fund/" + id)
  }

  return (
    <Card style={{ minHeight: "100%" }}>
      <Card.Img variant="top" src={image} className="donate-card-img" />
      <Card.Body>
        <Card.Title className="donate-title">{title}</Card.Title>
        <Card.Text className="donate-desc">{desc}</Card.Text>
        <ProgressBar
          className="donate-progress"
          variant="danger"
          now={progress}
        />
        <div className="donate-box-bottom d-flex justify-content-between">
          {goalReached || dateExpired ? (
            <>
              <Button
                onClick={isLogin === "true" ? handleDonate : handleShowLogin}
                className="donate-btn h-50 mt-4"
                variant="primary"
              >
                {btn ? btn : "Donate"}
              </Button>
              <Button
                variant="secondary"
                className="donate-btn-disabled h-50 mt-4"
                onClick={() => handleDelete(id, idUser)}
              >
                Delete Fund
              </Button>
            </>
          ) : (
            <>
              <p className="donate-collected">{convertRupiah.convert(total)}</p>
              <Button
                onClick={isLogin === "true" ? handleDonate : handleShowLogin}
                className="donate-btn h-50 mt-4"
                variant="primary"
              >
                {btn ? btn : "Donate"}
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default DonateCardComponent
