import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Loader2, Plus, Filter } from "lucide-react";
import { fine } from "@/libs/fine";
import { Schema } from "@/libs/db-types";
import { useToast } from "@/hooks/use-toast";

import { useUserRole } from "@/hooks/use-user-role";

type ProductWithFarmer = Schema["products"] & {
  farmer: Schema["users"];
};

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductWithFarmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  const { userRole } = useUserRole();
  const user = session?.user;
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await fine.table("products")
        .select("*, farmer:users(id, name, email, role)");
      
      setProducts(fetchedProducts as unknown as ProductWithFarmer[]);
    } catch (error) {
      toast({
        title: "Failed to load products",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleProductPurchase = () => {
    fetchProducts();
  };
  
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (b.createdAt || 0) - (a.createdAt || 0);
        case "oldest":
          return (a.createdAt || 0) - (b.createdAt || 0);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  
  return (
    <main className="w-full min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="container px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Browse all available agricultural products
            </p>
          </div>
          
          {userRole === "farmer" && (
            <Link to="/products/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                userRole={userRole || undefined}
                userId={user?.id}
                onPurchase={handleProductPurchase}
              />
            ))}
          </div>
        )}
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

export default ProductsPage;