import { FunctionComponent } from "react";

interface ConversationListProps {
  conversations: any[];
  conversationId: string | undefined;
  setConversationId: (id: string ) => void;
  newConversation: () => void;
  databaseKey: string | undefined;
}

const ConversationList: FunctionComponent<ConversationListProps> = ({
  conversations,
  conversationId,
  setConversationId,
  newConversation,
  databaseKey,
}) => {
  return (
    <ul className="menu h-full w-80 bg-base-200 p-4 text-lg">
      <div className="flex h-full flex-col justify-between">
        <div>
          {conversations.map(({createdAt, uuid}, index) => {
            if (!uuid) return null;
            const isSelected = conversationId === uuid;
            return (
              <li
                key={uuid}
                className={`w-full p-2 ${
                  isSelected ? "rounded-lg bg-neutral text-neutral-content" : ""
                }`}
              >
                <a className="p-0" onClick={() => setConversationId(uuid)}>
                  {new Date(createdAt).toLocaleString("fi-FI", {
                    
                  })}
                </a>
                  <div className="text-right w-full opacity-30 text-xs p-0">
                    {uuid}
                  </div>
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
