import { useState } from "react";
import Conversation from "./Conversation";
import useConversations from "./hooks/useConversations";
import useHary from "./hooks/useHary";


export default function Conversations() {
  const [conversationId, setConversationId] = useState<null | number>(null);
  const { createConversation, conversationIds } = useConversations();
  const {createHary} = useHary()

  const handleCreateConversation = () => {
    createConversation()
  }

  return (
    <div className="flex w-screen h-screen bg-blue-100">
      <button onClick={createHary}>Create hary</button>
      <div className="w-1/4 bg-white h-full flex flex-col items-start overflow-y-auto">
        <button 
          className="mt-4 ml-4 px-4 py-2 text-white bg-blue-500 rounded-md" 
          onClick={handleCreateConversation}
        >
          Create conversation 
        </button>
        {conversationIds.map((id, index) => (
          <button
            key={id}
            className={`
              w-full
              px-4 py-2 
              ${conversationId === id ? 'bg-blue-200' : 'hover:bg-blue-100'}
              cursor-pointer
            `}
            onClick={() => setConversationId(id)}
          >
            Conversation {index + 1}
          </button>
        ))}
      </div>
      <div className="w-3/4 h-full flex flex-col p-4 ">
        {conversationId ? (
          <Conversation conversationId={conversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-2xl text-gray-500">Select a conversation to start messaging</div>
          </div>
        )}
      </div>
    </div>
  );
}
