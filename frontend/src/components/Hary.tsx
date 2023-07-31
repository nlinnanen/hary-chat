import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Conversations from "./Conversations";
import axios from "axios";
import { getConversations, useGetHarysId } from "src/api";
import Login from "./Login";
import useHary from "@hooks/useHary";
import { getPrivateKey } from "@utils/crypto/keys";

const getHaryPrivateKey = async () => {
  const data = await getPrivateKey("hary");
  return data;
};

export default function Hary() {
  const userId = parseInt(localStorage.getItem("userId") ?? "");

  const [, setIsAuthenticated] = useState(false);
  const { data, isLoading } = useQuery("haryPrivateKey", getHaryPrivateKey);
  const { createHary } = useHary();

  const getConversationIds = async () => {
    const data = await getConversations();
    return data.data.data?.map((conversation) => conversation.id) ?? [];
  };

  if (!axios.defaults.headers.common["Authorization"]) {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      return <Login setIsAuthenticated={setIsAuthenticated} />;
    }
  }

  if (isLoading) return;

  if (!data)
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <div className="m-8 w-1/3">
          No keys related to this account and device found! Please create keys
          for Hary to use.
        </div>
        <div className="alert alert-warning w-1/3 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Warning: This will overwrite any existing keys for Hary and
            no one will be able to decrypt any messages sent to you with the old
            keys!
          </span>
        </div>
        <button
          className="btn btn-neutral m-8"
          onClick={() => createHary(userId)}
        >
          Create Hary
        </button>
      </div>
    );

  return (
    <>
      <button className="btn btn-primary" onClick={() => createHary(userId)}>
        Create Hary
      </button>
      <Conversations
        getConversationIds={getConversationIds}
        databaseKey={"hary"}
      />
    </>
  );
}
