import useMessages from "@hooks/useMessages";
import { FiSend } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useGetConversationPage } from "src/api";

function Conversation({
  conversationId,
  databaseKey,
}: {
  conversationId: number;
  databaseKey?: string;
}) {
  const { newMessage, setNewMessage, messages, handleSendMessage } =
    useMessages(conversationId, databaseKey);
  const { data: pageData, isLoading } = useGetConversationPage();

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSendMessage().catch(console.error);
    }
  };

  const getMessageList = () => {
    if (messages.length === 0) {
      return (
          <div className="flex h-full flex-col items-center justify-center">
            <ReactMarkdown skipHtml={false}>{pageData?.data?.data?.attributes?.emptyConversationText ?? 'No messages yet!'}</ReactMarkdown>
          </div>
      );
    } else {
      return messages.map((message, index) => (
        <div
          key={index}
          className={`chat ${message.sentByMe ? "chat-end" : "chat-start"}`}
        >
          <time className="text-xs opacity-50">
            {message.timestamp.toLocaleTimeString("fi", {
              timeStyle: "short",
            })}
          </time>
          <div className="chat-bubble break-words">{message.content}</div>
        </div>
      ));
    }
  };

  if (isLoading)
    return <span className="loading loading-ring loading-lg"></span>;

  return (
    <div className="flex h-[93vh] w-full flex-col">
      <div className="flex h-full flex-col space-y-4 overflow-y-auto p-2">
        {getMessageList()}
      </div>
      <div className="flex space-x-2 p-2">
        <input
          type="text"
          className="input input-bordered flex-grow"
          placeholder={
            pageData?.data?.data?.attributes?.inputPlaceholder ??
            "Type a message..."
          }
          onKeyUp={handleKeyUp}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-accent" onClick={handleSendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}

export default Conversation;
