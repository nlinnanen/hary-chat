import React, { useState } from "react";
import { useMutation } from "react-query";
import Conversations from "./Conversations";
import axios from "axios";
import { getConversations } from "src/api";
import Login from "./Login";


export default function Hary() {
  const [, setIsAuthenticated] = useState(false);
  const getConversationIds = async () => {
    const data = await getConversations();
    return data.data.data?.map((conversation) => conversation.id) ?? [];
  };

  if (!axios.defaults.headers.common["Authorization"]) {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      return <Login setIsAuthenticated={setIsAuthenticated} />
    }
  }

  return <Conversations getConversationIds={getConversationIds} />;
}
