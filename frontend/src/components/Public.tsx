import { getAllConversationIds } from "@utils/crypto/keys";
import { useEffect } from "react";
import Conversations from "./Conversation/Conversations";

export default function Public() {
    useEffect(() => {
        localStorage.clear()
    }, [])
  
    return (
      <Conversations getConversationIds={getAllConversationIds}  />
    )
}