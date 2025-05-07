import React from "react";
import { Header } from "../components/layout/Header";
import { RoleSelector } from "../components/RoleSelector";
import { useNavigate } from "react-router-dom";
// import { useUserRole } from "../hooks/use-user-role";

const ClaimRolePage = () => {
  // const { userRole } = useUserRole();
  // const navigate = useNavigate();
  
  // Redirect users who already have a role
  // if (userRole) {
  //   navigate("/");
  //   return null;
  // }
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="container px-4 py-6 flex-1">
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Role</h1>
          <p className="text-muted-foreground text-center mb-8">
            Select a role that best describes how you'll use AgroChain
          </p>
          <RoleSelector />
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

export default ClaimRolePage;