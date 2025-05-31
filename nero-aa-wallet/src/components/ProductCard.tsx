import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
// import { UserRoleBadge } from "./UserRoleBadge";
// import { TransactionStatus } from "./TransactionStatus";
import { useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import AgroABi from "@/constants/agrochain.json";
import { contractAddressAgroChaim } from "@/constants/contractRole";
import { useReadContract } from "wagmi";
// import { ethers } from "ethers";
import { useConfig, useSendUserOp, useSignature } from "@/hooks";
import { fetchIPFSData } from "@/helper/fetchIPFS";
import { UpdatePopOver } from "./UpdatePopOver";
import { truncateAddress } from "@/utils";
import { getWallet } from "@/utils/getWallet";
//0x83D6d013f11D3Ce9E2d36f20813864E861151A54
interface ProductDescription {
  description: string;
  external_link: string;
  image: string;
  name: string;
  properties: {
    category: string;
    unit: string;
  };
}

interface ProductData {
  url: string;
  price: number;
  quantity: number;
  seller: `0x${string}`;
  intermediary: `0x${string}`;
}
interface ProductId {
  id: string;
}

export function ProductCard({ id }: ProductId) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState("")
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>('');

  const [productDetails, setProductDetails] = useState<ProductDescription | null>(null);
  const { toast } = useToast();

  const config = useConfig();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const { AAaddress } = useSignature()


  const USDC = "0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74";

  const { data: agroProduct } = useReadContract({
    abi: AgroABi,
    address: contractAddressAgroChaim,
    functionName: "products",
    args: [id],
  })

  console.log(agroProduct, "Agrochain product");
  const wallet = getWallet(process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY);


  // const fetchProducts = async () => {
  //   try {
  //     const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  //     const productContract = new ethers.Contract(contractAddressAgroChaim, AgroABi, provider);

  //     const productLength = await productContract.productCount();
  //     console.log(productLength.toString(), "Product length");

  //     const productDataArray = [];
  //     for (let i = 0; i < productLength; i++) {
  //       const productData = await productContract.products(i);
  //       productDataArray.push(productData);
  //     }

  //     setProducts(productDataArray);

  //   } catch (error) {
  //     console.log(error, "Error fetching products");
  //   }
  // }

  const formatedData = useCallback(async () => {
    if (!agroProduct || !Array.isArray(agroProduct)) {
      console.error("agroProduct is empty or invalid:", agroProduct);
      return;
    }
    if (!agroProduct) {
      return;
    }
    setProducts({
      url: agroProduct[0],
      price: Number(agroProduct[1]),
      quantity: Number(agroProduct[2]),
      seller: agroProduct[3],
      intermediary: agroProduct[4],
    })
  }, [agroProduct])

  const fetchProjectDetails = useCallback(async () => {
    if (!products?.url) return;

    try {
      const data = await fetchIPFSData(products?.url);
      setProductDetails(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  }, [products?.url]);

  console.log(productDetails, "Product details");

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  useEffect(() => {
    formatedData();
  }, [formatedData]);
  // console.log(products?.[0]?.url, "Product url");

  console.log(products?.url, "Products");



  const handlePurchase = async () => {

    setIsLoading(true);
    try {
      // if (onPurchase) onPurchase();
      await execute({
        function: 'buyProduct',
        contractAddress: contractAddressAgroChaim,
        abi: AgroABi,
        params: [id, 1, USDC],
        value: 0,
      })

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

  const outOfStock = async () => {

    setIsLoading(true);
    try {
      // if (onPurchase) onPurchase();
      await execute({
        function: 'makeProductOutOfStock',
        contractAddress: contractAddressAgroChaim,
        abi: AgroABi,
        params: [id],
        value: 0,
      })

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

    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "There was an error processing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {productDetails?.image ? (
          <img
            // src={productDetails?.image} 
            src={"./image.png"}
            alt={productDetails?.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={products?.quantity != 0 ? "default" : "secondary"}
            className={products?.quantity != 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}>
            {products?.quantity != 0 ? "Available" : "Sold"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{productDetails?.name}</CardTitle>
          <span className="text-lg font-bold">${products?.price}</span>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span>by {truncateAddress(products?.seller || "") || "Unknown Farmer"}</span>
          {/* <UserRoleBadge role="farmer" className="text-xs" /> */}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {productDetails?.description || "No description provided."}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="bg-muted/50">
            {products?.quantity} {productDetails?.properties?.unit}
          </Badge>
          {/* {product.transactionHash && (
            <TransactionStatus 
              transactionHash={product.transactionHash} 
              status={product.status}
            />
          )} */}
        </div>
      </CardContent>

      <CardFooter>

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


        {products?.quantity != 0 && (
          <Badge variant="secondary" className="w-full flex justify-center py-1">
            Sold Out
          </Badge>
        )}

        {
          AAaddress === products?.seller && (
            <>
              <UpdatePopOver id={id} />

              <button onClick={outOfStock}>Stock Out</button>
            </>
          )
        }



      </CardFooter>
    </Card>
  );
}