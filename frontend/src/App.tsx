import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Conversations from './Conversations';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Conversations />
    </QueryClientProvider>
  );
}


export default App;
