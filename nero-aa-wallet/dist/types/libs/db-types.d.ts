export type Schema = {
    users: {
        id: string;
        name: string;
        email: string;
        role?: string | null;
        walletAddress?: string | null;
        createdAt?: number;
    };
    products: {
        id?: number;
        name: string;
        description?: string | null;
        price: number;
        quantity: number;
        unit: string;
        imageUrl?: string | null;
        farmerId: string;
        status?: string;
        transactionHash?: string | null;
        createdAt?: number;
    };
    transactions: {
        id?: number;
        productId: number;
        sellerId: string;
        buyerId: string;
        quantity: number;
        totalPrice: number;
        status?: string;
        transactionHash?: string | null;
        createdAt?: number;
    };
};
