import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useHistory } from "react-router-dom"
import { API } from "../config/api"
import { useQuery } from "react-query"

import { Dropdown } from "react-bootstrap"
import NoImage from "../assets/noImage-1.svg"
import IconProfile from "../assets/icon-profile.png"
import IconRaiseFund from "../assets/icon-raisefund.png"
import IconLogout from "../assets/icon-logout.png"
import IconChat from "../assets/conversation.png"

function DropdownComponent(props) {
  const { handleRaisefund, handleProfile, handleChat } = props
  let history = useHistory()

  const [state, dispatch] = useContext(AuthContext)

  /**
   * Request for specific user data from backend
   * Conditional rendering for chat button
   */
  let { data: user } = useQuery("photoCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/user/" + state.user.id)
    return response.data.data.user
  })

  /**
   * Logout
   * @param {*} e
   */
  const handleLogout = (e) => {
    e.preventDefault()
    dispatch({ type: "LOGOUT" })
    history.push("/")
  }
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
          <img
            style={{ width: "55px", height: "55px", borderRadius: "50%" }}
            src={user?.profileImage ? user?.profileImage : NoImage}
            alt="avatar"
          ></img>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleProfile}>
            <img className="mr-3" src={IconProfile} alt="profile" />
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={handleRaisefund}>
            <img className="mr-3" src={IconRaiseFund} alt="raise-fund" />
            Raise Fund
          </Dropdown.Item>
          {user?.userFund.length > 0 && (
            <Dropdown.Item onClick={handleChat}>
              <img
                style={{ width: "38px", height: "36px" }}
                className="mr-3"
                src={IconChat}
                alt="raise-fund"
              />
              Chat
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>
            <img className="mr-3" src={IconLogout} alt="logout" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default DropdownComponent
