import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface TransactionStatusProps {
  transactionHash?: string | null;
  status?: string;
}

export function TransactionStatus({ transactionHash, status }: TransactionStatusProps) {
  const [confirmations, setConfirmations] = useState(0);
  
  useEffect(() => {
    if (!transactionHash) return;
    
    // Simulate blockchain confirmations
    const interval = setInterval(() => {
      setConfirmations(prev => {
        const newValue = prev + 1;
        if (newValue >= 6) clearInterval(interval);
        return newValue;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [transactionHash]);
  
  if (!transactionHash) {
    return null;
  }
  
  let icon = <Clock className="h-3 w-3" />;
  let color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  let label = "Pending";
  
  if (confirmations >= 6 || status === "completed") {
    icon = <CheckCircle className="h-3 w-3" />;
    color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    label = "Confirmed";
  } else if (status === "cancelled") {
    icon = <AlertCircle className="h-3 w-3" />;
    color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    label = "Failed";
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`flex items-center gap-1 ${color}`}>
            {icon}
            <span>{label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Transaction: {transactionHash.substring(0, 6)}...{transactionHash.substring(transactionHash.length - 4)}</p>
          {confirmations < 6 && status !== "cancelled" && (
            <p>Confirmations: {confirmations}/6</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}