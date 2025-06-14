import { useReadContract } from "wagmi"
import AgroABi from "@/constants/agrochain.json";
import { CONTRACT_ROLE, contractAddressAgroChaim } from "@/constants/contractRole";

export const useRoles = (address: string) => {

    const { data: isFarmerRole, isLoading: isFarmerLoading, error: farmerError } = useReadContract({
        address: contractAddressAgroChaim,
        abi: AgroABi,
        functionName: 'accountRoles',
        args: [CONTRACT_ROLE.FARMER_ROLE, address],
    })
    const { data: isConsumerRole, isLoading: isConsumerLoading, error: consumerError } = useReadContract({
        address: contractAddressAgroChaim,
        abi: AgroABi,
        functionName: 'accountRoles',
        args: [CONTRACT_ROLE.CONSUMER_ROLE, address],
    });
    const { data: isManufactureRole, isLoading: isManufactureLoading, error: manufactureError } = useReadContract({
        address: contractAddressAgroChaim,
        abi: AgroABi,
        functionName: 'accountRoles',
        args: [CONTRACT_ROLE.MANUFACTURE_ROLE, address],
    });

    

    return {isFarmerRole, isConsumerRole, isConsumerLoading, consumerError, isManufactureLoading, isManufactureRole}
} 