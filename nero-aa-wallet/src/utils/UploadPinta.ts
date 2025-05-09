import { pinFileWithPinata, pinJsonWithPinata } from "@/libs/pinta";


export async function makeContractMetadata({
    imageFile,
    name,
    description,
    unit
  }: {
    imageFile: File;
    name: string;
    description?: string;
    unit?: string;
  }) {
    // upload image to Pinata
    const imageFileIpfsUrl = await pinFileWithPinata(imageFile);
   
    // build contract metadata json
    const metadataJson = {
      description,
      image: imageFileIpfsUrl,
      name,
      unit,
      external_link: "https://agrochain",
      "properties": {
        "category": "payament"
      },
    };
   
    // upload token metadata json to Pinata and get ipfs uri
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }
