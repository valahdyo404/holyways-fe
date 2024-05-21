import { API } from "../config/api"
import { useQuery } from "react-query"
import { useHistory, Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import convertRupiah from "rupiah-format"

import NavbarComponent from "../components/Navbar"
import { Button, Container, Row, Col } from "react-bootstrap"
import ProfilePhoto from "../assets/profile-photo.png"
import NoImage from "../assets/noImage-1.svg"
import NoData from "../assets/noData-2.svg"

function Profilepage() {
  let history = useHistory()
  const [state] = useContext(AuthContext)

  /**
   * Request data from backend for user data
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
   * Handle when edit button click redirect to edit profile page
   */
  const handleEditProfile = () => {
    history.push("/edit-profile")
  }

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
            <Button
              className="donate-btn w-75 mt-3"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </Col>
          <Col lg={6}>
            <h1 className="profile-heading">History Donation</h1>
            {profile?.donateHistory.length > 0 ? (
              profile?.donateHistory.map((item, index) => {
                let date = new Date(item.createdAt)
                date = date.toDateString().split(" ")
                return (
                  <Row className="mb-3">
                    <Col>
                      <div className="donation-box">
                        <h3 className="donation-heading">
                          <Link
                            style={{ color: "black" }}
                            to={"/fund/" + item.fundDetail.id}
                          >
                            {item.fundDetail.title}
                          </Link>
                        </h3>
                        <p className="donation-date">
                          <strong style={{ fontWeight: 900 }}>
                            {date[0]},{" "}
                          </strong>
                          {date[1]} {date[2]} {date[3]}
                        </p>

                        <Row>
                          <Col lg={8}>
                            <p className="donation-total">
                              Total : {convertRupiah.convert(item.donateAmount)}
                            </p>
                          </Col>
                          <Col>
                            {item.status === "success" ? (
                              <p className="donation-status-success">
                                Finished
                              </p>
                            ) : (
                              <p className="donation-status-pending">Pending</p>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )
              })
            ) : (
              <>
                <img
                  style={{
                    opacity: "0.5",
                    marginTop: "4rem",
                  }}
                  className="d-block w-50 mx-auto mb-4"
                  src={NoData}
                  alt="no-data"
                ></img>
                <h4 style={{ opacity: "0.5" }} className="text-center">
                  No Data
                </h4>
              </>
            )}
            {}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profilepage
