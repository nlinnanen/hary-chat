import { deleteKey } from "@utils/crypto/keys";
import { decryptText } from "@utils/crypto/messages";
import { verifyKey } from "@utils/verifyKey";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  HaryListResponseDataItem,
  Message,
} from "src/api/documentation.schemas";
import { ConversationFrontend, MessageFrontend } from "src/types";
import useHary from "./useHary";

const queryConversation = async (
  conversationId: string,
  currentHaryPk: string | undefined,
  dataBaseKey: string,
  passphrase: string | undefined,
  harys: HaryListResponseDataItem[] | undefined
): Promise<ConversationFrontend> => {
  if (!passphrase) {
    throw new Error("No device id found!");
  }

  await verifyKey(conversationId, dataBaseKey, passphrase)
  const { data: conversation } = await axios.get(
    `/conversation/uuid/${conversationId}`
  );

  const encryptedMessages = conversation.messages;
  const myPublicKey =
    dataBaseKey === "hary" ? currentHaryPk! : conversation.publicKey;

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
          message.sender,
          passphrase
        );
        return {
          timestamp: new Date(message.createdAt ?? ""),
          content: content ?? "",
          sentByMe: message.sender === myPublicKey,
          sender:
            harys?.find((hary) => hary.attributes?.publicKey === message.sender)
              ?.id ?? "user",
        };
      }
    ) ?? []
  );

  return {
    messages,
    myPublicKey,
    publicKey: conversation.publicKey,
    conversation: { ...conversation, messages: undefined },
    conversationDbId: conversation.id,
  };
};

export default function useConversation(
  conversationId: string,
  dataBaseKey: string
) {
  const [passphrase, setPassphrase] = useState<string | undefined>(undefined);
  const { isLoading: harysLoading, currentHary, harys } = useHary();
  const { data, refetch, isLoading, isRefetching, isError, error } = useQuery(
    ["conversation", conversationId],
    () =>
      queryConversation(
        conversationId,
        currentHary?.attributes?.publicKey,
        dataBaseKey,
        passphrase,
        harys
      ),
    {
      refetchInterval: 10_000,
      retry: false,
      enabled: !!passphrase,
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


  useEffect(() => {
    if((error as any)?.message?.includes("passphrase")) {
      setPassphrase(undefined)
    }
  }, [error])

  const deleteConversation = async () => {
    const conversationToken = window.localStorage.getItem(
      `conversation-token-${conversationId}`
    );
    await axios
      .delete(`/conversation/uuid/${conversationId}`, {
        params: {
          "conversation-token": conversationToken,
        },
      })
      .catch(console.error);
    await deleteKey(conversationId);
    window.location.replace("/conversation");
  };

  return {
    ...data,
    deleteConversation,
    currentHary,
    conversationHaryPublicKeys,
    refetch,
    conversationLoading: isLoading || harysLoading,
    conversationRefetching: isRefetching,
    setPassphrase,
    passphrase,
    isError,
    error
  };
}
