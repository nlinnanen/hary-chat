import { useMemo } from "react";
import useHary from "./useHary";
import { decryptText } from "@utils/crypto/messages";
import { MessageFrontend } from "src/types";
import { useQuery } from "react-query";
import { getConversationsId } from "src/api/conversation/conversation";

const queryConversation = async (
  conversationId: number,
  currentHaryPk: string | undefined,
  dataBaseKey: string | number
) => {
  const { data: conversation } = await getConversationsId(conversationId, {
    params: { populate: "*" },
  });
  const encryptedMessages = conversation?.data?.attributes?.messages?.data;
  const myPublicKey =
    dataBaseKey === "hary"
      ? currentHaryPk
      : conversation.data?.attributes?.publicKey;
  if (!myPublicKey) {
    throw new Error("No public key found!");
  }
  const messages = await Promise.all(
    encryptedMessages?.map(
      async ({ attributes: message }): Promise<MessageFrontend> => {
        if (!message) throw new Error("Undefined message!");
        const content = await decryptText(
          message.content,
          dataBaseKey,
          message.sender
        );
        return {
          timestamp: new Date(message.createdAt ?? ""),
          content: content ?? "",
          sentByMe: message.sender === myPublicKey,
        };
      }
    ) ?? []
  );
  return {
    messages,
    myPublicKey,
    publicKey: conversation.data?.attributes?.publicKey,
    conversation: { ...conversation.data?.attributes, messages: undefined },
  };
};

export default function useConversation(
  conversationId: number,
  dataBaseKey: string | number,
) {
  const { isLoading: harysLoading, currentHary } = useHary();
  const userId = localStorage.getItem("userId");

  const { data, refetch, isLoading, isRefetching } = useQuery(
    [conversationId, conversationId, currentHary, dataBaseKey],
    () => queryConversation(conversationId, currentHary?.publicKey, dataBaseKey),
    {
      refetchIntervalInBackground: true,
      refetchInterval: 1000,
    }
  );
  // Use memo to prevent unnecessary re-renders
  const { conversationHaryPublicKeys } = useMemo(() => {
    const conversationHaryPublicKeys = data?.conversation.harys?.data
      ?.map((hary) => hary.attributes?.publicKey)
      .filter((key) => key) as string[];

    return {
      conversationHaryPublicKeys,
    };
  }, [data]);

  return {
    ...data,
    currentHary,
    conversationHaryPublicKeys,
    refetch,
    conversationLoading: isLoading || harysLoading,
    conversationRefetching: isRefetching,
  };
}
