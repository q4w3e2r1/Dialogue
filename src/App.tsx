import './App.css'
import LoginPage from './components/LoginPage/LoginPage'
import { useState } from 'react'
import ChatPage from './components/ChatPage/ChatPage'

function App() {
  const [username, setUsername] = useState<string>("Артём");
  const [roomId, setRoomId] = useState<string>("123");

  const handleLogin = (username: string, roomId: string) => {
    console.log(`Вы вошли в комнату ${roomId} как ${username}`);
    setUsername(username);
    setRoomId(roomId);
  };

  return (
    <div className="App">
      {username && roomId ? (
        <ChatPage username={username} roomId={roomId} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
