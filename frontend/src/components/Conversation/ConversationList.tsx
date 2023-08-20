import { FunctionComponent } from "react";

interface ConversationListProps {
  conversationIds: (string | undefined)[];
  conversationId: string | undefined;
  setConversationId: (id: string ) => void;
  newConversation: () => void;
  databaseKey: string | undefined;
}

const ConversationList: FunctionComponent<ConversationListProps> = ({
  conversationIds,
  conversationId,
  setConversationId,
  newConversation,
  databaseKey,
}) => {
  return (
    <ul className="menu h-full w-80 bg-base-200 p-4 text-lg">
      <div className="flex h-full flex-col justify-between">
        <div>
          {conversationIds.map((id, index) => {
            if (!id) return null;
            const isSelected = conversationId === id;
            return (
              <li
                key={id}
                className={
                  isSelected ? "rounded-lg bg-neutral text-neutral-content" : ""
                }
              >
                <a onClick={() => setConversationId(id)}>
                  Conversation {index + 1}
                </a>
              </li>
            );
          })}
        </div>
        {databaseKey != "hary" && (
          <button className="btn mt-4 align-middle" onClick={newConversation}>
            New conversation
          </button>
        )}
      </div>
    </ul>
  );
};

export default ConversationList;
