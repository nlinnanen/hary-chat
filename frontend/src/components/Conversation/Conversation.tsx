import useHary from "@hooks/useHary";
import useMessages from "@hooks/useMessages";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageInput from "./Message/MessageInput";
import MessageList from "./Message/MessageList";
import { PiTrashLight } from "react-icons/pi";
import ExportKey from "@components/ExportKey/ExportKey";
import PassphraseModal from "./PassphraseModal";

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
    isError,
    isSendMessageLoading,
    conversation,
    deleteConversation,
    passphrase,
    setPassphrase,
    error,
  } = useMessages(conversationId, databaseKey, chatRef, areRef);

  const { harysMap } = useHary();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation();
    }
  };

  const handlePassphraseKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPassphrase((e.target as HTMLInputElement).value);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [conversationId]);

  const isLoading = conversationLoading;

  if (!passphrase || (error as any)?.message.includes("passphrase")) {
    return (
      <PassphraseModal
        handleKeyUp={handlePassphraseKeyUp}
        errorMessage={(error as any)?.message}
      />
    );
  }

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        {!passphrase && <PassphraseModal handleKeyUp={handlePassphraseKeyUp} />}
        <div className="w-2/3">
          <h1 className="p-6 text-3xl font-bold">Error</h1>
          <p>
            Jotain meni pieleen keskustelua haettaessa. Yritä myöhemmin
            uudelleen. Alla virheilmoitus, joka voi auttaa ongelman ratkaisussa.
          </p>
          <div className="flex w-full items-center justify-center">
            <p className="align-center mt-4 flex p-5 items-center rounded-lg bg-base-300 text-center">
              <div>{(error as any)?.message}</div>
            </p>
          </div>
        </div>
      </div>
    );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-16 w-full items-center justify-end px-2 text-sm font-semibold text-base-content">
        Keskustelussa mukana:&nbsp;{" "}
        {conversation?.harys.map((h, i, a) => {
          const hary = harysMap.get(h.id)?.user?.data?.attributes;
          return (
            <span key={h.id}>
              {hary?.firstName} {hary?.lastName}
              {i !== a.length - 1 && <>,&nbsp;</>}
            </span>
          );
        })}
        {databaseKey != "hary" && (
          <>
            <ExportKey />
            <button
              className="btn btn-ghost mx-4 hover:bg-warning"
              onClick={handleDelete}
            >
              <PiTrashLight className="text-lg" />
            </button>
          </>
        )}
      </div>
      <div className="flex grow flex-col overflow-y-auto p-2 pb-20">
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
