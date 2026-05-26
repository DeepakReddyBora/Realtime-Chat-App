import { ArrowLeft } from "lucide-react";

import MessageInput from "./MessageInput";

function ChatArea({
  selectedUser,
  setSelectedUser,
  messages,
  authUser,
  text,
  setText,
  handleSendMessage,
  messagesEndRef,
  onlineUsers,
  loadingMessages,
  sendingMessage,
  typingUser,
  handleTyping,
}) {
  return (
    <div
      className={`${
        selectedUser
          ? "flex"
          : "hidden md:flex"
      } flex-1 flex-col`}
    >

      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center px-6 gap-3">

        {selectedUser ? (
          <>
            <button
              onClick={() => setSelectedUser(null)}
              className="md:hidden"
            >
              <ArrowLeft />
            </button>

            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">

              {selectedUser.username
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <p className="font-semibold">
                {selectedUser.username}
              </p>

              <p className="text-sm text-gray-500">

                {onlineUsers.includes(
                  selectedUser._id
                )
                  ? "Online"
                  : "Offline"}

              </p>

            </div>
          </>
        ) : (
          <p className="text-xl font-semibold">
            Select a user
          </p>
        )}

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

        {selectedUser ? (
          loadingMessages ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-xl">

              Loading messages...

            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-2xl font-semibold">

              Start the conversation 👋

            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`max-w-75 md:max-w-100 w-fit p-3 rounded-lg transition-all ${
                    message.senderId === authUser._id
                      ? "bg-black text-white self-end"
                      : "bg-white self-start"
                  }`}
                >
                  <div>

                    <p>{message.text}</p>

                    <p className="text-xs opacity-70 mt-1">

                      {new Date(
                        message.createdAt
                      ).toLocaleTimeString()}

                    </p>

                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {typingUser && (
                <p className="text-sm text-gray-500 italic">

                  {typingUser} is typing...

                </p>
              )}

              <div ref={messagesEndRef}></div>
            </>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-400">

            Select a user to start chatting

          </div>
        )}

      </div>

      {/* Input */}
      {selectedUser && (
        <MessageInput
          text={text}
          setText={setText}
          handleSendMessage={handleSendMessage}
          sendingMessage={sendingMessage}
          handleTyping={handleTyping}
        />
      )}

    </div>
  );
}

export default ChatArea;