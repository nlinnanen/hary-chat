import { getAllConversationIds } from "@utils/crypto/keys";
import Conversations from "./Conversations";

export default function Public() {
  
    return (
      <Conversations getConversationIds={getAllConversationIds}  />
    )
}