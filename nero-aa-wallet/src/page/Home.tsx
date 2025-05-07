import { fine } from "../libs/fine";
import { Header } from "../components/layout/Header";
import { Dashboard } from "../components/Dashboard";
import { RoleSelector } from "../components/RoleSelector";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, TrendingUp, ShieldCheck, Link as LinkIcon } from "lucide-react";
import { useUserRole } from "../hooks/use-user-role";

const Home = () => {
  const { data: session, isPending } = fine.auth.useSession();
  const { userRole, isLoading: isRoleLoading } = useUserRole();
  const user = session?.user;

  if (isPending || isRoleLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="container px-4 py-6 flex-1">
        {user ? (
          userRole ? (
            <Dashboard userRole={userRole} userId={user.id} />
          ) : (
            <div className="max-w-3xl mx-auto py-8">
              <h1 className="text-3xl font-bold mb-6 text-center">Welcome to AgroChain</h1>
              <p className="text-muted-foreground text-center mb-8">
                Please select a role to continue using the blockchain platform
              </p>
              <RoleSelector />
            </div>
          )
        ) : (
          <div className="py-12 md:py-24 lg:py-32 space-y-12">
            <div className="container flex flex-col items-center gap-4 text-center">
              <Leaf className="h-12 w-12 text-green-600" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Welcome to AgroChain
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connecting farmers directly with consumers and manufacturers on the blockchain for a more transparent and sustainable agricultural ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
            
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-green-100 p-4 mb-4">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">For Farmers</h3>
                  <p className="text-muted-foreground">
                    List your products directly to consumers and manufacturers on the blockchain, cutting out the middleman and increasing your profits.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">For Consumers</h3>
                  <p className="text-muted-foreground">
                    Access fresh, high-quality agricultural products directly from the source with blockchain verification for full transparency.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-100 p-4 mb-4">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold">For Manufacturers</h3>
                  <p className="text-muted-foreground">
                    Source raw materials directly from farmers with blockchain traceability, ensuring quality and supporting sustainable agriculture.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="container">
              <div className="bg-muted/50 rounded-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="rounded-full bg-green-100 p-4">
                    <LinkIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Blockchain Powered</h3>
                    <p className="text-muted-foreground">
                      AgroChain uses blockchain technology to ensure transparency, traceability, and security in agricultural transactions. 
                      Connect your wallet to start trading on our decentralized platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 px-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">
              © 2023 AgroChain. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;