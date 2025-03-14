export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("chatDB", 1);
  
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("chats")) {
          db.createObjectStore("chats", { keyPath: "roomId" });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  export const saveChat = async (roomId: string, messages: any[]) => {
    const db = await openDatabase();
    const transaction = db.transaction("chats", "readwrite");
    const store = transaction.objectStore("chats");
  
    store.put({ roomId, messages });
  };
  
  export const getChat = async (roomId: string): Promise<any | null> => {
    const db = await openDatabase();
    const transaction = db.transaction("chats", "readonly");
    const store = transaction.objectStore("chats");
  
    return new Promise((resolve) => {
      const request = store.get(roomId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  };

  export type MessageType = {
    author: string;
    text: string;
    timestamp: number;
  };

  export type ChatType = {
    roomId: string;
    messages: MessageType[];
  };

  export const getChatsByAuthor = async (author: string): Promise<string[]> => {
    const db = await openDatabase();
    const transaction = db.transaction("chats", "readonly");
    const store = transaction.objectStore("chats");
    
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const chats = request.result;
        const chatIds = chats
          .filter((chat: ChatType) => chat.messages.some((msg: MessageType) => msg.author === author))
          .map((chat: ChatType) => chat.roomId);
        resolve(chatIds);
      };
      request.onerror = () => resolve([]);
    });
  };
  
  
//   export const saveFile = async (file: File): Promise<string> => {
//     const db = await openDatabase();
//     const transaction = db.transaction("files", "readwrite");
//     const store = transaction.objectStore("files");
  
//     const fileReader = new FileReader();
//     return new Promise((resolve, reject) => {
//       fileReader.onloadend = () => {
//         const fileData = fileReader.result;
//         const fileUrl = URL.createObjectURL(fileData as any as Blob);
//         store.put({ id: file.name, fileData: fileData });
//         resolve(fileUrl);
//       };
  
//       fileReader.onerror = (error) => reject(error);
//       fileReader.readAsArrayBuffer(file);
//     });
//   };
  
//   export const openFileDatabase = (): Promise<IDBDatabase> => {
//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open("fileDB", 1);
  
//       request.onupgradeneeded = () => {
//         const db = request.result;
//         if (!db.objectStoreNames.contains("files")) {
//           db.createObjectStore("files", { keyPath: "id" });
//         }
//       };
  
//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject(request.error);
//     });
//   };
  