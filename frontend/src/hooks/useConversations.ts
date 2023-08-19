import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { usePostConversations } from "src/api/conversation/conversation";
import { createUserId, generateKeys, storeKey } from "../utils/crypto/keys";
import { v4 } from "uuid";
import useHary from "./useHary";

export default function useConversations(
  getConversationIds: () => Promise<(string | undefined)[]>
) {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { mutate: mutateConversation } = usePostConversations();
  const { harys } = useHary();
  const { data: conversationIds, refetch } = useQuery(
    "conversationIds",
    getConversationIds,
    { staleTime: 1000 * 60 * 5, enabled: !!harys }
  );

  const setConversationId = (id: string) => {
    if (location.pathname.includes("hary")) {
      navigate(`/hary/conversation/${id}`);
    } else {
      navigate(`/conversation/${id}`);
    }
  };

  const newConversation = () => {
    navigate("conversation/new", { replace: true });
  }

  const createConversation = async () => {
    if (!harys) return console.error("harys not loaded");
    if (conversationIds?.length === 0) await createUserId();

    const uuid = v4();
    const { publicKey, privateKey } = await generateKeys();
    await mutateConversation(
      {
        data: {
          data: {
            publicKey,
            harys: harys.map((hary) => hary.id ?? ""),
            uuid,
          },
        },
      },
      {
        onSuccess(data) {
          const id = data.data.data?.attributes?.uuid;
          if (!id) return console.error("no id");
          storeKey(id, privateKey);
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
    createConversation,
    newConversation
  };
}
