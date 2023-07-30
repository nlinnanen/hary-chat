import useMessages from "./hooks/useMessages";

function Conversation({ conversationId }: { conversationId: number }) {
  const { newMessage, setNewMessage, messages, handleSendMessage } =
    useMessages(conversationId);

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSendMessage().catch(console.error);
    }
  };
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 max-w-md rounded-md p-2 ${
              message.sentByMe ? "bg-white" : "bg-blue-200"
            } shadow`}
          >
            <div>{message.content}</div>
            <div className="text-sm text-gray-500">
              {message.timestamp.toLocaleTimeString("fi", {
                timeStyle: "short",
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          className="mr-1 h-10 flex-1 rounded-md bg-white px-2"
          placeholder="Type a message..."
          onKeyUp={handleKeyUp}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="h-10 w-10 rounded-full bg-blue-200"
          onClick={handleSendMessage}
        >
          M
        </button>
      </div>
    </>
  );
}

export default Conversation;
