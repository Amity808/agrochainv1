import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Replace useNavigation with useNavigate
import { fine } from "../libs/fine";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "../hooks/use-toast";
import { Loader2, Sprout, ShoppingCart, Factory } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import type { UserRole } from "../hooks/use-user-role";


import { useSignature, useSendUserOp, useConfig } from '@/hooks';
import { ethers } from 'ethers';
import AgroABi from "@/constants/agrochain.json";
import { CONTRACT_ROLE, contractAddressAgroChaim } from "@/constants/contractRole";
import { useAccount } from "wagmi";


export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>('');

  const navigate = useNavigate();
  
  const { AAaddress, isConnected } = useSignature();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);


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

  const handleRoleSelect = (value: UserRole) => {
    setSelectedRole(value);
    const selectedRoleObj = roles.find(role => role.id === value);
    if (selectedRoleObj && selectedRoleObj.onSelect) {
      selectedRoleObj.onSelect();
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (!selectedRole) {
  //       toast({
  //         title: "Error",
  //         description: "Please select a role",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     if (!session?.user?.id) {
  //       toast({
  //         title: "Error",
  //         description: "You already has a role",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     if (!walletAddress) {
  //       toast({
  //         title: "Wallet required",
  //         description: "Please connect your wallet before claiming a role",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     setIsLoading(true);

  //     try {
  //       // Update user metadata
  //       await fine.auth.updateUserMetadata({
  //         role: selectedRole
  //       });

  //       // Also update the user record in the database
  //       await fine.table("users")
  //         .update({ role: selectedRole })
  //         .eq("id", session.user.id);

  //       toast({
  //         title: "Success",
  //         description: `You are now registered as a ${selectedRole} on the blockchain`,
  //       });

  //       // Force a refresh of the session to update the role
  //       window.location.href = "/";
  //     } catch (error: any) {
  //       toast({
  //         title: "Error",
  //         description: error.message || "Failed to update role",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };


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
                Please visit your profile page to connect your wallet.
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

          {/* <RadioGroup
            value={selectedRole || ""}
            onValueChange={(value) => handleRoleSelect(value as UserRole)}
            className="space-y-4"
          > */}
            {roles.map((role) => (
              <div key={role.id} className="flex items-start space-x-3">
                <RadioGroupItem value={role.id || ""} id={role.id} className="mt-1" />
                <div className="flex flex-1 items-start space-x-3 rounded-md border p-3">
                  <role.icon className="h-5 w-5 text-green-600" />
                  <div className="space-y-1">
                    <Label htmlFor={role.id} className="text-base font-medium">
                      {role.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    <input type="text" name="wallet address"
                      className="border-2 rounded-md"
                      placeholder="Wallet Address" value={walletAddress ?? ""}
                      onChange={(e) => setWalletAddress(e.target.value)} id="" />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => role.onSelect()}
                    >
                      GrantRole
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {/* </RadioGroup> */}
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