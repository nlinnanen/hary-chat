import Conversation from "./Conversation";
import useConversations from "./hooks/useConversations";
import useHary from "./hooks/useHary";
import { RxHamburgerMenu } from "react-icons/rx"

export default function Conversations() {
  const {
    createConversation,
    conversationIds,
    conversationId,
    setConversationId,
  } = useConversations();
  const { createHary } = useHary();

  return (
    <div className="drawer lg:drawer-open h-screen">
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
          {conversationIds.map((id, index) => (
            <li key={id}>
              <a onClick={() => setConversationId(id)}>
                Conversation {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="drawer-content w-full max-h-screen items-center justify-center">
          <label htmlFor="my-drawer" className="btn btn-neutral drawer-button w-fit m-2 lg:invisible">
            <RxHamburgerMenu />
          </label>
          {conversationId ? (
            <Conversation conversationId={conversationId} />
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <div>
                Create or select a conversation from the menu to start messaging
              </div>
              <button
                className="btn btn-primary"
                onClick={createConversation}
              >
                Create conversation
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
