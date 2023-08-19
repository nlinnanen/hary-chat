import useMessages from "@hooks/useMessages";
import { useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useGetConversationPage } from "src/api/conversation-page/conversation-page";
import HaryAvatar from "./HaryAvatar";
import useHary from "@hooks/useHary";

function Conversation({ databaseKey }: { databaseKey?: string }) {
  const conversationId = useParams().conversationId!;
  const chatRef = useRef<HTMLDivElement>(null);
  const areRef = useRef<HTMLTextAreaElement>(null);

  const {
    newMessage,
    setNewMessage,
    messages,
    handleSendMessage,
    isLoading: conversationLoading,
    isSendMessageLoading,
  } = useMessages(conversationId, databaseKey, chatRef, areRef);

  const { harysMap } = useHary();

  const { data: pageData, isLoading: pageDataLoading } =
    useGetConversationPage();

  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [conversationId]);

  const isLoading = conversationLoading || pageDataLoading;

  const handleKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      handleSendMessage().catch(console.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.height = `${Math.min(e.target.scrollHeight, window.outerHeight / 3)}px`;

    setNewMessage(e.target.value);
  };

  const getMessageList = () => {
    if (!messages || messages.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center text-center">
          <span className="loading loading-lg"></span>
        </div>
      );
    } else {
      return messages.map((message) => {
        const senderIsHary = typeof message.sender === "number";
        return (
          <div
            key={message.timestamp.toString()}
            className={`chat ${message.sentByMe ? "chat-end" : "chat-start"}`}
          >
            {senderIsHary && (
              <div className="avatar placeholder chat-image">
                <div className="w-10 rounded-full bg-base-200">
                  <HaryAvatar haryId={message.sender as number} />
                </div>
              </div>
            )}
            <div className="chat-header opacity-50">
              {senderIsHary && (
                <>
                  {
                    harysMap.get(message.sender as number)?.user?.data
                      ?.attributes?.firstName
                  }{" "}
                  {
                    harysMap.get(message.sender as number)?.user?.data
                      ?.attributes?.lastName
                  }
                  &nbsp;&nbsp;
                </>
              )}
            </div>
            <div
              className={`chat-bubble break-words ${
                !senderIsHary && "chat-bubble-accent"
              }`}
            >
              {message.content}
            </div>
            <div className="chat-footer">
              <time className="text-xs opacity-50">
                {message.timestamp.toLocaleTimeString("fi", {
                  timeStyle: "short",
                })}
              </time>
            </div>
          </div>
        );
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        <span className="loading loading-lg"></span>
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full flex-col overflow-y-auto p-2 py-16">
        {getMessageList()}
        <div ref={chatRef} />
      </div>
      <div
        className="fixed bottom-0 z-20 flex h-18 w-full items-end space-x-2 bg-gradient-to-t from-base-100 from-85% p-5"
      >
        <textarea
          className={`input input-bordered flex-grow h-min-18 h-18`}
          placeholder={
            pageData?.data?.data?.attributes?.inputPlaceholder ??
            "Type a message..."
          }
          onResize={(e) => e.preventDefault()}
          onKeyUp={handleKeyUp}
          value={newMessage}
          ref={areRef}
          onChange={handleChange}
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
