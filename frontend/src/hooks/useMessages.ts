import { useEffect, useState } from "react";
import { encryptText } from "../utils/crypto/messages";
import useConversation from "./useConversation";
import { usePutConversationsId } from "src/api/conversation/conversation";
import { usePostMessages } from "src/api/message/message";

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
    refetch,
  } = useConversation(conversationId, dataBaseKey);
  const { mutate: updateConversation } = usePutConversationsId();
  const { mutate: sendMessage, isLoading: isSendMessageLoading } =
    usePostMessages();
  const isLoading = !conversationRefetching && conversationLoading;

  useEffect(() => chatRef.current?.scrollIntoView({behavior: "smooth"}), [])

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
            }, {
              onSuccess: () => {
                refetch
                chatRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            });
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
