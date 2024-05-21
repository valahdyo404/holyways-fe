import { Container, Row, Col } from "react-bootstrap"
import { useState } from "react"

import convertRupiah from "rupiah-format"

function DonationListComponent({ list, total }) {
  const [limit, setLimit] = useState(3)

  /**
   * Set limit list when load more button clicked
   */
  const handleLoadMore = () => {
    setLimit(limit + 3)
  }

  /**
   * Filtering pending status transaction
   */
  let approve = list?.filter((item) => item.status === "success")
  return (
    <Container className="mt-5">
      <h1 className="profile-heading pt-5 mb-4">
        List Donation ({total?.transaction})
      </h1>
      <Row className="justify-content-center">
        {approve?.slice(0, limit).map((item, index) => {
          if (item.status === "success") {
            let date = new Date(item.createdAt)
            date = date.toDateString().split(" ")
            return (
              <>
                <Col lg={12} key={index}>
                  <div className="donation-box mb-4 pt-4 pl-4">
                    <h3 className="donation-heading">
                      {item.userDetail.fullName}
                    </h3>
                    <p className="donation-date">
                      <strong style={{ fontWeight: 900 }}>{date[0]}, </strong>
                      {date[1]} {date[2]} {date[3]}
                    </p>
                    <p className="donation-total">
                      Total : {convertRupiah.convert(item.donateAmount)}
                    </p>
                  </div>
                </Col>
              </>
            )
          }
        })}
        {total?.transaction > 3 && limit < total?.transaction ? (
          <a
            onClick={handleLoadMore}
            className="donate-info-desc mb-4"
            style={{ cursor: "pointer", color: "#616161" }}
          >
            Load More
          </a>
        ) : (
          ""
        )}
      </Row>
    </Container>
  )
}

export default DonationListComponent
