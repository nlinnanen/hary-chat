import ImportKey from "@components/ExportKey/ImportKey";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

interface ConversationListProps {
  conversations: any[];
  conversationId: string | undefined;
  setConversationId: (id: string) => void;
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
          {conversations?.map(({ createdAt, uuid }, index) => {
            if (!uuid) return null;
            const isSelected = conversationId === uuid;
            return (
              <li
                key={uuid}
                className={`w-full ${
                  isSelected ? "rounded-lg bg-neutral text-neutral-content" : ""
                }`}
              >
                <a
                  className="text-md flex w-full flex-col items-start p-2"
                  onClick={() => setConversationId(uuid)}
                >
                  {new Date(createdAt).toLocaleString("fi-FI", {
                    timeStyle: "short",
                    dateStyle: "medium",
                    timeZone: "Europe/Helsinki",
                  })}
                  <div className="w-full p-0 text-right text-xs opacity-30">
                    {uuid}
                  </div>
                </a>
              </li>
            );
          })}
        </div>
        {databaseKey == "hary" ? (
          <div className="flex flex-col">
            <Link to="/hary/settings" className="btn">
              Asetukset
            </Link>
            </div>
        ) : (
          <div className="flex flex-col items-center">
            <button className="btn mt-4 align-middle" onClick={newConversation}>
              Uusi keskustelu
            </button>
            <ImportKey
              text="Lataa keskustelu"
              onSuccess={(cId: string) =>
                window.location.replace(`/conversation/${cId}`)
              }
            />
          </div>
        )}
      </div>
    </ul>
  );
};

export default ConversationList;
