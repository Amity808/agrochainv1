import { ethers } from 'ethers';

// Replace with the correct ABI for the error
const abi = ["error InvalidQuantity(uint256, uint256)"];

const iface = new ethers.utils.Interface(abi);
const decoded = iface.decodeErrorResult("InvalidQuantity", "0xe66c48da7c6181838a71a779e445600d4c6ecbe16bacf2b3c5bda69c29fada66d1b645d1");
console.log(decoded); // This will give you the decoded error data