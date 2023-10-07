import { encryptText } from "@utils/crypto/messages";
import { verifyKey } from "@utils/verifyKey";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { usePostConversations } from "src/api/conversation/conversation";
import {
  HaryListResponseDataItem
} from "src/api/documentation.schemas";
import { usePostMessages } from "src/api/message/message";
import { v4 } from "uuid";
import {
  generateKeys,
  storeKey,
} from "../utils/crypto/keys";
import useHary from "./useHary";

export default function useConversations(
  getConversationIds: () => Promise<(string | undefined)[]>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conversationId } = useParams();
  const { mutate: mutateConversation } = usePostConversations();
  const { mutate: sendMessage } = usePostMessages();
  const { harys, isLoading, currentHary } = useHary();
  const { data: conversationIds, refetch } = useQuery(
    "conversationIds",
    getConversationIds,
    { staleTime: 1000 * 60 * 5, enabled: !isLoading }
  );
  const { data: conversations } = useQuery(
    ["conversations", conversationIds],
    async () => {
      const conversations = await axios.post(`/conversation/uuid/many`, {
        data: { uuids: conversationIds },
      });
      return conversations.data
    },
    {
      enabled: !!conversationIds?.length,
      refetchOnWindowFocus: false,
    }
  );

  const setConversationId = (id: string) => {
    if (location.pathname.includes("hary")) {
      navigate(`/hary/conversation/${id}`);
    } else {
      navigate(`/conversation/${id}`);
    }
  };


  const newConversation = () => {
    navigate("/conversation/new", { replace: true });
  };

  const createConversation = async (
    message: string,
    selectedHarys: HaryListResponseDataItem[],
    passphrase: string,
  ) => {
    console.log("createConversation", passphrase);
    if (!passphrase) return console.error("no passphrase");
    if (!harys) return console.error("harys not loaded");
    const uuid = v4();
    const { publicKey, privateKey } = await generateKeys(passphrase);
    await mutateConversation(
      {
        data: {
          data: {
            publicKey,
            harys: selectedHarys.map((hary) => hary.id!),
            uuid,
          },
        },
      },
      {
        async onSuccess(data) {
          const conversation = {
            ...data.data.data?.attributes,
            id: data.data.data?.id,
          };
          if (!conversation.uuid) return console.error("no uuid");
          await storeKey(uuid, privateKey);
          await verifyKey(uuid, uuid, passphrase)

          const content = await encryptText(
            message,
            [publicKey, ...selectedHarys.map((h) => h.attributes?.publicKey!)],
            uuid,
            passphrase!
          );
          sendMessage({
            data: {
              data: {
                content,
                sender: publicKey,
                conversation: data.data.data?.id!,
              },
            },
          });
          queryClient.setQueryData(["conversation", uuid], () => {
            return {
              myPublicKey: conversation.publicKey,
              publicKey: conversation.publicKey,
              conversation: {
                ...conversation,
                messages: undefined,
                harys: selectedHarys,
              },
              conversationDbId: conversation.id,
              messages: [
                {
                  content: message,
                  timestamp: new Date(),
                  sentByMe: true,
                  sender: currentHary?.id! ?? "user",
                },
              ],
            };
          });

          setTimeout(() => {
            setConversationId(uuid);
            refetch();
          }, 100);
        },
      }
    );
  };

  return {
    conversationIds,
    conversations,
    conversationId,
    setConversationId,
    newConversation,
    createConversation,
  };
}
