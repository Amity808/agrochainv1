import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Replace useNavigation with useNavigate
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
// import { useToast } from "../hooks/use-toast";
import { Loader2, Sprout, ShoppingCart, Factory } from "lucide-react";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import type { UserRole } from "../hooks/use-user-role";

import { useSignature, useSendUserOp, useConfig } from '@/hooks';
// import { ethers } from 'ethers';
import AgroABi from "@/constants/agrochain.json";
import { CONTRACT_ROLE, contractAddressAgroChaim } from "@/constants/contractRole";
import { useAccount } from "wagmi";


export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>('');
  const [walletAddressManu, setWalletAddressManu] = useState<string | null>('');
  const [walletAddressConsumer, setWalletAddressConsumer] = useState<string | null>('');

  const navigate = useNavigate();
  
  const { AAaddress, isConnected } = useSignature();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const {address }  = useAccount()



  const handleFamerRole = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setIsLoading(true);
    setUserOpHash(null);
    setTxStatus('');

    try {
      await execute({
        function: 'grantRole',
        contractAddress: contractAddressAgroChaim,
        abi: AgroABi,
        params: [CONTRACT_ROLE.FARMER_ROLE, walletAddress],
        value: 0,
      });

      const result = await waitForUserOpResult();
      setUserOpHash(result?.userOpHash);
      setIsPolling(true);

      if (result.result === true) {
        setTxStatus('Success!');
        setIsPolling(false);
      } else if (result.transactionHash) {
        setTxStatus('Transaction hash: ' + result.transactionHash);
      }
    } catch (error) {
      console.error('Error:', error);
      setTxStatus('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const handleConsumerRole = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setIsLoading(true);
    setUserOpHash(null);
    setTxStatus('');

    try {
      await execute({
        function: 'grantRole',
        contractAddress: contractAddressAgroChaim,
        abi: AgroABi,
        params: [CONTRACT_ROLE.CONSUMER_ROLE, walletAddress],
        value: 0,
      });

      const result = await waitForUserOpResult();
      setUserOpHash(result?.userOpHash);
      setIsPolling(true);

      if (result.result === true) {
        setTxStatus('Success!');
        setIsPolling(false);
      } else if (result.transactionHash) {
        setTxStatus('Transaction hash: ' + result.transactionHash);
      }
    } catch (error) {
      console.error('Error:', error);
      setTxStatus('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const handleManufacturerRole = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setIsLoading(true);
    setUserOpHash(null);
    setTxStatus('');

    try {
      await execute({
        function: 'grantRole',
        contractAddress: contractAddressAgroChaim,
        abi: AgroABi,
        params: [CONTRACT_ROLE.MANUFACTURE_ROLE, walletAddress],
        value: 0,
      });

      const result = await waitForUserOpResult();
      setUserOpHash(result?.userOpHash);
      setIsPolling(true);

      // if (result.result === true) {
        setTxStatus('Success!');
        setIsPolling(false);
      // } else if (result.transactionHash) {
        setTxStatus('Transaction hash: ' + result.transactionHash);
      // }
    } catch (error) {
      console.error('Error:', error);
      setTxStatus('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const roles = [
    {
      id: "farmer" as UserRole,
      title: "Farmer",
      description: "I grow and sell agricultural products",
      icon: Sprout,
      onSelect: handleFamerRole,
    },
    {
      id: "consumer" as UserRole,
      title: "Consumer",
      description: "I purchase agricultural products for personal use",
      icon: ShoppingCart,
      onSelect: handleConsumerRole,
    },
    {
      id: "manufacturer" as UserRole,
      title: "Manufacturer",
      description: "I purchase agricultural products for manufacturing",
      icon: Factory,
      onSelect: handleManufacturerRole,
    },
  ];



 
  //       toast({
  //         title: "Error",
  //         description: "You already has a role",
  //         variant: "destructive",
  //       });


  //       toast({
  //         title: "Wallet required",
  //         description: "Please connect your wallet before claiming a role",
  //         variant: "destructive",

  //       toast({
  //         title: "Success",
  //         description: `You are now registered as a ${selectedRole} on the blockchain`,
  //       });




  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choose Your Role</CardTitle>
        <CardDescription>
          Select a role that best describes how you'll use AgroChain
        </CardDescription>
      </CardHeader>
      <form >
        <CardContent className="space-y-4">
          {!walletAddress && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Required</AlertTitle>
              <AlertDescription>
                You need to connect your blockchain wallet before claiming a role.
                Please contact the admin to get from or fill this form coming soon.
              </AlertDescription>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </Button>
              </div>
            </Alert>
          )}
            <div className="flex items-start space-x-3">
                <div className="flex flex-1 items-start space-x-3 rounded-md border p-3">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <div className="space-y-1">
                    <Label  className="text-base font-medium">
                      Farmer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I grow and sell agricultural products
                    </p>
                    <input type="text" name="wallet address"
                      className="border-2 rounded-md"
                      placeholder="Wallet Address" value={walletAddress ?? ""}
                      onChange={(e) => setWalletAddress(e.target.value)} id="" />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      className="mr-2"
                      onClick={handleFamerRole}
                    >
                      GrantRole
                    </Button>
                  </div>
                </div>
              </div>

              {/* consumer role */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-1 items-start space-x-3 rounded-md border p-3">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <div className="space-y-1">
                    <Label  className="text-base font-medium">
                      Consumer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I purchase agricultural products for personal use
                    </p>
                    <input type="text" name="wallet address"
                      className="border-2 rounded-md"
                      placeholder="Wallet Address" value={walletAddressConsumer ?? ""}
                      onChange={(e) => setWalletAddressConsumer(e.target.value)} id="" />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      className="mr-2"
                      onClick={handleConsumerRole}
                    >
                      GrantRole
                    </Button>
                  </div>
                </div>
              </div>

              {/* manufacturer role */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-1 items-start space-x-3 rounded-md border p-3">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <div className="space-y-1">
                    <Label  className="text-base font-medium">
                      Manufacturer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                    I purchase agricultural products for manufacturing
                    </p>
                    <input type="text" name="wallet address"
                      className="border-2 rounded-md"
                      placeholder="Wallet Address" value={walletAddressManu ?? ""}
                      onChange={(e) => setWalletAddressManu(e.target.value)} id="" />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      className="mr-2"
                      onClick={handleManufacturerRole}
                    >
                      GrantRole
                    </Button>
                  </div>
                </div>
              </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading || !selectedRole || !walletAddress}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Role"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}