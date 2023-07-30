import { useState } from "react";
import { useQuery } from "react-query";
import { usePostConversations } from "../api";
import { generateKeys, storeKey } from "../utils/crypto/keys";
import useHary from "./useHary";

export default function useConversations(getConversationIds: () => Promise<(number|undefined)[]>) {
  const [conversationId, setConversationId] = useState<null | number>(null);
  const { mutate: mutateConversation } = usePostConversations()
  const { data: conversationIds, refetch } = useQuery('conversationIds', getConversationIds, { staleTime: 1000 * 60 * 60 * 24 })
  const { harys } = useHary()


  const createConversation = async () => {
    if(!harys) return console.error('harys not loaded');
    const {publicKey, privateKey} = await generateKeys();
    await mutateConversation({
      data: {
        data: {
          publicKey,
          harys: harys.map((hary) => hary.id ?? '')
        }
      }
    },{
      onSuccess(data) {
        const id = data.data.data?.id;
        if(!id) return console.error('no id');
        storeKey(id, privateKey);
        setConversationId(id);
        setTimeout(refetch, 100)
      },
    });
    
  };

  return {
    conversationIds,
    conversationId,
    setConversationId,
    createConversation,
  }
}