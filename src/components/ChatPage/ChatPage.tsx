import React, { useEffect, useState, useRef } from "react";
import { saveChat, getChat } from "../../DB/ChatSore";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import classes from "./ChatPage.module.css";
import SendIcon from '../../assets/send-icon.svg';
import FileIcon from '../../assets/file-icon.svg';
import { MessageType } from "../../DB/ChatSore";
import ChatSideBar from "../ChatSideBar/ChatSideBar";

interface ChatProps {
  username: string;
  roomId: string;
  setRoomId: (roomId: string) => void;
}

const channel = new BroadcastChannel("chat_updates");

const Chat: React.FC<ChatProps> = ({ username, roomId, setRoomId }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const wasAtBottomRef = useRef(true);

  useEffect(() => {
    const fetchChat = async () => {
      const chat = await getChat(roomId);
      if (chat) {
        setMessages(chat.messages);
      }
    };
    fetchChat();
  }, [roomId]);

  useEffect(() => {
    const handleMessageUpdate = async (event: MessageEvent) => {
      if (event.data.roomId === roomId) {
        const chat = await getChat(roomId);
        if (chat) {
          setMessages(chat.messages);
        }
      }
    };

    channel.addEventListener("message", handleMessageUpdate);
    return () => channel.removeEventListener("message", handleMessageUpdate);
  }, [roomId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setIsAtBottom(atBottom);
      wasAtBottomRef.current = atBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (wasAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      channel.postMessage({ roomId });
      setNewMessage("");
    }
  };

  const addEmoji = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  return (
    <div className={classes.chatContainer}>
      <ChatSideBar username={username} roomId={roomId} setRoomId={setRoomId} />
      <div className={classes.mainChat}>
        <h2>Комната: {roomId}</h2>
        <div className={classes.messages} ref={messagesContainerRef}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.author === username ? classes.myMessage : classes.message}>
              <div className={classes.author}>{msg.author === username ? "Вы" : msg.author} {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className={classes.content}>{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Крепим якорь для скролла */}
        </div>
        <div className={classes.messageBox}>
          <div className={classes.fileUploadWrapper}>
            <label htmlFor="file">
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
          <div className={classes.buttons}>

            <button className={classes.emojiButton} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              😊
            </button>
            <div className={classes.emojiPicker}>
            {showEmojiPicker && <Picker data={data} onEmojiSelect={addEmoji} navPosition="bottom"/>}
            </div>


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
