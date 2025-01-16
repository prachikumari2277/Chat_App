import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { BiDotsVertical } from "react-icons/bi";
import { 
  sendMessageRoute, 
  recieveMessageRoute, 
  clearMessageRoute,
  sendPhotoRoute,
  getPhotoRoute
} from "../utils/APIRoutes"; 
import MenuBar from "./MenuBar";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (!data || !currentChat?._id) {
        console.error("User data or currentChat is missing.");
        return;
      }
  
      try {
        const response = await axios.post(recieveMessageRoute, {
          from: data._id, 
          to: currentChat._id, 
        });
        const sortedMessages = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
  
        setMessages(sortedMessages); 
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages();
  }, [currentChat]);
 
  
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        if (msg.from === currentChat._id || msg.to === currentChat._id) {
          setArrivalMessage({ fromSelf: false, message: msg });
        }
      });
    }
  }, [currentChat, socket]);
  

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);
  
  

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSendMsg = async (msgOrFile) => {
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
  
    try {
      let newMessage;
      if (msgOrFile instanceof File) {
        const formData = new FormData();
        formData.append("image", msgOrFile);
        formData.append("from", data._id);
        formData.append("to", currentChat._id);
  
        const response = await axios.post(sendPhotoRoute, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (response.data.success) {
          newMessage = {
            fromSelf: true,
            message: response.data.imageUrl,
          };
          setMessages((prev) => [...prev, newMessage]);
        } else {
          console.error("Backend error:", response.data.msg);
        }
      } else {
        const response = await axios.post(sendMessageRoute, {
          from: data._id,
          to: currentChat._id,
          message: msgOrFile,
        });
  
        if (response.data.msg === "Message added successfully.") {
          newMessage = {
            fromSelf: true,
            message: msgOrFile,
          };
          setMessages((prev) => [...prev, newMessage]);
        } else {
          console.error("Backend error:", response.data.msg);
        }
      }
  
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg: newMessage?.message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  const handleClearMessages = async () => {
    try {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      await axios.post(clearMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages([]); 
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  return (
    <Container>
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
        <div className="vertical">
          <button type="button" onClick={toggleMenu}>
            <BiDotsVertical />
          </button>
          {menuVisible && (
            <MenuBar
              toggleMenu={toggleMenu}
              handleClearMessages={handleClearMessages}
            />
          )}
        </div>
      </div>
      
      <div className="chat-messages">
  {messages.map((message) => (
    <div ref={scrollRef} key={uuidv4()}>
      <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
        <div className="content">
          {message.message.startsWith("/uploads/") ? (
            <img
              src={`http://localhost:5000${message.message}`} 
              alt="Shared"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                borderRadius: "8px",
              }}
            />
          ) : (
            <p>{message.message}</p>
          )}
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
  grid-template-rows: 10% 80% 10%;
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

    .vertical {
      position: relative;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: #9a86f3;
        border: none;
        cursor: pointer;
        svg {
          font-size: 1.3rem;
          color: #ebe7ff;
        }
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
