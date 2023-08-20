import useHary from "@hooks/useHary";
import useMessages from "@hooks/useMessages";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetConversationPage } from "src/api/conversation-page/conversation-page";
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

  const { data: pageData, isLoading: pageDataLoading } =
    useGetConversationPage();

  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [conversationId]);

  const isLoading = conversationLoading || pageDataLoading;

  

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        <span className="loading loading-lg"></span>
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col overflow-y-auto p-2 py-16">
        <div>{}</div>
        <MessageList messages={messages} harysMap={harysMap} />
        <div ref={chatRef} />
      </div>
      <MessageInput
        handleSendMessage={handleSendMessage}
        isSendMessageLoading={isSendMessageLoading}
        value={newMessage}
        setNewMessage={setNewMessage}
        ref={areRef}
        disabled={false}
      />
    </div>
  );
}

export default Conversation;
