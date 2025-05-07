import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";
import { fine } from "../libs/fine";

// Mock WalletConnect functionality for demonstration
// In a real app, you would use a library like @walletconnect/web3-provider
const mockWalletConnect = {
  connect: () => new Promise<string>((resolve) => {
    setTimeout(() => {
      // Generate a random wallet address
      const address = "0x" + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      resolve(address);
    }, 1500);
  }),
  disconnect: () => new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  })
};

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (!session?.user?.id) return;

      try {
        const users = await fine.table("users")
          .select("walletAddress")
          .eq("id", session.user.id);
        
        if (users.length > 0 && users[0].walletAddress) {
          setWalletAddress(users[0].walletAddress);
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    };

    fetchWalletAddress();
  }, [session]);

  const connectWallet = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const address = await mockWalletConnect.connect();
      setWalletAddress(address);
      
      // Save wallet address to user record
      await fine.table("users")
        .update({ walletAddress: address })
        .eq("id", session.user.id);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (!session?.user?.id) return;

    try {
      await mockWalletConnect.disconnect();
      setWalletAddress(null);
      
      // Remove wallet address from user record
      await fine.table("users")
        .update({ walletAddress: null })
        .eq("id", session.user.id);
      
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      toast({
        title: "Disconnection failed",
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  if (!walletAddress) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-md">
        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={disconnectWallet}
      >
        Disconnect
      </Button>
    </div>
  );
}