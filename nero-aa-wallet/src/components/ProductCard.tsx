import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UserRoleBadge } from "./UserRoleBadge";
import { TransactionStatus } from "./TransactionStatus";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { fine } from "../libs/fine";
import { useToast } from "../hooks/use-toast";
import { Schema } from "../libs/db-types";

type ProductWithFarmer = Schema["products"] & {
  farmer: Schema["users"];
};

interface ProductCardProps {
  product: ProductWithFarmer;
  userRole?: string;
  userId?: string;
  onPurchase?: () => void;
}

export function ProductCard({ product, userRole, userId, onPurchase }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isFarmer = userRole === "farmer";
  const canBuy = (userRole === "consumer" || userRole === "manufacturer") && 
                 product.status === "available" && 
                 product.farmerId !== userId;

  // Mock blockchain transaction
  const generateTransactionHash = () => {
    return "0x" + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handlePurchase = async () => {
    if (!userId || !canBuy) return;
    
    setIsLoading(true);
    try {
      // Generate a mock transaction hash
      const transactionHash = generateTransactionHash();
      
      // Create transaction
      await fine.table("transactions").insert({
        productId: product.id as number,
        sellerId: product.farmerId,
        buyerId: userId,
        quantity: product.quantity,
        totalPrice: product.price,
        status: "completed",
        transactionHash
      });
      
      // Update product status
      await fine.table("products")
        .update({ 
          status: "sold",
          transactionHash
        })
        .eq("id", product.id);
      
      toast({
        title: "Purchase successful",
        description: `You have purchased ${product.name}. Transaction is being processed on the blockchain.`,
      });
      
      if (onPurchase) onPurchase();
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={product.status === "available" ? "default" : "secondary"} 
                 className={product.status === "available" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}>
            {product.status === "available" ? "Available" : "Sold"}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{product.name}</CardTitle>
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span>by {product.farmer?.name || "Unknown Farmer"}</span>
          <UserRoleBadge role="farmer" className="text-xs" />
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description || "No description provided."}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="bg-muted/50">
            {product.quantity} {product.unit}
          </Badge>
          {product.transactionHash && (
            <TransactionStatus 
              transactionHash={product.transactionHash} 
              status={product.status}
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        {canBuy && (
          <Button 
            onClick={handlePurchase} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Purchase"
            )}
          </Button>
        )}
        {isFarmer && product.farmerId === userId && (
          <Badge variant="outline" className="w-full flex justify-center py-1">
            Your Product
          </Badge>
        )}
        {product.status === "sold" && (
          <Badge variant="secondary" className="w-full flex justify-center py-1">
            Sold Out
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}