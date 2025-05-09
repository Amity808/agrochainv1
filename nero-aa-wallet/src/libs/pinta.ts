const VITE_PINATA_JWT = import.meta.env.VITE_PINATA_JWT!;

if (!VITE_PINATA_JWT) {
  throw new Error("VITE_PINATA_JWT is not defined in the environment variables.");
}

export async function pinFileWithPinata(file: File) {
  const data = new FormData();
  data.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VITE_PINATA_JWT}`,
    },
    body: data,
  });

  const result = (await res.json()) as { IpfsHash: string };

  return `ipfs://${result.IpfsHash}`;
}

export async function pinJsonWithPinata(json: object) {
  const data = JSON.stringify({
    pinataContent: json,
    pinataMetadata: {
      name: "metadata.json",
    },
  });

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VITE_PINATA_JWT}`,
    },
    body: data,
  });

  const result = (await res.json()) as { IpfsHash: string };

  return `ipfs://${result.IpfsHash}`;
}