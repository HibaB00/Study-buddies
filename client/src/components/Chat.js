import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import './Chat.css'

function Chat({ socket, username, room , props}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomInfo, setRoomId] = useState({
    roomId: ''
  })
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes()
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    async function getOldChats()
    {
        const roomChat = {...roomInfo, roomId: room};
        setRoomId(roomChat);
        const body = roomChat;
        try{
            let res = await fetch('http://localhost:5000/posts/getRoomInfo', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : true,
                "mode": "cors",
                "Content-type": "application/json"
                },
                body:JSON.stringify(body)
            });
            let data = await res.json();
            data.oldmessages.forEach((message) => setMessageList((list) => [...list, message]));
        }catch(error){
            console.log({error: error.message})
        }
    }
    getOldChats();
  }, [room]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>)
  
}

export default Chat;