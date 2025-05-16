import React from 'react';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const SolanaWalletButton: React.FC = () => {
  const { connected } = useSolanaWallet();

  return (
    <div className="wallet-adapter-button-trigger">
      <WalletMultiButton 
        className="!bg-purple-600 hover:!bg-purple-700 !rounded-full !px-4 !py-2 !text-white !font-medium"
      />
    </div>
  );
};

export default SolanaWalletButton; 