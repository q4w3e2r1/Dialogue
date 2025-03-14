import React, { useEffect, useState } from "react";
import { saveChat, getChat, getChatsByAuthor } from "../../DB/ChatSore";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import classes from "./ChatPage.module.css";
import SendIcon from '../../assets/send-icon.svg';
import FileIcon from '../../assets/file-icon.svg';
import { MessageType} from "../../DB/ChatSore";
import ChatSideBar from "../ChatSideBar/ChatSideBar";

interface ChatProps {
  username: string;
  roomId: string;
}

const Chat: React.FC<ChatProps> = ({ username, roomId }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchChat = async () => {
      const chat = await getChat(roomId);
      if (chat) {
        setMessages(chat.messages);
      }
    };
    fetchChat();
  }, [roomId]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message: MessageType = {
        author: username,
        text: newMessage,
        timestamp: Date.now(),
      };
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      await saveChat(roomId, updatedMessages);
      setNewMessage("");
    }
  };

  const addEmoji = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  return (
    <div className={classes.chatContainer}>
      <ChatSideBar username={username} roomId={roomId} />


      <div className={classes.mainChat}>
        <h2>Комната: {roomId}</h2>
        <div className={classes.messages}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.author === username ? classes.myMessage : classes.message}>
              <div className={classes.author}>{msg.author === username ? "Вы" : msg.author} {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className={classes.content}>{msg.text}</div>
            </div>
          ))}
        </div>


        <div className={classes.messageBox}>


          <div className={classes.fileUploadWrapper}>
            <label  htmlFor="file">
              <img src={FileIcon} alt="File" />
              <span className={classes.tooltip}>Add an image</span>
            </label>
            <input type="file" className={classes.fileUpload} name="file" id="file" />
          </div>

          <input
            type="text"
            placeholder="Введите сообщение"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            className={classes.messageInput}
          />


          <div  className={classes.buttons}>
            <button className={classes.emojiButton} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              😊
            </button>
            {showEmojiPicker && <Picker data={data} onEmojiSelect={addEmoji} navPosition="bottom" />}


            <button className={classes.sendButton} onClick={sendMessage}>
              <img src={SendIcon} alt="Send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;