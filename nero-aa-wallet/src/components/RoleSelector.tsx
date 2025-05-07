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


export function RoleSelector() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();

//   useEffect(() => {
//     const fetchWalletAddress = async () => {
//       if (!session?.user?.id) return;

//       try {
//         const users = await fine.table("users")
//           .select("walletAddress")
//           .eq("id", session.user.id);
        
//         if (users.length > 0 && users[0].walletAddress) {
//           setWalletAddress(users[0].walletAddress);
//         }
//       } catch (error) {
//         console.error("Error fetching wallet address:", error);
//       }
//     };

//     fetchWalletAddress();
//   }, [session]);

  const handleRoleSelect = (value: UserRole) => {
    setSelectedRole(value);
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

  const roles = [
    {
      id: "farmer" as UserRole,
      title: "Farmer",
      description: "I grow and sell agricultural products",
      icon: Sprout,
    },
    {
      id: "consumer" as UserRole,
      title: "Consumer",
      description: "I purchase agricultural products for personal use",
      icon: ShoppingCart,
    },
    {
      id: "manufacturer" as UserRole,
      title: "Manufacturer",
      description: "I purchase agricultural products for manufacturing",
      icon: Factory,
    },
  ];

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
          
          <RadioGroup 
            value={selectedRole || ""}
            onValueChange={(value) => handleRoleSelect(value as UserRole)}
            className="space-y-4"
          >
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
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
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