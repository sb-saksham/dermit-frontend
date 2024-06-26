"use client"
import React, { useState, useContext } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "../../context/AuthContext";
 
export default function Chat({params}) {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const { user } = useContext(AuthContext);

  const { readyState, sendJsonMessage } = useWebSocket(user ? `ws://127.0.0.1:8000/${params.conversationName}` : null, {
    queryParams: {
      token: user ? user.token : "",
    },
    onOpen: () => {
      console.log("Connected!");
    },
    onClose: () => {
      console.log("Disconnected!");
    },
    // onMessage handler
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "welcome_message":
          setWelcomeMessage(data.message);
          break;
        case "chat_message_echo":
          setMessageHistory((prev) => prev.concat(data));
          break;
        default:
          bash.error("Unknown message type!");
          break;
      }
    }
  });
 
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];
 
  function handleChangeMessage(e) {
    setMessage(e.target.value);
  }
 
  function handleChangeName(e) {
    setName(e.target.value);
  }
 
  const handleSubmit = () => {
    sendJsonMessage({
      type: "chat_message",
      message,
      name
    });
    setName("");
    setMessage("");
  };
 
  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      <p>{welcomeMessage}</p>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChangeName}
        value={name}
        className="shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"
      />
      <input
        name="message"
        placeholder="Message"
        onChange={handleChangeMessage}
        value={message}
        className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"
      />
      <button className="ml-3 bg-gray-300 px-3 py-1" onClick={handleSubmit}>
        Submit
      </button>
      <hr />
      <ul>
        {messageHistory.map((message, idx) => (
          <div className="border border-gray-200 py-3 px-3" key={idx}>
            {message.name}: {message.message}
          </div>
        ))}
      </ul>
    </div>
  );
}
