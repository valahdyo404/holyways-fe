import { Button } from "react-bootstrap"

export default function DonateOnly({ handleShowDonate }) {
  return (
    <Button onClick={handleShowDonate} className="donate-btn w-100">
      Donate
    </Button>
  )
}
