import Conversation from "@components/Conversation";
import useConversations from "@hooks/useConversations";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Conversations({
  getConversationIds,
}: {
  getConversationIds: () => Promise<(number|undefined)[]>;
}) {
  const {
    createConversation,
    conversationId,
    conversationIds,
    setConversationId,
  } = useConversations(getConversationIds);

  if(!conversationIds) return null

  return (
    <div className="drawer h-screen lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
          <li>
            <button
              className="btn btn-neutral align-middle"
              onClick={createConversation}
            >
              Create conversation
            </button>
          </li>
          {conversationIds.map((id, index) => {
            if (!id) return null;
            return (
              <li key={id}>
                <a onClick={() => setConversationId(id)}>
                  Conversation {index + 1}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="drawer-content max-h-screen w-full items-center justify-center">
        <label
          htmlFor="my-drawer"
          className="btn btn-neutral drawer-button m-2 w-fit lg:invisible"
        >
          <RxHamburgerMenu />
        </label>
        {conversationId ? (
          <Conversation conversationId={conversationId} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div>
              Create or select a conversation from the menu to start messaging
            </div>
            <button className="btn btn-primary" onClick={createConversation}>
              Create conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
