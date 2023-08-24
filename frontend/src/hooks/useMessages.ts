import { useEffect, useState } from "react";
import { encryptText } from "../utils/crypto/messages";
import useConversation from "./useConversation";
import { usePutConversationsId } from "src/api/conversation/conversation";
import { usePostMessages } from "src/api/message/message";
import { useQueryClient } from "react-query";
import { ConversationFrontend } from "src/types";

export default function useMessages(
  conversationId: string,
  dataBaseKey: string = conversationId,
  chatRef: React.RefObject<HTMLDivElement>,
  areaRef: React.RefObject<HTMLTextAreaElement>
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
    conversation,
    conversationDbId,
    deleteConversation,
    deviceId,
    isError
  } = useConversation(conversationId, dataBaseKey);
  const { mutate: sendMessage, isLoading: isSendMessageLoading } =
    usePostMessages();
  const queryClient = useQueryClient();

  const isLoading = !conversationRefetching && conversationLoading;

  useEffect(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), []);

  const handleSendMessage = async () => {
    if (
      newMessage.trim() !== "" &&
      !conversationLoading &&
      conversationHaryPublicKeys &&
      publicKey &&
      myPublicKey
    ) {
      const content = await encryptText(
        newMessage,
        [...conversationHaryPublicKeys, publicKey],
        dataBaseKey,
        deviceId!
      );
      sendMessage(
        {
          data: {
            data: {
              content,
              sender: myPublicKey,
              conversation: conversationDbId,
            },
          },
        },
        {
          onSuccess: (data) => {
            const createdMessage = data.data.data?.attributes!;
            queryClient.setQueryData(
              ["conversation", conversationId],
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
                      sender: currentHary?.id! ?? "user",
                    },
                  ],
                };
              }
            );
            setTimeout(
              () => chatRef.current?.scrollIntoView({ behavior: "smooth" }),
              100
            );
          },
        }
      );
      try {
        // @ts-expect-error
        areaRef.current.style.height = "48px";
      } catch (e) {
        console.log(e);
      }
      setNewMessage("");
    } else {
      alert("There was a problem sending your message! Please try again");
    }
  };

  return {
    messages,
    conversation,
    deleteConversation,
    newMessage,
    setNewMessage,
    handleSendMessage,
    isSendMessageLoading,
    isLoading,
    isError
  };
}
