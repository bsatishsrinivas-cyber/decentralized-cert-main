"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/lib/wallet-context';
import { getShortAddress } from '@/lib/wallet';
import { Wallet, LogOut, AlertCircle, Download } from 'lucide-react';

export const WalletConnect = () => {
  const { wallet, connectWallet, disconnectWalletHandler, isLoading, error } = useWallet();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      if (err instanceof Error && err.message.includes('not installed')) {
        setShowInstallPrompt(true);
      } else if (err instanceof Error && err.message.includes('Failed to connect')) {
        // Show a more helpful message for connection issues
        console.log('Wallet connection issue:', err.message);
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWalletHandler();
  };

  const installLeatherWallet = () => {
    window.open('https://leather.io/install-extension', '_blank');
  };

  if (wallet.isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          <Wallet className="h-3 w-3 mr-1" />
          {wallet.network}
        </Badge>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {getShortAddress(wallet.address || '')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="h-8 px-3"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  if (showInstallPrompt) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-yellow-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Leather wallet required</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={installLeatherWallet}
          className="h-8 px-3"
        >
          <Download className="h-3 w-3 mr-1" />
          Install
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInstallPrompt(false)}
          className="h-8 px-2"
        >
          ×
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleConnect}
        disabled={isLoading}
        className="h-8 px-4"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
        ) : (
          <Wallet className="h-3 w-3 mr-1" />
        )}
        Connect Wallet
      </Button>
      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};
