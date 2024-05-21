import { Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"

export default function DonateChat({ handleShowDonate, fund }) {
  let history = useHistory()
  return (
    <>
      <Button onClick={handleShowDonate} className="donate-btn w-45">
        Donate
      </Button>
      <Button
        onClick={() => history.push("/chat/" + fund?.id)}
        className="donate-btn w-45"
      >
        Chat Fundraiser
      </Button>
    </>
  )
}
