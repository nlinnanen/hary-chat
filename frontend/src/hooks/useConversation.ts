import { useMemo } from "react";
import useHary from "./useHary";
import { decryptText } from "@utils/crypto/messages";
import { ConversationFrontend, MessageFrontend } from "src/types";
import { useQuery } from "react-query";
import { getConversationsId } from "src/api/conversation/conversation";
import axios from "axios";
import { Message } from "src/api/documentation.schemas";

const queryConversation = async (
  conversationId: string,
  currentHaryPk: string | undefined,
  dataBaseKey: string
): Promise<ConversationFrontend> => {
  const {data: conversation} = await axios.get(`/conversation-by-pk/${conversationId}`)
  const encryptedMessages = conversation.messages;
  const myPublicKey =
    dataBaseKey === "hary"
      ? currentHaryPk!
      : conversation.publicKey;

  if (!myPublicKey) {
    throw new Error("No public key found!");
  }

  const messages = await Promise.all(
    encryptedMessages?.map(
      async (message: Message): Promise<MessageFrontend> => {
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
    publicKey: conversation.publicKey,
    conversation: { ...conversation, messages: undefined },
    conversationDbId: conversation.id
  };
};

export default function useConversation(
  conversationId: string,
  dataBaseKey: string,
) {
  const { isLoading: harysLoading, currentHary } = useHary();

  const { data, refetch, isLoading, isRefetching } = useQuery(
    ['conversation', conversationId, currentHary, dataBaseKey],
    () => queryConversation(conversationId, currentHary?.publicKey, dataBaseKey),
    {
      refetchIntervalInBackground: true,
      refetchInterval: 1000,
    }
  );
  // Use memo to prevent unnecessary re-renders
  const { conversationHaryPublicKeys } = useMemo(() => {
    const conversationHaryPublicKeys = data?.conversation.harys
      ?.map((hary: any) => hary.publicKey)
      .filter((key: any) => key) as string[];

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
