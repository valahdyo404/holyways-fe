import { Button } from "react-bootstrap"

export default function DonateOnly({ handleShowDonate }) {
  return (
    <Button variant="secondary" className="donate-btn-disabled w-100" disabled>
      Fundraising has been ended
    </Button>
  )
}
