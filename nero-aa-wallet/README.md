# AgroChain Frontend (NERO Wallet)

This is the frontend dApp for **AgroChain**—a blockchain-powered agricultural marketplace. AgroChain connects farmers, consumers, and manufacturers, enabling transparent, secure, and efficient trading of agricultural products using smart contracts on the blockchain.

---

## 🌾 What is AgroChain?

AgroChain is a decentralized platform that leverages blockchain technology to:

- Empower **farmers** to list and sell products directly.
- Allow **consumers** and **manufacturers** to purchase products with full transparency.
- Use **escrow** and **reviews** to ensure trust and quality.
- Support multiple ERC20 tokens for payments.

The core logic is implemented in the `AgroChain.sol` smart contract, which manages roles, products, orders, and reviews.

---

## 🔑 Smart Contract Features

- **Role Management:** Admins can grant/revoke Farmer, Consumer, Manufacturer, and Intermediary roles.
- **Product Listing:** Farmers can add products with price, quantity, and metadata (IPFS URL).
- **Order Placement:** Buyers purchase products using supported ERC20 tokens. Orders are tracked with statuses (Pending, Shipped, Delivered, Completed, Disputed).
- **Escrow:** Payments are held in escrow and released to the seller upon delivery.
- **Reviews:** Buyers can leave reviews after order completion.
- **Admin Controls:** Set supported tokens, manage roles, and update product info.

---

## 🖥️ Frontend Features

- **Role Management:** Claim roles (Farmer, Consumer, Manufacturer) via the UI.
- **Product Marketplace:** View, purchase, and manage agricultural products.
- **Wallet Integration:** Connect with account abstraction, RainbowKit, Wagmi, and Web3Auth (social login).
- **Multi-Token Support:** Buy products with ERC20 tokens.
- **Modern UI:** Built with React, TailwindCSS, and Radix UI.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v22.4.1`
- **Yarn**: `v3.8.3`

### Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```
2. **Start the development server:**
   ```bash
   yarn dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 📦 Project Structure

- `src/components/` – UI components (dashboard, product cards, wallet connect, etc.)
- `src/hooks/` – Custom React hooks for wallet, tokens, NFTs, and more.
- `src/contexts/` – React context providers for app-wide state (wallet, tokens, transactions, etc.)
- `src/page/` – Main app pages (Home, Profile, Add Product, Claim Role, etc.)
- `src/config/` – Configuration for chains, connectors, and providers.
- `src/abis/` – Contract ABIs for interacting with ERC20, ERC721, and AgroChain contracts.

---

## 📚 Documentation & Links

- [Smart Contract: AgroChain.sol](../contract/src/AgroChain.sol)
- [Official Documentation](https://docs.nerochain.io/en)
- [Demo App](https://app.testnet.nerochain.io/)
- [Nero Discord](https://discord.gg/nerochainofficial)

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 🤝 Contributing & Support

For technical questions or to contribute, join the `dev-hub` channel in our [Discord](https://discord.gg/nerochainofficial).

---

**AgroChain: Powering the future of agriculture with blockchain.**
