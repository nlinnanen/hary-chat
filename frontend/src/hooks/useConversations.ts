import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { usePostConversations } from "src/api/conversation/conversation";
import {
  createUserId,
  generateKeys,
  getUserId,
  storeKey,
} from "../utils/crypto/keys";
import { v4 } from "uuid";
import useHary from "./useHary";
import { usePostMessages } from "src/api/message/message";
import { encryptText } from "@utils/crypto/messages";
import {
  Hary,
  HaryListResponseDataItem,
  HaryUser,
} from "src/api/documentation.schemas";

export default function useConversations(
  getConversationIds: () => Promise<(string | undefined)[]>
) {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { mutate: mutateConversation } = usePostConversations();
  const { mutate: sendMessage } = usePostMessages();
  const { harys, isLoading } = useHary();
  const { data: conversationIds, refetch } = useQuery(
    "conversationIds",
    getConversationIds,
    { staleTime: 1000 * 60 * 5, enabled: !isLoading }
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
    selectedHarys: HaryListResponseDataItem[]
  ) => {
    if (!harys) return console.error("harys not loaded");
    const deviceId = await (conversationIds?.length === 0
      ? createUserId()
      : getUserId());

    const uuid = v4();
    const { publicKey, privateKey } = await generateKeys();
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
          const id = data.data.data?.attributes?.uuid;
          if (!id) return console.error("no id");
          storeKey(id, privateKey);

          const content = await encryptText(
            message,
            [publicKey, ...selectedHarys.map((h) => h.attributes?.publicKey!)],
            id,
            deviceId
          );
          await sendMessage({
            data: {
              data: {
                content,
                sender: publicKey,
                conversation: data.data.data?.id!,
              },
            },
          });

          setConversationId(id);
          setTimeout(refetch, 100);
        },
      }
    );
  };

  return {
    conversationIds,
    conversationId,
    setConversationId,
    newConversation,
    createConversation,
  };
}
