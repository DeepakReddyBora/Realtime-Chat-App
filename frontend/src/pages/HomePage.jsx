import { useEffect, useRef, useState } from "react";

import api from "../services/api";

import { useChat } from "../context/ChatContext";

import useAuth from "../context/useAuth";

import socket from "../socket";

import Sidebar from "../components/Sidebar";

import ChatArea from "../components/ChatArea";

function HomePage() {
  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [typingUser, setTypingUser] =
    useState("");

  const { selectedUser, setSelectedUser } =
    useChat();

  const { authUser, setAuthUser } =
    useAuth();

  const messagesEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // socket connection + online users
  useEffect(() => {
    if (!authUser) return;

    socket.io.opts.query = {
      userId: authUser._id,
    };

    socket.connect();

    // online users
    socket.on(
      "getOnlineUsers",
      (users) => {
        setOnlineUsers(users);
      }
    );

    // new message
    socket.on(
      "newMessage",
      (newMessage) => {
        if (
          selectedUser &&
          newMessage.senderId ===
            selectedUser._id
        ) {
          setMessages((prev) => [
            ...prev,
            newMessage,
          ]);
        }
      }
    );

    // typing
    socket.on("typing", (username) => {
      setTypingUser(username);

      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    });

    return () => {
      socket.off("getOnlineUsers");

      socket.off("newMessage");

      socket.off("typing");

      socket.disconnect();
    };
  }, [authUser, selectedUser]);

  // fetch users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get(
          "/messages/users"
        );

        setUsers(res.data);
      } catch (error) {
        console.log(
          error.response?.data ||
            error.message
        );
      }
    };

    getUsers();
  }, []);

  // fetch messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!selectedUser) return;

        setLoadingMessages(true);

        const res = await api.get(
          `/messages/${selectedUser._id}`
        );

        setMessages(res.data);
      } catch (error) {
        console.log(
          error.response?.data ||
            error.message
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [selectedUser]);

  // send message
  const handleSendMessage =
    async () => {
      try {
        if (!text.trim()) return;

        setSendingMessage(true);

        const res = await api.post(
          `/messages/send/${selectedUser._id}`,
          {
            text,
          }
        );

        setMessages((prev) => [
          ...prev,
          res.data,
        ]);

        socket.emit(
          "sendMessage",
          res.data
        );

        setText("");
      } catch (error) {
        console.log(
          error.response?.data ||
            error.message
        );
      } finally {
        setSendingMessage(false);
      }
    };

  // typing emit
  const handleTyping = () => {
    if (!selectedUser) return;

    socket.emit("typing", {
      receiverId: selectedUser._id,

      username: authUser.username,
    });
  };

  // logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      setAuthUser(null);

      socket.disconnect();
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">

      <Sidebar
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onlineUsers={onlineUsers}
        handleLogout={handleLogout}
      />

      <ChatArea
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        messages={messages}
        authUser={authUser}
        text={text}
        setText={setText}
        handleSendMessage={
          handleSendMessage
        }
        messagesEndRef={messagesEndRef}
        onlineUsers={onlineUsers}
        loadingMessages={
          loadingMessages
        }
        sendingMessage={
          sendingMessage
        }
        typingUser={typingUser}
        handleTyping={handleTyping}
      />

    </div>
  );
}

export default HomePage;