/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
} from "react";

const ChatContext = createContext();

function ChatProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

const useChat = () => {
  return useContext(ChatContext);
};

export { ChatProvider, useChat };