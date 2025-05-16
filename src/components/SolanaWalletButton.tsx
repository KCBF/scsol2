import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface SolanaWalletButtonProps {
  color?: string;
}

const SolanaWalletButton: React.FC<SolanaWalletButtonProps> = ({ color }) => {
  // If a color prop is provided, inject a style tag to override the background color
  React.useEffect(() => {
    if (!color) return;
    const style = document.createElement('style');
    style.innerHTML = `.wallet-adapter-button { background-color: ${color} !important; } .wallet-adapter-button:hover { background-color: ${color}CC !important; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [color]);

  return (
    <div className="flex justify-center items-center">
      <WalletMultiButton />
    </div>
  );
};

export default SolanaWalletButton;
