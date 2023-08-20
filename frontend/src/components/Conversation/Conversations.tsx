import Conversation from "@components/Conversation/Conversation";
import useConversations from "@hooks/useConversations";
import { RxHamburgerMenu } from "react-icons/rx";
import ConversationList from "./ConversationList";
import NewConversation from "./New/NewConversation";

export default function Conversations({
  getConversationIds,
  databaseKey,
}: {
  getConversationIds: () => Promise<(string | undefined)[]>;
  databaseKey?: string;
}) {
  const {
    conversationId,
    conversationIds,
    setConversationId,
    newConversation,
    createConversation,
  } = useConversations(getConversationIds);

  if (!conversationIds) return null;

  return (
    <div className="drawer h-screen lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-30">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ConversationList
          conversationIds={conversationIds}
          conversationId={conversationId}
          setConversationId={setConversationId}
          newConversation={newConversation}
          databaseKey={databaseKey}
        />
      </div>
      <div className="drawer-content max-h-screen items-center justify-center">
        <div className="fixed top-0 z-10 h-14 bg-gradient-to-b from-base-100 from-60%">
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost drawer-button m-2 w-fit lg:invisible"
          >
            <RxHamburgerMenu />
          </label>
        </div>
        {conversationId ? (
          conversationId === "new" ? (
            <NewConversation createConversation={createConversation} />
          ) : (
            <Conversation databaseKey={databaseKey} />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center">
            No conversation selected! <br></br> Select a conversation from the
            menu or create a new one
          </div>
        )}
      </div>
    </div>
  );
}
