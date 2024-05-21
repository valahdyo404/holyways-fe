import React, { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import NavbarComponent from "../components/Navbar"
import { Container, Row, Col } from "react-bootstrap"
import { io } from "socket.io-client"
import Contact from "../components/Contact"
import Chat from "../components/Chat"

let socket

export default function ChatDonorpage() {
  const [state] = useContext(AuthContext)
  const idFund = useParams()

  /**
   * Store specific user data when contact is clicked (active)
   */
  const [contact, setContact] = useState(null)

  /**
   * Store contacts (user data) fundraiser
   */
  const [contacts, setContacts] = useState([])

  /**
   * Store messages when contact is clicked
   */
  const [messages, setMessages] = useState([])

  /**
   * Setting up socket.io when component is Didmount and when messages change
   * Load contact fundraiser
   * Load messages
   */
  useEffect(() => {
    socket = io(process.env.REACT_APP_SERVERURL, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("accessToken"),
      },
      query: {
        id: state.user.id,
      },
    })

    socket.on("new message", () => {
      socket.emit("load messages", contact?.id)
    })

    loadContact()
    loadMessages()
    return () => {
      socket.disconnect()
    }
  }, [messages])

  /**
   * Load contact function send request by idFund to backend
   * @returns user data (fundraiser), and set user data to contacts variable
   */
  const loadContact = () => {
    socket.emit("load fundraiser contact", idFund)
    socket.on("fundraiser contact", async (data) => {
      const dataContact = {
        ...data,
        fullName: data.fullName + " - Fundraiser",
        message:
          messages.length > 0
            ? messages[messages.length - 1].message
            : "Click here to start message",
      }
      setContacts([dataContact])
    })
  }

  /**
   * Handle when contact clicked
   * @param {object} data data from event target in contact components
   */
  const onClickContact = (data) => {
    setContact(data)
    socket.emit("load messages", data.id)
  }

  /**
   * listening if new messages created from backend
   * create object idSender and message for rendering in chats components
   */
  const loadMessages = () => {
    socket.on("messages", async (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }))
        setMessages(dataMessages)
      }
      const chatMessagesElm = document.getElementById("chat-messages")
      chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight
    })
  }

  /**
   * Handle when user press enter in chat input
   * @param {object} e input value and keypress type
   */
  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      }

      socket.emit("send message", data)
      e.target.value = ""
    }
  }

  return (
    <>
      <NavbarComponent />
      <Container fluid style={{ height: "89.5vh" }}>
        <Row>
          <Col
            md={3}
            style={{ height: "89.5vh" }}
            className="px-3 border-end border-dark overflow-auto"
          >
            <Contact
              dataContact={contacts}
              clickContact={onClickContact}
              contact={contact}
            />
          </Col>
          <Col md={9} style={{ maxHeight: "89.5vh" }} className="px-0">
            <Chat
              contact={contact}
              messages={messages}
              user={state.user}
              sendMessage={onSendMessage}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
