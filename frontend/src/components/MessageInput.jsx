function MessageInput({
  text,
  setText,
  handleSendMessage,
  sendingMessage,
  handleTyping,
}) {
  return (
    <div className="p-4 bg-white border-t flex gap-3">

      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);

          handleTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        className="flex-1 border rounded px-4 py-2 outline-none"
      />

      <button
        onClick={handleSendMessage}
        disabled={sendingMessage}
        className="bg-black text-white px-6 rounded hover:opacity-90 disabled:opacity-50"
      >
        {sendingMessage ? "Sending..." : "Send"}
      </button>

    </div>
  );
}

export default MessageInput;