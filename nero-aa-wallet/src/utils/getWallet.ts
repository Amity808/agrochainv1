import { ethers } from "ethers";

export const getWallet = (privateKey?: string) => {

    const localRpcUrl = "https://rpc-testnet.nerochain.io"; 
    const provider = new ethers.providers.JsonRpcProvider(localRpcUrl);

    const signURL = import.meta.env.VITE_SIGN_URL;
    // Initialize wallet
    const wallet = new ethers.Wallet(
        privateKey ?? signURL!,
        provider,
    );

    return wallet;
};