import { getUserId } from "@utils/crypto/keys";
import { decryptText } from "@utils/crypto/messages";
import axios from "axios";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { HaryListResponseDataItem, Message } from "src/api/documentation.schemas";
import { ConversationFrontend, MessageFrontend } from "src/types";
import useHary from "./useHary";

const queryConversation = async (
  conversationId: string,
  currentHaryPk: string | undefined,
  dataBaseKey: string,
  deviceId: string | undefined,
  harys: HaryListResponseDataItem[] | undefined
): Promise<ConversationFrontend> => {
  const {data: conversation} = await axios.get(`/conversation-by-pk/${conversationId}`)
  const encryptedMessages = conversation.messages;
  const myPublicKey =
    dataBaseKey === "hary"
      ? currentHaryPk!
      : conversation.publicKey;

  if (!myPublicKey || !deviceId) {
    console.log(deviceId, myPublicKey)
    throw new Error("No public key or device id found!");
  }


  const messages = await Promise.all(
    encryptedMessages?.map(
      async (message: Message): Promise<MessageFrontend> => {
        if (!message) throw new Error("Undefined message!");
        const content = await decryptText(
          message.content,
          dataBaseKey,
          message.sender,
          deviceId
        );
        return {
          timestamp: new Date(message.createdAt ?? ""),
          content: content ?? "",
          sentByMe: message.sender === myPublicKey,
          sender: harys?.find((hary) => hary.attributes?.publicKey === message.sender)?.id ?? "user"
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
  const { isLoading: harysLoading, currentHary, harys } = useHary();
  const { data: deviceId } = useQuery(["deviceId", conversationId], () => getUserId())
  const { data, refetch, isLoading, isRefetching } = useQuery(
    ['conversation', conversationId],
    () => queryConversation(conversationId, currentHary?.attributes?.publicKey, dataBaseKey, deviceId, harys),
    {
      refetchIntervalInBackground: true,
      refetchInterval: 10_000,
      enabled: !!deviceId
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
    deviceId
  };
}
