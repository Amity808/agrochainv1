import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Leaf } from "lucide-react";
// import { fine } from "../../libs/fine";
// import { UserRoleBadge } from "../UserRoleBadge";

// import { useAccount } from "wagmi";
import { useSignature } from "@/hooks";
import { truncateAddress } from "@/utils";

//  TODO: create a hook to manage the roles selection 
export function Header() {

  // const { address } = useAccount();
  const { AAaddress } = useSignature();

  return (
    <header className="border-b bg-white dark:bg-gray-950 dark:text-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">AgroChain</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {AAaddress ? (
            <div className="flex items-center gap-4">
              {/* {userRole && <UserRoleBadge role={userRole} />} */}
              {/* <WalletConnect /> */}
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:inline-block">
                  {truncateAddress(AAaddress)}
                </span>
                
                {/* {userRole === "farmer" && ( */}
                  <Link to="/add-product">
                    <Button variant="outline" size="sm" className="hidden md:inline-flex">
                      Add Product
                    </Button>
                  </Link>
              
                
                {/* {!AAaddress && (
                  <Link to="/claim-role">
                    <Button variant="outline" size="sm">
                      Get Role
                    </Button>
                  </Link>
                )} */}
                
                <Link to="/product">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                
                {/* <Link to="/logout">
                  <Button variant="outline" size="sm">Logout</Button>
                </Link> */}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* <Link to="/login"> */}
                <Button variant="outline" size="sm">Connect Wallet</Button>
              {/* </Link> */}
              {/* <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link> */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}