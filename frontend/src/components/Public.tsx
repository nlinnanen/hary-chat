import { getAllConversationIds } from "@utils/crypto/keys";
import Conversations from "./Conversations";
import { useEffect } from "react";

export default function Public() {
    useEffect(() => {
        localStorage.clear()
    }, [])
  
    return (
      <Conversations getConversationIds={getAllConversationIds}  />
    )
}