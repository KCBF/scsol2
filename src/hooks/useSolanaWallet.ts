import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

export const useSolanaWallet = () => {
  const { 
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    wallet,
    wallets,
    connect
  } = useWallet();

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [disconnect]);

  return {
    publicKey,
    connected,
    connecting,
    disconnect: handleDisconnect,
    connect: handleConnect,
    select,
    wallet,
    wallets,
  };
}; 