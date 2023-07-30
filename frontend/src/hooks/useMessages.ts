import { useEffect, useState } from "react";
import { usePostMessages, usePutConversationsId } from "../api";
import { MessageFrontend } from "../types";
import { decryptText, encryptText } from "../utils/crypto/messages";
import useConversation from "./useConversation";

export default function useMessages(
  conversationId: number,
  dataBaseKey: string | number = conversationId
) {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageFrontend[]>([]);
  const {
    conversation,
    encryptedMessages,
    publicKey,
    isLoading,
    refetch,
    conversationHaryPrivateKeys,
  } = useConversation(conversationId);
  const { mutate: updateConversation } = usePutConversationsId();

  const { mutate: sendMessage } = usePostMessages();
  useEffect(() => {
    async function fetchMessages() {
      if (conversation && encryptedMessages && publicKey) {
        const decryptedMessages = await Promise.all(
          encryptedMessages?.map(async (message): Promise<MessageFrontend> => {
              const content = await decryptText(
                message.content,
                dataBaseKey,
                message.sender
              );
            return {
              timestamp: new Date(message.createdAt ?? ""),
              content: content ?? "",
              sentByMe: message.sender === publicKey,
            };
          }) ?? []
        );
        setMessages(decryptedMessages);
      }
    }

    fetchMessages().catch(console.error);
  }, [conversation, conversationId, encryptedMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && publicKey && conversationHaryPrivateKeys) {
      const content = await encryptText(newMessage, [
        ...conversationHaryPrivateKeys,
        publicKey,
      ], dataBaseKey);
      sendMessage(
        {
          data: {
            data: {
              content,
              sender: publicKey
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
      alert("Please enter a message");
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    isLoading,
  };
}
