import React, { useState } from "react";
import classes from "./LoginPage.module.css";

interface LoginProps {
  onLogin: (username: string, roomId: string) => void;
}

const ChatLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() && roomId.trim()) {
      onLogin(username, roomId);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <h2>Добро пожаловать в Dialogue</h2>
      <form className={classes.inputContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={classes.input}
        />
        <input
          type="text"
          placeholder="ID комнаты"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          className={classes.input}
        />
        <button className={classes.button} type="submit">Войти</button>
      </form>
    </div>
  );
};

export default ChatLogin;
