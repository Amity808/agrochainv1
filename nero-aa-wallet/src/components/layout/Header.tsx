import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Leaf } from "lucide-react";
import { fine } from "../../libs/fine";
import { UserRoleBadge } from "../UserRoleBadge";
import { useUserRole } from "../../hooks/use-user-role";
import { WalletConnect } from "../WalletConnect";
import { useAccount } from "wagmi";

export function Header() {
  const { data: session } = fine.auth.useSession();
  const { userRole } = useUserRole();
  const user = session?.user;

  const { address } = useAccount();

  return (
    <header className="border-b bg-white dark:bg-gray-950 dark:text-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">AgroChain</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {userRole && <UserRoleBadge role={userRole} />}
              <WalletConnect />
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:inline-block">
                  {user.name}
                </span>
                
                {userRole === "farmer" && (
                  <Link to="/products/add">
                    <Button variant="outline" size="sm" className="hidden md:inline-flex">
                      Add Product
                    </Button>
                  </Link>
                )}
                
                {!userRole && (
                  <Link to="/claim-role">
                    <Button variant="outline" size="sm">
                      Claim Role
                    </Button>
                  </Link>
                )}
                
                <Link to="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                
                <Link to="/logout">
                  <Button variant="outline" size="sm">Logout</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}