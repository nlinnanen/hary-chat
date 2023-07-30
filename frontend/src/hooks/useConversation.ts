import { useMemo } from "react";
import { useGetConversationsId } from "../api";

export default function useConversation(conversationId: number) {
  const {
    data: conversationData,
    refetch,
    isLoading,
  } = useGetConversationsId(conversationId, { axios: { params: { populate: '*' }} });

  // Use memo to prevent unnecessary re-renders
  const { conversation, encryptedMessages, publicKey } = useMemo(() => {
    const conversation = conversationData?.data?.data;
    const encryptedMessages = conversation?.attributes?.messages?.data?.map((message) => message.attributes);
    const publicKey = conversation?.attributes?.publicKey;
    return { conversation, encryptedMessages, publicKey };
  }, [conversationData]);
  
  return {
    conversation,
    encryptedMessages,
    publicKey,
    isLoading,
    refetch
  }
}