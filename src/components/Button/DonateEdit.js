import { Button } from "react-bootstrap"

export default function DonateEdit({ handleShowDonate, handleEditFund }) {
  return (
    <div className="d-flex justify-content-between">
      <Button onClick={handleEditFund} className="donate-btn w-45">
        Edit Fund
      </Button>
      <Button onClick={handleShowDonate} className="donate-btn w-45">
        Donate
      </Button>
    </div>
  )
}
