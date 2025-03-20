import './App.css'
import LoginPage from './components/LoginPage/LoginPage'
import { useState } from 'react'
import ChatPage from './components/ChatPage/ChatPage'
import { clearChats } from './DB/ChatSore';

function App() {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const handleLogin = (username: string, roomId: string) => {
    console.log(`Вы вошли в комнату ${roomId} как ${username}`);
    setUsername(username);
    setRoomId(roomId);
    //clearChats();
  };

  return (
    <div className="App">
      {username && roomId ? (
        <ChatPage username={username} roomId={roomId} setRoomId={setRoomId} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
