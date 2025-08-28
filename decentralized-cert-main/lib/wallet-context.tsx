"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState, connectLeatherWallet, disconnectWallet } from './wallet';

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWalletHandler: () => void;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    publicKey: null,
    network: 'testnet',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const walletState = await connectLeatherWallet();
      setWallet(walletState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWalletHandler = () => {
    const disconnectedState = disconnectWallet();
    setWallet(disconnectedState);
    setError(null);
  };

  // Check for existing wallet connection on mount
  useEffect(() => {
    // You could check localStorage or other persistence here
    // For now, we'll start with disconnected state
  }, []);

  const value: WalletContextType = {
    wallet,
    connectWallet,
    disconnectWalletHandler,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
