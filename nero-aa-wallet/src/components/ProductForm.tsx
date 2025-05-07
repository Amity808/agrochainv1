import { useState } from "react";

import { useRouter } from "next/navigation";
import { fine } from "../libs/fine";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Schema } from "../libs/db-types";

export function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Schema["products"], "id" | "farmerId" | "status" | "createdAt" | "transactionHash">>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "kg",
    imageUrl: "",
  });
  
  const navigate = useRouter();
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
    }));
  };

  // Mock blockchain transaction
  const generateTransactionHash = () => {
    return "0x" + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add a product",
        variant: "destructive",
      });
      return;
    }

    // Check if user has connected a wallet
    const users = await fine.table("users")
      .select("walletAddress")
      .eq("id", session.user.id);
    
    if (!users.length || !users[0].walletAddress) {
      toast({
        title: "Wallet required",
        description: "Please connect your wallet to add products",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate a mock transaction hash for blockchain verification
      const transactionHash = generateTransactionHash();
      
      const productData: Schema["products"] = {
        ...formData,
        farmerId: session.user.id,
        transactionHash,
      };

      const result = await fine.table("products").insert(productData).select();
      
      toast({
        title: "Product added",
        description: "Your product has been added and is being verified on the blockchain",
      });
      
      navigate.push("/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          List your agricultural product for sale on the blockchain
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Organic Tomatoes"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product..."
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="10.00"
                value={formData.price || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="100"
                value={formData.quantity || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              name="unit"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="lb">Pound (lb)</option>
              <option value="ton">Ton</option>
              <option value="piece">Piece</option>
              <option value="dozen">Dozen</option>
              <option value="box">Box</option>
              <option value="crate">Crate</option>
              <option value="bushel">Bushel</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl || ""}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL for your product image. Leave blank to use a default image.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate.push("/products")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding to Blockchain...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}