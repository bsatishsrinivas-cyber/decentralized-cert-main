"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useWallet } from '@/lib/wallet-context';
import { getShortAddress } from '@/lib/wallet';
import { Wallet, LogOut, AlertCircle, Download, User, UserPlus, ChevronDown } from 'lucide-react';

export const EnhancedWalletConnect = () => {
  const { wallet, connectWallet, disconnectWalletHandler, isLoading, error } = useWallet();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      if (err instanceof Error && err.message.includes('not installed')) {
        setShowInstallPrompt(true);
      } else if (err instanceof Error && err.message.includes('Failed to connect')) {
        console.log('Wallet connection issue:', err.message);
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWalletHandler();
    setIsLoggedIn(false);
    setUserName('');
  };

  const installLeatherWallet = () => {
    window.open('https://leather.io/install-extension', '_blank');
  };

  const handleLoginSignup = () => {
    // Simulate login/signup - in real app, this would open a modal
    const name = prompt('Enter your name:');
    if (name && name.trim()) {
      setUserName(name.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setShowUserMenu(false);
  };

  if (showInstallPrompt) {
    return (
      <div className="flex items-center justify-between w-full">
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
      </div>
    );
  }

  return (
    <TooltipProvider>
             <div className="flex items-center space-x-8">
        {/* Left Side - Wallet Elements */}
        <div className="flex items-center space-x-3">
          {/* Wallet Connect Logo Button - Only show when not connected */}
          {!wallet.isConnected && (
            <Tooltip>
              <TooltipTrigger asChild>
                                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handleConnect}
                   disabled={isLoading}
                   className="h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors duration-200"
                 >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                  ) : (
                    <Wallet className="h-4 w-4 text-primary" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect Wallet</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Wallet Status - Show when connected */}
          {wallet.isConnected && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Wallet className="h-3 w-3 mr-1" />
                {wallet.network}
              </Badge>
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
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs">{error}</span>
            </div>
          )}
        </div>

        {/* Right Side - User Authentication */}
        <div className="flex items-center">
          {/* Login/Signup Button - Show when not logged in */}
          {!isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoginSignup}
              className="h-8 px-4"
            >
              <User className="h-3 w-3 mr-1" />
              Login/Signup
            </Button>
          )}

          {/* User Menu - Show when logged in */}
          {isLoggedIn && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 px-3 flex items-center space-x-2"
              >
                <User className="h-3 w-3" />
                <span className="text-sm">{userName}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-1 bg-background border rounded-md shadow-lg z-50 min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start h-8 px-3 text-sm"
                  >
                    <LogOut className="h-3 w-3 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
