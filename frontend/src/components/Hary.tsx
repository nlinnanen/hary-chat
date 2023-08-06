import useHary from "@hooks/useHary";
import { getPrivateKey } from "@utils/crypto/keys";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import Conversations from "./Conversations";
import Login from "./Login";
import NoHaryKey from "./NoHaryKey";

const getHaryPrivateKey = async () => {
  const data = await getPrivateKey("hary");
  return data;
};

export default function Hary() {
  const [, setIsAuthenticated] = useState(false);
  const { data, isLoading } = useQuery("haryPrivateKey", getHaryPrivateKey);
  const { currentHary } = useHary();

  const getConversationIds = async () => {
    const ids =
      (currentHary?.conversations?.data
        ?.map((e) => e?.attributes?.uuid)
        .filter((e) => e) as unknown as string[]) ?? [];
    console.log(currentHary?.conversations?.data)
    console.log(ids);
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
