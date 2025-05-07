import { Header } from "@/components/layout/Header";
import { ProductForm } from "@/components/ProductForm";
// import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";

const AddProductPage = () => {
//   const { data: session } = fine.auth.useSession();
  const { userRole } = useUserRole();
  const navigate = useNavigate();
  
  // Redirect non-farmers away from this page
//   if (userRole && userRole !== "farmer") {
//     navigate("/");
//     return null;
//   }
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="container px-4 py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            List your agricultural product on AgroChain
          </p>
        </div>
        
        <ProductForm />
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

export default AddProductPage