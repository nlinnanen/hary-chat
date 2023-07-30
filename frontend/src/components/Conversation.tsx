import useMessages from "@hooks/useMessages";
import { FiSend } from "react-icons/fi";

function Conversation({ conversationId }: { conversationId: number }) {
  const { newMessage, setNewMessage, messages, handleSendMessage } =
    useMessages(conversationId);

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSendMessage().catch(console.error);
    }
  };

  return (
    <div className="flex flex-col h-[93vh]">
      <div className="overflow-y-auto space-y-4 flex h-full flex-col align-bottom p-2">
        {messages.map((message, index) => (
          <div key={index} className="float-right dark:bg-gray-600 rounded-md self-end w-fit break-words max-w-md py-1 px-2">
            <div>{message.content}</div>
            <div className="text-sm text-gray-500">
              {message.timestamp.toLocaleTimeString("fi", { timeStyle: "short" })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2 p-2">
        <input
          type="text"
          className="flex-grow input input-bordered"
          placeholder="Type a message..."
          onKeyUp={handleKeyUp}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="btn btn-accent"
          onClick={handleSendMessage}
        >
          <FiSend/>
        </button>
      </div>
    </div>
  );
}

export default Conversation;
