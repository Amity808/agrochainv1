export declare function makeContractMetadata({ imageFile, name, description, }: {
    imageFile: File;
    name: string;
    description?: string;
}): Promise<string>;
export declare function makeRemitanceContractMetadata({ name, emailAddress, }: {
    name: string;
    emailAddress?: string;
}): Promise<string>;
