import { useEffect, useState } from "react";
import { encryptText } from "../utils/crypto/messages";
import useConversation from "./useConversation";
import { usePutConversationsId } from "src/api/conversation/conversation";
import { usePostMessages } from "src/api/message/message";
import { useQueryClient } from "react-query";
import { ConversationFrontend } from "src/types";

export default function useMessages(
  conversationId: number,
  dataBaseKey: string | number = conversationId,
  chatRef: React.RefObject<HTMLDivElement>
) {
  const [newMessage, setNewMessage] = useState<string>("");
  const {
    messages,
    myPublicKey,
    publicKey,
    conversationLoading,
    conversationRefetching,
    conversationHaryPublicKeys,
    currentHary,
  } = useConversation(conversationId, dataBaseKey);
  const { mutate: updateConversation } = usePutConversationsId();
  const { mutate: sendMessage, isLoading: isSendMessageLoading } =
    usePostMessages();
  const queryClient = useQueryClient();

  const isLoading = !conversationRefetching && conversationLoading;

  useEffect(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), []);

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
            const createdMessage = data.data.data?.attributes!;
            queryClient.setQueryData(
              ['conversation', conversationId, currentHary?.publicKey, dataBaseKey],
              (oldData: ConversationFrontend | undefined) => {
                if (!oldData) throw new Error("No conversation data fetched!");
                return {
                  ...oldData,
                  messages: [
                    ...oldData.messages,
                    {
                      content: newMessage,
                      timestamp: new Date(createdMessage.createdAt!),
                      sentByMe: true,
                    },
                  ],
                };
              }
            );
            updateConversation(
              {
                id: conversationId,
                data: {
                  data: {
                    messages: {
                      // @ts-ignore
                      connect: [data.data.data?.id],
                    },
                  },
                },
              },
              {
                onSuccess: () => {
                  chatRef.current?.scrollIntoView({ behavior: "smooth" });
                },
              }
            );
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
