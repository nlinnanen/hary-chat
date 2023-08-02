import useMessages from "@hooks/useMessages";
import { createRef, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useGetConversationPage } from "src/api/conversation-page/conversation-page";

function Conversation({
  conversationId,
  databaseKey,
}: {
  conversationId: number;
  databaseKey?: string;
}) {
  const chatRef = useRef<HTMLDivElement>(null);

  const {
    newMessage,
    setNewMessage,
    messages,
    handleSendMessage,
    isLoading: conversationLoading,
    isSendMessageLoading,
  } = useMessages(conversationId, databaseKey, chatRef);

  const { data: pageData, isLoading: pageDataLoading } =
    useGetConversationPage();

  const isLoading = conversationLoading || pageDataLoading;

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSendMessage().catch(console.error);
    }
  };

  const getMessageList = () => {
    if (!messages || messages.length === 0) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <div className="w-2/3 space-y-5">
            <ReactMarkdown skipHtml={false}>
              {pageData?.data?.data?.attributes?.emptyConversationText ??
                "No messages yet!"}
            </ReactMarkdown>
          </div>
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
    return (
      <div className="flex h-[92vh] w-full items-center justify-center text-center">
        <span className="loading loading-lg"></span>
      </div>
    );

  return (
    <div className="flex h-[92vh] w-full flex-col">
      <div className="flex h-full flex-col pt-20 space-y-4 overflow-y-auto p-2">
        {getMessageList()}
        <div ref={chatRef} />
      </div>
      <div className="fixed bottom-0 flex w-full space-x-2 p-5">
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
          {isSendMessageLoading ? (
            <span className="loading loading-lg"></span>
          ) : (
            <FiSend />
          )}
        </button>
      </div>
    </div>
  );
}

export default Conversation;
