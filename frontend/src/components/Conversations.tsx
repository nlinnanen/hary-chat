import Conversation from "@components/Conversation";
import useConversations from "@hooks/useConversations";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Conversations({
  getConversationIds,
  databaseKey,
}: {
  getConversationIds: () => Promise<(string | undefined)[]>;
  databaseKey?: string;
}) {
  const {
    createConversation,
    conversationId,
    conversationIds,
    setConversationId,
  } = useConversations(getConversationIds);

  if (!conversationIds) return null;

  return (
    <div className="drawer h-screen lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-30">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4 text-lg">
          <div className="justify-between flex h-full flex-col">
            <div>
              {conversationIds.map((id, index) => {
                if (!id) return null;
                const isSelected = conversationId === id;
                return (
                  <li
                    key={id}
                    className={isSelected ? "rounded-lg bg-neutral text-neutral-content" : ""}
                  >
                    <a onClick={() => setConversationId(id)}>
                      Conversation {index + 1}
                    </a>
                  </li>
                );
              })}
            </div>
            <button
              className="btn mt-4 align-middle"
              onClick={createConversation}
            >
              New conversation
            </button>
          </div>
        </ul>
      </div>
      <div className="drawer-content max-h-screen w-full items-center justify-center">
        <div className="fixed top-0 z-10 h-14 w-full bg-gradient-to-b from-60% from-base-100">
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost drawer-button m-2 w-fit lg:invisible"
          >
            <RxHamburgerMenu />
          </label>
        </div>
        {conversationId ? (
          <Conversation databaseKey={databaseKey} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-10 text-center">
            <div className="w-2/3">
              Create or select a conversation from the menu to start messaging
            </div>
            <button className="btn btn-primary" onClick={createConversation}>
              Start a conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
