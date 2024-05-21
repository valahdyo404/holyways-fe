import { useState, useContext, useEffect } from "react"
import { useHistory, Link } from "react-router-dom"
import { Nav, Navbar, Button } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"
import DropdownComponent from "./Dropdown"
import LoginModalComponent from "./LoginModal"
import RegisterModalComponent from "./RegisterModal"
import Logo from "../assets/brand-logo.png"

function NavbarComponent() {
  const history = useHistory()
  const [state, dispatch] = useContext(AuthContext)

  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  /**
   * Handle modal
   * @returns hide/show login and register modal
   */
  const handleShowLogin = () => setShowLogin(true)
  const handleShowRegister = () => setShowRegister(true)
  const closeLogin = () => setShowLogin(false)
  const closeRegister = () => setShowRegister(false)

  /**
   * Rerender when state (user data) change
   */
  useEffect(() => {}, [state])

  /**
   * Handle all dropdown button
   */
  const handleProfile = () => {
    history.push("/profile")
  }

  const handleRaisefund = () => {
    history.push("/raisefund")
  }

  const handleChat = () => {
    history.push("/chat-fundraiser")
  }

  return (
    <>
      <Navbar className="navTheme">
        <Navbar.Brand as={Link} to="/">
          <img
            alt=""
            src={Logo}
            width="65"
            className="d-inline-block align-top"
          />{" "}
        </Navbar.Brand>
        <Nav className="ml-auto px-2">
          {state.isLogin === true ? (
            <DropdownComponent
              handleProfile={handleProfile}
              handleRaisefund={handleRaisefund}
              handleChat={handleChat}
            />
          ) : (
            <>
              <Button onClick={handleShowLogin} className="navBtnLogin">
                Login
              </Button>
              <Button onClick={handleShowRegister} className="navBtnRegister">
                Register
              </Button>
            </>
          )}
        </Nav>
      </Navbar>

      <LoginModalComponent
        closeLogin={closeLogin}
        showLogin={showLogin}
        handleShowRegister={handleShowRegister}
      />
      <RegisterModalComponent
        closeRegister={closeRegister}
        showRegister={showRegister}
      />
    </>
  )
}

export default NavbarComponent
