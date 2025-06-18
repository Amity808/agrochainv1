import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { useSignature, useSendUserOp, useConfig } from '@/hooks';
// import { ethers } from 'ethers';
import AgroABi from "@/constants/agrochain.json";
import { contractAddressAgroChaim } from "@/constants/contractRole";
import { makeContractMetadata } from "@/utils/UploadPinta";

export function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "kg",
    imageFile: null as File | null,
  });

  const { AAaddress, isConnected } = useSignature();

  console.log(AAaddress, "AAaddress");
  const { address } = useAccount();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const config = useConfig();
  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  const navigate = useNavigate();
  

  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
    }));
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setIsLoading(true);
    setUserOpHash(null);
    setTxStatus('');

    

    

    try {

      const response = await makeContractMetadata({
      imageFile: formData.imageFile!,
      name: formData.name,
      description: formData.description,
      unit: formData.unit
    })

    console.log(response, "response")

      if(response) {
        const resultExcute = await execute({
          function: 'addProduct',
          contractAddress: contractAddressAgroChaim,
          abi: AgroABi,
          params: [response, formData.price, formData.quantity, AAaddress],
          value: 0,
        });
  
        console.log(resultExcute, "resultExcute")
  
        const result = await waitForUserOpResult();
        setUserOpHash(result?.userOpHash);
        setIsPolling(true);
        console.log(result)
  
        if (result.result === true) {
          setTxStatus('Success!');
          setIsPolling(false);
        } else if (result.transactionHash) {
          setTxStatus('Transaction hash: ' + result.transactionHash);
        }
      }
      
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
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFormData((prev) => ({ ...prev, imageFile: e.target.files![0] }));
                }
              }}
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
            onClick={() => navigate("/products")}
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