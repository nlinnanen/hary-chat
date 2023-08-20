import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Conversations from "./components/Conversations";
import { Route, Router, Routes } from "react-router-dom";
import Public from "@components/Public";
import Hary from "@components/Hary/Hary";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/hary" element={<Hary />} />
        <Route path="/" element={<Public />} />
        <Route path="/conversation/:conversationId" element={<Public />} />
        <Route path="hary/conversation/:conversationId" element={<Hary />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
