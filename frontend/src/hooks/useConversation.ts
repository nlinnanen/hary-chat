import { useMemo } from "react";
import { useGetConversationsId } from "../api";
import { ConversationMessagesDataItemAttributes } from "src/model";
import useHary from "./useHary";

export default function useConversation(conversationId: number) {
  const {
    data: conversationData,
    refetch,
    isLoading,
  } = useGetConversationsId(conversationId, {
    axios: { params: { populate: "*" } },
  });
  const { harys } = useHary();
  const userId = localStorage.getItem("userId");
  const currentHaryPk = harys?.find(
    (hary) => hary.attributes?.user?.data?.id === parseInt(userId ?? "")
  )?.attributes?.publicKey;
  // Use memo to prevent unnecessary re-renders
  const {
    conversation,
    encryptedMessages,
    publicKey,
    conversationHaryPrivateKeys,
  } = useMemo(() => {
    const conversation = conversationData?.data?.data;
    const publicKey = conversation?.attributes?.publicKey;
    const encryptedMessages = conversation?.attributes?.messages?.data
      ?.map((message) => message.attributes)
      .filter((m) => m) as ConversationMessagesDataItemAttributes[];
    const conversationHaryPrivateKeys = conversation?.attributes?.harys?.data
      ?.map((hary) => hary.attributes?.publicKey)
      .filter((key) => key) as string[];

    return {
      conversation,
      encryptedMessages,
      publicKey,
      conversationHaryPrivateKeys,
    };
  }, [conversationData]);

  return {
    conversation,
    encryptedMessages,
    publicKey,
    currentHaryPk,
    isLoading,
    conversationHaryPrivateKeys,
    refetch,
  };
}
