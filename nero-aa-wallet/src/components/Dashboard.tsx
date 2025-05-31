import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Loader2, Plus, ShoppingBag, Truck, BarChart3 } from "lucide-react";
import { fine } from "../libs/fine";
import { Schema } from "../libs/db-types";
import { useToast } from "../hooks/use-toast";
import { TransactionStatus } from "./TransactionStatus";

type ProductWithFarmer = Schema["products"] & {
  farmer: Schema["users"];
};

type TransactionWithDetails = Schema["transactions"] & {
  product: Schema["products"];
  buyer: Schema["users"];
  seller: Schema["users"];
};

interface DashboardProps {
  userRole?: string;
  userId?: string;
}

export function Dashboard({ userRole, userId }: DashboardProps) {
  const [products, setProducts] = useState<ProductWithFarmer[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchProducts = async () => {
    try {
      let productsQuery = fine.table("products").select("*, farmer:users(id, name, email, role, walletAddress)");
      
      if (userRole === "farmer" && userId) {
        productsQuery = productsQuery.eq("farmerId", userId);
      }
      
      const fetchedProducts = await productsQuery;
      setProducts(fetchedProducts as unknown as ProductWithFarmer[]);
    } catch (error) {
      toast({
        title: "Failed to load products",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const fetchTransactions = async () => {
    if (!userId) return;
    
    try {
      let transactionsQuery = fine.table("transactions")
        .select("*, product:products(*), buyer:users(id, name, role, walletAddress), seller:users(id, name, role, walletAddress)");
      
      if (userRole === "farmer") {
        transactionsQuery = transactionsQuery.eq("sellerId", userId);
      } else {
        transactionsQuery = transactionsQuery.eq("buyerId", userId);
      }
      
      const fetchedTransactions = await transactionsQuery;
      setTransactions(fetchedTransactions as unknown as TransactionWithDetails[]);
    } catch (error) {
      toast({
        title: "Failed to load transactions",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    await Promise.all([fetchProducts(), fetchTransactions()]);
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }
  }, [userId, userRole]);
  
  const handleProductPurchase = () => {
    loadDashboardData();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const renderDashboardContent = () => {
    switch (userRole) {
      case "farmer":
        return (
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Listed Products</h3>
                <Link to="/products/add">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                </Link>
              </div>
              {/* Get product related to farmer */}
              
            </TabsContent>
            
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Sales History</CardTitle>
                  <CardDescription>Track all your product sales on the blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">No sales recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <Card key={transaction.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{transaction.product?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Purchased by: {transaction.buyer?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {transaction.quantity} {transaction.product?.unit}
                                </p>
                                <div className="mt-2">
                                  <TransactionStatus 
                                    transactionHash={transaction.transactionHash} 
                                    status={transaction.status}
                                  />
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${transaction.totalPrice.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(transaction.createdAt! * 1000).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Statistics</CardTitle>
                  <CardDescription>Overview of your farming business on the blockchain</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Blockchain statistics will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
        
      case "consumer":
      case "manufacturer":
        return (
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            </TabsList>
            <TabsContent value="marketplace" className="space-y-4">
              <h3 className="text-lg font-medium">Available Products</h3>
              {/* case of consumer */}
              
            </TabsContent>
            
            <TabsContent value="purchases">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Track all your blockchain purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">You haven't made any purchases yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <Card key={transaction.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{transaction.product?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Seller: {transaction.seller?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {transaction.quantity} {transaction.product?.unit}
                                </p>
                                <div className="mt-2">
                                  <TransactionStatus 
                                    transactionHash={transaction.transactionHash} 
                                    status={transaction.status}
                                  />
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${transaction.totalPrice.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(transaction.createdAt! * 1000).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
        
      default:
        return (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground text-center">
                Please claim a role to access the dashboard.
              </p>
              <Link to="/claim-role" className="mt-4">
                <Button>Claim Role</Button>
              </Link>
            </CardContent>
          </Card>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blockchain Dashboard</h2>
          <p className="text-muted-foreground">
            {userRole === "farmer" 
              ? "Manage your agricultural products and track sales on the blockchain" 
              : userRole === "consumer"
                ? "Browse and purchase fresh products from farmers with blockchain verification"
                : userRole === "manufacturer"
                  ? "Source raw materials for your production with blockchain traceability"
                  : "Welcome to AgroChain"}
          </p>
        </div>
      </div>
      
      {renderDashboardContent()}
    </div>
  );
}