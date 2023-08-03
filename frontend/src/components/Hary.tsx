import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Conversations from "./Conversations";
import axios from "axios";
import Login from "./Login";
import useHary from "@hooks/useHary";
import { getPrivateKey } from "@utils/crypto/keys";
import { getConversations } from "src/api/conversation/conversation";
import NoHaryKey from "./Noharykey";

const getHaryPrivateKey = async () => {
  const data = await getPrivateKey("hary");
  return data;
};

export default function Hary() {
  const [, setIsAuthenticated] = useState(false);
  const { data, isLoading } = useQuery("haryPrivateKey", getHaryPrivateKey);

  const getConversationIds = async () => {
    const data = await getConversations();
    return data.data.data?.map((conversation) => conversation.attributes?.uuid) ?? [];
  };

  if (!axios.defaults.headers.common["Authorization"]) {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      return <Login setIsAuthenticated={setIsAuthenticated} />;
    }
  }

  if (isLoading) return (
    <span className="loading loading-ring loading-lg"></span>
  );

  if (!data) return (
    <NoHaryKey />
  )
  
  return (
      <Conversations
        getConversationIds={getConversationIds}
        databaseKey={"hary"}
      />
  );
}
