import { useState, useContext } from "react"
import { useHistory } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useQuery } from "react-query"
import { API } from "../config/api"

import NavbarComponent from "../components/Navbar"
import RegisterModalComponent from "../components/RegisterModal"
import DonateCardComponent from "../components/DonateCard"
import LoginModalComponent from "../components/LoginModal"
import { Button, Container, Row, Col } from "react-bootstrap"
import HeaderImage_1 from "../assets/1340554718-1.png"
import HeaderImage_2 from "../assets/1340554718-2.png"
import DonateImage_1 from "../assets/donate-1.png"
import DonateImage_2 from "../assets/donate-2.png"
import DonateImage_3 from "../assets/donate-3.png"

function Homepage() {
  let history = useHistory()

  const isLogin = localStorage.getItem("isLogin")
  const [state] = useContext(AuthContext)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  /**
   *
   * @returns handle show/hide register and login modal
   */
  const handleShowLogin = () => setShowLogin(true)
  const handleShowRegister = () => setShowRegister(true)
  const closeLogin = () => setShowLogin(false)
  const closeRegister = () => setShowRegister(false)

  /**
   * request fund list data from backend
   */
  let { data: fundList } = useQuery("fundListCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/funds")
    return response?.data.data.fund
  })

  return (
    <>
      <NavbarComponent />
      <Container fluid className="header-wrapper">
        <Row>
          <Col lg={7}>
            <h1 className="heading-font light-color">
              While you are still standing, try to reach out to the people who
              are falling.
            </h1>
            <p className="header-desc-font light-color">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <Button href="#donate-now" className="header-btn">
              Donate Now
            </Button>
          </Col>
          <Col lg={5}>
            <img src={HeaderImage_1} className="header-img-1" alt="hero1"></img>
          </Col>
        </Row>
      </Container>
      <Container fluid className="content-wrapper">
        <Row>
          <Col lg={4}>
            <img src={HeaderImage_2} className="header-img-2" alt="hero2"></img>
          </Col>
          <Col className="content-desc" lg={8}>
            <h1 className="heading-font dark">
              Your donation is very helpful for people affected by forest fires
              in Kalimantan.
            </h1>
            <Row>
              <Col lg={6}>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </Col>
              <Col lg={5}>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container fluid className="donate-wrapper">
        <h1 id="donate-now" class="donate-heading">
          Donate Now
        </h1>
        <Row className="d-flex justify-content-center">
          {fundList?.map((item, index) => {
            let money = 0
            let dateExpired = new Date() >= new Date(item.targetDate)
            if (item.userDonate) {
              item.userDonate.forEach((list) => {
                if (list.status === "success") money += list.donateAmount
              })
            }
            if (money <= item.goal || dateExpired) {
              return (
                <>
                  <Col lg={4} md={6} className="donate-box">
                    <DonateCardComponent
                      closeLogin={closeLogin}
                      handleShowLogin={handleShowLogin}
                      isLogin={isLogin}
                      id={item.id}
                      image={item.thumbnail}
                      progress={(money / item.goal) * 100}
                      total={money}
                      title={item.title}
                      desc={item.description}
                    />
                  </Col>
                </>
              )
            }
          })}
          {/* 
          <Col lg={4} md={6} className="donate-box">
            <DonateCardComponent
              closeLogin={closeLogin}
              handleShowLogin={handleShowLogin}
              isLogin={isLogin}
              image={DonateImage_3}
              progress={80}
              total={"60000000"}
              title={"Please our brothers in flores"}
              desc={
                "Some quick example text to build on the card title and make up the bulk of the card's content."
              }
            />
          </Col> */}
        </Row>
      </Container>
      <LoginModalComponent
        closeLogin={closeLogin}
        showLogin={showLogin}
        handleShowRegister={handleShowRegister}
      />
      <RegisterModalComponent
        showRegister={showRegister}
        closeRegister={closeRegister}
      />
    </>
  )
}

export default Homepage
