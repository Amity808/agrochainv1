import { pinFileWithPinata, pinJsonWithPinata } from "@/libs/pinta";


export async function makeContractMetadata({
    imageFile,
    name,
    description,
  }: {
    imageFile: File;
    name: string;
    description?: string;
  }) {
    // upload image to Pinata
    const imageFileIpfsUrl = await pinFileWithPinata(imageFile);
   
    // build contract metadata json
    const metadataJson = {
      description,
      image: imageFileIpfsUrl,
      name,
      external_link: "https://paygramchain.com",
      "properties": {
        "category": "payament"
      },
    };
   
    // upload token metadata json to Pinata and get ipfs uri
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }

  export async function makeRemitanceContractMetadata({
    name,
    emailAddress,
  }: {
    
    name: string;
    emailAddress?: string;
  }) {
    // upload image to Pinata
   
    // build contract metadata json
    const metadataJson = {
      emailAddress,
      name,
      external_link: "https://paygramchain.com",
      "properties": {
        "category": "remitance"
      },
    };
   
    // upload token metadata json to Pinata and get ipfs uri
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }