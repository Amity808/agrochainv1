import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSendUserOp, useSignature } from "@/hooks";
import { useToast } from "../hooks/use-toast";
import AgroABi from "@/constants/agrochain.json";
import { contractAddressAgroChaim } from "@/constants/contractRole";
interface ProductIds {
    id: string;
}

export function UpdatePopOver({id }: ProductIds) {
    const [quantity, setQuantity] = useState("")
    const [txStatus, setTxStatus] = useState('');
    const [isPolling, setIsPolling] = useState(false);
    const [userOpHash, setUserOpHash] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState(false);


    const { execute, waitForUserOpResult } = useSendUserOp();
//   const { AAaddress } = useSignature()
  const { toast } = useToast();


  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // if (onPurchase) onPurchase();
      await execute({
        function: 'updateProductQuantity',
        contractAddress: contractAddressAgroChaim,
        abi: AgroABi,
        params: [id, quantity],
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
        title: "Product Update failed",
        description: "There was an error updating your product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">Update Product</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            {/* <h4 className="font-medium leading-none">Update Product quality</h4> */}
            <p className="text-sm text-muted-foreground">
            Update Product Quality
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Quantity</Label>
              <Input
                id="text"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
