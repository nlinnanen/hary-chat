import { useEffect, useState } from "react";
import { usePostConversations } from "../api";
import { generateKeys, getAllConversationIds, storeKeys } from "../utils/crypto/keys";
import useHary from "./useHary";

export default function useConversations() {
  const [conversationIds, setConversationIds] = useState<number[]>([]);
  const { mutate: mutateConversation } = usePostConversations()
  const { harys } = useHary()

  useEffect(() => {
    async function getKeys() {
      const keys = await getAllConversationIds();
      setConversationIds(keys);
    }
    getKeys().catch(console.error);
  }, []);

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
      onSuccess(data, variables, context) {
        const id = data.data.data?.id;
        if(!id) return console.error('no id');
        storeKeys(id, privateKey);
        setConversationIds((prev) => [...prev, id]);
      },
    });
    
  };

  return {
    createConversation,
    conversationIds,
  }
}