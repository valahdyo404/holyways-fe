import React, { useEffect, useState, useContext } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"
import Chat from "../components/Chat"
import Contact from "../components/Contact"
import NavbarComponent from "../components/Navbar"
import { io } from "socket.io-client"

let socket

export default function ChatFundraiserpage() {
  const [state] = useContext(AuthContext)

  /**
   * Store specific user data when contact is clicked (active)
   */
  const [contact, setContact] = useState(null)

  /**
   * Store all contacts (user data) that have been chat to this user (fundraiser)
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
      console.log("contact", contact)
      socket.emit("load messages", contact?.id)
    })
    socket.on("connect_error", (err) => {
      console.error(err.message) // not authorized
    })
    loadContacts()
    loadMessages()

    return () => {
      socket.disconnect()
    }
  }, [messages])

  /**
   * Load contact function send request by idFund to backend
   * @returns user data (all donor that already send message), and set all user data to contacts variable
   */
  const loadContacts = () => {
    socket.emit("load donor contacts", state.user.id)
    socket.on("donor contacts", (data) => {
      console.log(data)

      let dataContacts = data.filter(
        (item) =>
          item.id !== state.user.id &&
          (item.recipientMessage.length > 0 || item.senderMessage.length > 0)
      )

      dataContacts = dataContacts.map((item) => {
        let lastChat = null

        // If sender message and recipient message exist
        if (
          item?.senderMessage.length > 0 &&
          item?.recipientMessage.length > 0
        ) {
          if (
            item?.senderMessage[item.senderMessage.length - 1]?.id >
            item?.recipientMessage[item.recipientMessage.length - 1]?.id
          ) {
            lastChat =
              item?.senderMessage[item.senderMessage.length - 1]?.message
          } else {
            lastChat =
              item?.recipientMessage[item.recipientMessage.length - 1]?.message
          }
        }
        // If sender message only or recipient message only
        if (
          item?.senderMessage.length > 0 &&
          item?.recipientMessage.length === 0
        ) {
          lastChat = item.senderMessage[item.senderMessage.length - 1]?.message
        }
        if (
          item?.senderMessage.length === 0 &&
          item?.recipientMessage.length > 0
        ) {
          lastChat =
            item.recipientMessage[item.recipientMessage.length - 1]?.message
        }

        return {
          ...item,
          fullName: item.fullName + " - Donor",
          message: lastChat ? lastChat : "Click here to start message",
        }
      })
      setContacts(dataContacts)
    })
  }

  /**
   * listening if new messages created from backend
   * create object idSender and message for rendering in chats components
   */
  const loadMessages = (value) => {
    socket.on("messages", async (data) => {
      console.log(data)

      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }))
        console.log(dataMessages)
        setMessages(dataMessages)
      }
      const chatMessagesElm = document.getElementById("chat-messages")
      chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight
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
   * Handle when user press enter in chat input
   * @param {object} e input value and keypress type
   */
  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      }

      //emit event send message
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
              user={state.user}
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
