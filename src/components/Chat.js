import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import "../styles/Chat.css";
import { auth, db } from "../firebase";

const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  //bringin the room that chosed in enter room page
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    //adding the new messages to the old messages
    const unsubscribe = onSnapshot(queryMessages, (snapShot) => {
      let messages = [];
      snapShot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);
  //sending messages and stock them in the data base
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });
    setNewMessage("");
  };
  //function that refresh the page and moves the user to change another room
  function refreshPage() {
    window.location.reload();
  }
  //function that capitalize the first char in a message
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to : {room.toUpperCase()}</h1>
      </div>
      <div>
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <div>
              <span className="user">{message.user}</span>
              <span className="msg">{capitalizeFirst(message.text)}</span>
              <span className="time">
                {new Intl.DateTimeFormat("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          className="new-message-input"
          placeholder="Type.."
          value={newMessage}
        />
        <button type="submit" className="send-button">
          Send
        </button>
        <button className="send-button" type="button" onClick={refreshPage}>
          {" "}
          <span>Change the Room</span>{" "}
        </button>
      </form>
    </div>
  );
};

export default Chat;
