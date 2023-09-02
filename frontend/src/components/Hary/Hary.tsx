import useHary from "@hooks/useHary";
import { getPrivateKey } from "@utils/crypto/keys";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import Conversations from "../Conversation/Conversations";
import Login from "./Login";
import NoHaryKey from "./NoHaryKey";
import { getConversations } from "src/api/conversation/conversation";

const getHaryPrivateKey = async () => {
  const data = await getPrivateKey("hary");
  return data;
};

export default function Hary() {
  const [, setIsAuthenticated] = useState(false);
  const { data, isLoading } = useQuery("haryPrivateKey", getHaryPrivateKey);
  const { currentHary } = useHary();

  const getConversationIds = async () => {
    const data = await getConversations({
      // @ts-ignore
      fields: {
        0: "uuid",
      },
      filters: {
        haryt: {
          $contains: currentHary?.id,
        }
      },

    })

    if(!data.data.data) {
      console.error("No conversations found")
      return []
    }

    const ids = data.data.data?.map((conversation) => conversation.attributes?.uuid)
    return ids;
  };

  if (!axios.defaults.headers.common["Authorization"]) {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      return <Login setIsAuthenticated={setIsAuthenticated} />;
    }
  }

  if (isLoading)
    return <span className="loading loading-ring loading-lg"></span>;

  if (!data) return <NoHaryKey />;

  return (
    <Conversations
      getConversationIds={getConversationIds}
      databaseKey={"hary"}
    />
  );
}
