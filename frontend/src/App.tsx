import Hary from "@components/Hary/Hary";
import Settings from "@components/Hary/Settings";
import Public from "@components/Public";
import Questions from "@components/Questions/Questions";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="hary" element={<Hary />} />
        <Route path="hary/settings" element={<Settings />} />
        <Route path="" element={<Questions />} />
        <Route path="conversation/:conversationId" element={<Public />} />
        <Route path="conversation" element={<Public />} />
        <Route path="hary/conversation/:conversationId" element={<Hary />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
