import Conversation from "@components/Conversation";
import useConversations from "@hooks/useConversations";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Conversations({
  getConversationIds,
  databaseKey,
}: {
  getConversationIds: () => Promise<(number | undefined)[]>;
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
          <button
            className="btn btn-neutral align-middle"
            onClick={createConversation}
          >
            Create conversation
          </button>
          {conversationIds.map((id, index) => {
            if (!id) return null;
            const isSelected = conversationId === id;
            return (
              <li
                key={id}
                className={isSelected ? "rounded-lg bg-gray-800" : ""}
              >
                <a onClick={() => setConversationId(id)}>
                  Conversation {index + 1}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="drawer-content max-h-screen w-full items-center justify-center">
        <div className="w-full h-28 bg-blur fixed top-0 z-10">
          <label
            htmlFor="my-drawer"
            className="btn btn-neutral drawer-button m-2 w-fit lg:invisible"
          >
            <RxHamburgerMenu />
          </label>
        </div>
        {conversationId ? (
          <Conversation
            conversationId={conversationId}
            databaseKey={databaseKey}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-10 text-center">
            <div className="w-2/3">
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
