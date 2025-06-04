import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Replace useNavigation with useNavigate
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
// import { useToast } from "../hooks/use-toast";
import { Loader2, Sprout, Factory } from "lucide-react";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import type { UserRole } from "../hooks/use-user-role";

import { useSignature, useConfig } from '@/hooks';
// import { ethers } from 'ethers';
import AgroABi from "@/constants/agrochain.json";
import { CONTRACT_ROLE, contractAddressAgroChaim } from "@/constants/contractRole";
import { useAccount } from "wagmi";
import { getWallet } from "@/utils/getWallet";
import { ethers } from "ethers";
// import { toast } from "@/hooks/use-toast";
import { useRoles } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const navigate = useNavigate();
  const { AAaddress, isConnected } = useSignature();
  const {isFarmerRole, isConsumerRole, isManufactureRole} = useRoles(AAaddress); // Fetch roles for the given wallet address
  
  
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const {address }  = useAccount()

  const { toast } = useToast();

  const wallet = getWallet(import.meta.env.VITE_SIGN_URL);

  const contractWasteInsured = new ethers.Contract(
    contractAddressAgroChaim,
    AgroABi, 
    wallet
    // signer
  );




  const handleFamerRole = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if(isFarmerRole) {
      alert('You already have a Farmer role');
      return;
    }
    setIsLoading(true);
    

    try {
      const getRole = await contractWasteInsured.grantRole(
        CONTRACT_ROLE.FARMER_ROLE, 
        AAaddress);
      console.log(getRole, "getRole");
      toast({
        title: "Success",
        description: `You are now registered as a Farmer on the Agrochain`,
        
      })
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get role.",
        variant: "destructive", // Use "destructive" for errors
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleConsumerRole = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if(isConsumerRole) {
      alert('You already have a Consumer role');
      return;
    }
    setIsLoading(true);
    

    try {     

      const getRole = await contractWasteInsured.grantRole(
        CONTRACT_ROLE.CONSUMER_ROLE, 
        AAaddress);
      console.log(getRole, "getRole");
      toast({
        title: "Success",
        description: `You are now registered as a Farmer on the Agrochain`,
        
      })
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to select role.",
        variant: "destructive", 
      });
    } finally {
      setIsLoading(false);
    }
  }

  // console.log(isFarmerRole, "isFarmerRole");

  const handleManufacturerRole = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if(isManufactureRole) {
      alert('You already have a Manufacturer role');
      return;
    }
    setIsLoading(true);

    try {

      const getRole = await contractWasteInsured.grantRole(
        CONTRACT_ROLE.CONSUMER_ROLE, 
        AAaddress);
      console.log(getRole, "getRole");
      toast({
        title: "Success",
        description: `You are now registered as a Manufacturer on the Agrochain`,
        
      })
      alert('You are now registered as a Manufacturer on the Agrochain');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to select role.",
        variant: "destructive", 
      });
    } finally {
      setIsLoading(false);
    }
  }

  



 
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
          {!AAaddress && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Required</AlertTitle>
              <AlertDescription>
                You need to connect your blockchain wallet before claiming a role.
                Please click on the any role you are looking forward to get.
              </AlertDescription>
              <div className="mt-4">
                
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
            disabled={isLoading || !selectedRole}
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