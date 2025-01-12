import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, clearMessageRoute } from "../utils/APIRoutes"; // Add the clearMessageRoute import
import Vertical from "./Vertical";
import { BiCaretRight } from "react-icons/bi";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, [currentChat]);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleSendMsg = async (msg) => {
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const handleClearMessages = async () => {
    try {
      const data = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(clearMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages([]); 
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  return (
    <Container menuVisible={menuVisible}>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Vertical toggleMenu={toggleMenu} />
      </div>
      {menuVisible && (
        <div className="menu">
          <div className="part" onClick={handleClearMessages}>
            <div className="name">
              <h4>Clear Chat</h4>
            </div>
          </div>
          <div className="part">
            <div className="name">
              <h4>Block</h4>
            </div>
          </div>
          <div className="part">
            <div className="name">
              <h4>More</h4>
              <BiCaretRight />
            </div>
          </div>
        </div>
      )}
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: ${({ menuVisible }) =>
    menuVisible ? "10% 30% 50% 10%" : "10% 80% 10%"};
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar img {
        height: 3rem;
      }
      .username h3 {
        color: white;
      }
    }
  }

  .menu {
    background-color: #ffffff15;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    margin-left: auto;
    margin-right: 2rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
    padding: 1rem;
    transition: 0.5s ease-in-out;
    &::-webkit-scrollbar {
      width: 0;
    }
    .part {
      background-color: #ffffff34;
      min-height: 3rem;
      width: 100%;
      border-radius: 0.2rem;
      padding: 0.5rem;
      display: flex;
      flex-direction:row;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.1s ease;
      
      &:hover {
        background-color: #9a86f3;
      }
      .name{
        color:white;
        display: flex;
        flex-direction:row;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
        text-align: right; /* Align text to the right */
        border-top-right-radius: 0;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
        text-align: left; /* Align text to the left */
        border-top-left-radius: 0;
      }
    }
  }
`;

