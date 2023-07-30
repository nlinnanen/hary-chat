import { useEffect, useState } from "react";
import { usePostMessages, usePutConversationsId } from "../api";
import { MessageFrontend } from "../types";
import { decryptMessage, encryptMessage } from "../utils/crypto/messages";
import useConversation from "./useConversation";

export default function useMessages(conversationId: number) {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageFrontend[]>([]);
  const { conversation, encryptedMessages, publicKey, isLoading, refetch, conversationHaryPrivateKeys } =
    useConversation(conversationId);
  const { mutate: updateConversation } = usePutConversationsId();

  const { mutate: sendMessage } = usePostMessages();
  useEffect(() => {
    async function fetchMessages() {
      if (conversation) {
        const decryptedMessages = await Promise.all(
          encryptedMessages?.map(async (message): Promise<MessageFrontend> => {
            if (!message?.contentReceiver && !message?.contentSender) {
              throw new Error("message is undefined");
            }
            let sentByMe = false;
            let content = "";
            try {
              content = await decryptMessage(
                message.contentSender,
                conversationId
              );
              sentByMe = true;
            } catch (_e) {
              content = await decryptMessage(
                message.contentReceiver,
                conversationId
              );
            }
            return {
              timestamp: new Date(message.createdAt ?? ""),
              content,
              sentByMe,
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
      const contentReceiver = await encryptMessage(newMessage, conversationHaryPrivateKeys);
      const contentSender = await encryptMessage(newMessage, [publicKey]);
      sendMessage(
        {
          data: {
            data: {
              contentReceiver,
              contentSender,
            },
          },
        },
        {
          onSuccess: (data) => {
            if(!data.data.data?.id) return console.error("No message id found!")
            updateConversation({
              id: conversationId,
              data: {
                data: {
                  messages: {
                    // @ts-ignore
                    connect: [data.data.data?.id]
                  } 
                }
              }
            })
            console.log('refetching')
            setTimeout(refetch, 100)
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
