import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserRoleBadge } from "../components/UserRoleBadge";
import { WalletConnect } from "../components/WalletConnect";
import { Loader2 } from "lucide-react";
import { fine } from "../libs/fine";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";
import { useUserRole } from "../hooks/use-user-role";

const ProfilePage = () => {
  const { data: session } = fine.auth.useSession();
  const { userRole } = useUserRole();
  const user = session?.user;
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const { toast } = useToast();
  
  const handleUpdateProfile = async () => {
    if (!user?.id || !name.trim()) return;
    
    setIsUpdating(true);
    try {
      await fine.table("users")
        .update({ name: name.trim() })
        .eq("id", user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="container px-4 py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and blockchain wallet
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    // value={user.email}
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleUpdateProfile} 
                  // disabled={isUpdating || !name.trim() || name}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Type</CardTitle>
                <CardDescription>Your role on AgroChain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                  {userRole ? (
                    <>
                      <UserRoleBadge role={userRole} className="text-base px-3 py-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        {userRole === "farmer" 
                          ? "You can list and sell agricultural products." 
                          : userRole === "consumer"
                            ? "You can purchase products from farmers."
                            : "You can source raw materials for production."}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-center text-muted-foreground">
                        You haven't selected a role yet.
                      </p>
                      <Link to="/claim-role">
                        <Button variant="outline">Claim Role</Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Wallet</CardTitle>
                <CardDescription>Connect your wallet to use AgroChain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                  <WalletConnect />
                  <p className="text-sm text-center text-muted-foreground">
                    Connect your wallet to enable blockchain transactions for buying and selling products.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="border-t py-6">
        <div className="container flex justify-center px-4">
          <p className="text-sm text-muted-foreground">
            © 2023 AgroChain. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ProfilePage;