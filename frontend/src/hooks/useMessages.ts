import { useEffect, useState } from "react";
import { usePostMessages, usePutConversationsId } from "../api";
import { MessageFrontend } from "../types";
import { decryptText, encryptText } from "../utils/crypto/messages";
import useConversation from "./useConversation";
import { ConversationMessagesDataItemAttributes } from "src/model";
import { useQuery } from "react-query";

function fetchMessages(
  encryptedMessages: ConversationMessagesDataItemAttributes[],
  myPublicKey: string | undefined,
  dataBaseKey: string | number
) {
  if (!myPublicKey) {
    alert("No public key found! Are you connected to the internet?");
    return Promise.resolve([]);
  }
  return Promise.all(
    encryptedMessages?.map(async (message): Promise<MessageFrontend> => {
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
    }) ?? []
  );
}

export default function useMessages(
  conversationId: number,
  dataBaseKey: string | number = conversationId
) {
  const [newMessage, setNewMessage] = useState<string>("");
  const {
    conversation,
    encryptedMessages,
    publicKey,
    currentHaryPk,
    conversationLoading,
    refetch,
    conversationHaryPublicKeys,
  } = useConversation(conversationId);
  const { mutate: updateConversation } = usePutConversationsId();
  const myPublicKey = dataBaseKey === "hary" ? currentHaryPk : publicKey;
  const { mutate: sendMessage, isLoading: isSendMessageLoading } =
    usePostMessages();
  const { data: messages, isLoading: decryptionLoading } = useQuery(
    ["decryptMessages", encryptedMessages, myPublicKey, dataBaseKey],
    () => fetchMessages(encryptedMessages, myPublicKey, dataBaseKey)
  );
  const isLoading = conversationLoading || decryptionLoading;

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && publicKey && conversationHaryPublicKeys) {
      const content = await encryptText(
        newMessage,
        [...conversationHaryPublicKeys, publicKey],
        dataBaseKey
      );
      sendMessage(
        {
          data: {
            data: {
              content,
              sender: myPublicKey,
            },
          },
        },
        {
          onSuccess: (data) => {
            if (!data.data.data?.id)
              return console.error("No message id found!");
            updateConversation({
              id: conversationId,
              data: {
                data: {
                  messages: {
                    // @ts-ignore
                    connect: [data.data.data?.id],
                  },
                },
              },
            });
            console.log("refetching");
            setTimeout(refetch, 100);
          },
        }
      );
      setNewMessage("");
    } else {
      alert("There was a problem sending your message! Please try again");
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    isSendMessageLoading,
    isLoading,
  };
}
