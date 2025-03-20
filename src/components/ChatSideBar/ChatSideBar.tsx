import { useState, useEffect } from "react";
import { getChatsByAuthor } from "../../DB/ChatSore";
import classes from "./ChatSideBar.module.css";

const ChatSidebar = ({ username, roomId, setRoomId }: { username: string, roomId: string, setRoomId: (roomId: string) => void }) => {
  const [chatIds, setChatIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const ids = await getChatsByAuthor(username);
      setChatIds(ids);
    };

    fetchChats();
  }, [username]);

  return (
    <>
      <div className={classes.sidebar}>
        <h3>Ваши чаты</h3>
        <div className={classes.chatList}>
          {chatIds.length > 0 ? (
            chatIds.map((chatId) => (
              <div 
              className={`${classes.chatItem} ${chatId === roomId ? classes.active : ""}`} key={chatId}
              onClick={() => setRoomId(chatId)}
              >
                {chatId}
              </div>
            ))
          ) : (
            <p>Нет чатов</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
