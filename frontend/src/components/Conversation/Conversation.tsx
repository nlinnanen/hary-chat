import useHary from "@hooks/useHary";
import useMessages from "@hooks/useMessages";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageInput from "./Message/MessageInput";
import MessageList from "./Message/MessageList";

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
    conversation,
  } = useMessages(conversationId, databaseKey, chatRef, areRef);

  const { harysMap } = useHary();

  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [conversationId]);

  const isLoading = conversationLoading;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col overflow-y-auto p-2 py-20">
        <div className="fixed top-0 z-10 flex h-16 w-full items-center justify-end bg-gradient-to-b from-base-100 from-80% pr-10 text-sm font-semibold text-base-content">
          Conversation with&nbsp;
          {conversation?.harys.map((h, i, a) => {
            const hary = harysMap.get(h.id)?.user?.data?.attributes;
            return (
              <span key={h.id}>
                {hary?.firstName} {hary?.lastName}
                {i !== a.length - 1 && <>,&nbsp;</>}
              </span>
            );
          })}
        </div>
        <MessageList messages={messages} harysMap={harysMap} />
        <div ref={chatRef} />
      </div>
      <MessageInput
        handleSendMessage={handleSendMessage}
        isSendMessageLoading={isSendMessageLoading}
        value={newMessage}
        setNewMessage={setNewMessage}
        areaRef={areRef}
        disabled={false}
      />
    </div>
  );
}

export default Conversation;
