import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Vocake from '@/pages/Vocake';
import TopicsPage from '@/pages/TopicsPage';
import CakeBuddyPage from '@/pages/CakeBuddyPage';
import PaymentScene from '@/pages/PaymentScene';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/contributor/Dashboard';
import NFTLibrary from '@/pages/contributor/NFTLibrary';
import Marketplace from '@/pages/contributor/Marketplace';
import CreateNFT from '@/pages/contributor/CreateNFT';
import Settings from '@/pages/Settings';
import { RoleProvider } from '@/context/RoleContext';
import SolanaWalletProvider from '@/components/SolanaWalletProvider';

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SolanaWalletProvider>
          <RoleProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Vocake />} />
                <Route path="/topics/:language" element={<TopicsPage />} />
                <Route path="/cakebuddy/:language" element={<CakeBuddyPage />} />
                <Route path="/payment" element={<PaymentScene />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/contributor/dashboard" element={<Dashboard />} />
                <Route path="/contributor/nft-library" element={<NFTLibrary />} />
                <Route path="/contributor/marketplace" element={<Marketplace />} />
                <Route path="/contributor/create-nft" element={<CreateNFT />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </RoleProvider>
        </SolanaWalletProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
