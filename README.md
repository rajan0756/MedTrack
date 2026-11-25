# MedTrack — Blockchain-Based Medicine Tracking & Verification System

<p align="center">
  **Track. Trace. Verify.**
</p>

<p align="center">
  A blockchain-powered medicine supply-chain tracking system designed to improve transparency, traceability, and medicine authenticity verification.
</p>

---

## Overview

**MedTrack** is a decentralized medicine tracking and verification application that records the movement of pharmaceutical products across the supply chain.

From the manufacturer to the distributor, warehouse, and pharmacy, every major movement of a medicine batch is recorded through Ethereum smart-contract transactions. Each batch has a unique Batch ID and a QR code that allows users to access its verification details and supply-chain history.

By using blockchain technology, MedTrack provides a transparent and tamper-resistant record of medicine movement, helping improve accountability and making suspicious or counterfeit medicine reporting possible.

## The Problem

The pharmaceutical supply chain involves multiple participants and several stages of distribution. Traditional tracking systems can make it difficult to:

- Trace a medicine batch across different supply-chain participants.
- Verify the authenticity and expiry status of a medicine.
- Maintain a transparent record of medicine transfers.
- Identify unauthorized transfers or suspicious products.
- Access a complete history of a medicine batch.

## Our Solution

MedTrack uses blockchain technology and role-based access control to maintain a shared, verifiable record of medicine movement.

The application provides:

- **Blockchain-based tracking:** Medicine creation, transfers, and sales are recorded through smart contracts.
- **Role-based access control:** Each participant can perform only the operations permitted by their assigned role.
- **QR-based verification:** Each medicine batch receives a QR code linked to its verification page.
- **Supply-chain history:** Users can view recorded events, locations, timestamps, and participant addresses.
- **Medicine authenticity checks:** The application checks verification status and expiry information.
- **Counterfeit reporting:** Registered supply-chain participants can report suspicious medicine batches.

## Supply-Chain Workflow

```text
                 ADMIN
                   |
          Registers Participants
                   |
                   v
              MANUFACTURER
                   |
             Creates Medicine
              Batch + QR Code
                   |
                   v
              DISTRIBUTOR
                   |
             Receives Stock
                   |
             Dispatches Stock
                   |
                   v
               WAREHOUSE
                   |
             Receives Stock
                   |
             Dispatches Stock
                   |
                   v
                PHARMACY
                   |
             Receives Stock
                   |
              Sells Medicine
                   |
                   v
                 PATIENT

          QR-Based Verification
          & Supply-Chain History
```

## Key Features

### 1. Role-Based Access Control

MedTrack supports six participant roles:

| Role | Responsibilities |
|---|---|
| Admin | Register, manage, and revoke participant access |
| Manufacturer | Create medicine batches and dispatch them to distributors |
| Distributor | Receive medicine and dispatch it to warehouses |
| Warehouse | Receive medicine and dispatch it to pharmacies |
| Pharmacy | Receive medicine and record sales to patients |
| Public/User | Access medicine verification through the QR verification page |

Role permissions are enforced by the Solidity smart contract, not just by frontend navigation.

### 2. Medicine Batch Creation

Manufacturers can create a medicine batch by entering:

- Medicine Batch ID
- Medicine name
- Manufacturer name
- Expiry date
- Initial quantity

A unique QR code is generated for the batch, linking to its verification page.

### 3. Supply-Chain Tracking

Every transfer is recorded on the blockchain.

The tracking process includes:

- Manufacturer dispatch
- Distributor receipt and dispatch
- Warehouse receipt and dispatch
- Pharmacy receipt
- Sale to patient

Each history entry records relevant transaction details, including the action, participant addresses, timestamp, location, and notes.

### 4. QR-Based Medicine Verification

Users can scan a medicine's QR code or open its verification link to retrieve the batch information.

The verification functionality checks:

- Whether the medicine batch exists.
- Whether the batch is marked as verified.
- Whether the medicine has expired.
- The available medicine details and supply-chain history.

### 5. Counterfeit Reporting

Registered supply-chain participants can report a suspicious medicine batch. The smart contract updates its verification status and records the report in the batch history.

### 6. Pharmacy Sales Management

Pharmacies can record medicine sales to patients. Each sale updates the available quantity and adds a corresponding event to the supply-chain history.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, HTML, CSS, JavaScript |
| Blockchain | Ethereum-compatible blockchain |
| Smart Contracts | Solidity 0.8.19 |
| Development Environment | Hardhat |
| Blockchain Interaction | Ethers.js 5 |
| Wallet Integration | MetaMask |
| QR Code Generation | qrcode |
| QR Code Scanning | React QR Reader |
| Routing | React Router |
| Development Language | JavaScript, Solidity |

## Project Architecture

```text
                    MEDTRACK
                       |
          +------------+------------+
          |                         |
       FRONTEND                  BLOCKCHAIN
          |                         |
       React.js                Hardhat / EVM
          |                         |
       Ethers.js  <---------->  MedTrack.sol
          |                         |
       MetaMask                Smart Contract
          |                         |
          +------------+------------+
                       |
              Medicine Tracking
              & Verification
```

### Smart Contract

The main smart contract is located at:

`contracts/MedTrack.sol`

It handles:

- Participant registration and role management.
- Medicine batch creation.
- Medicine ownership and transfers.
- Supply-chain history.
- Medicine verification.
- Counterfeit reporting.
- Pharmacy sales and quantity updates.

## Getting Started

Follow these steps to run MedTrack locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/rajan0756/MedTrack.git
cd MedTrack
```

### 2. Install Backend Dependencies

From the project root:

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Start the Local Blockchain

Open a terminal in the project root:

```bash
npx hardhat node
```

This starts a local Hardhat development blockchain at:

```text
http://127.0.0.1:8545
```

The local network uses Chain ID:

```text
31337
```

Keep this terminal running while using the application.

### 5. Deploy the Smart Contract

Open another terminal in the project root:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The terminal will display the deployed contract address.

**Important:** Copy this address and update the contract address in:

```text
frontend/src/utils/blockchain.js
```

Make sure the frontend ABI corresponds to the deployed contract.

### 6. Configure MetaMask

Add a custom network in MetaMask:

| Setting | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Currency Symbol | ETH |

Import the development accounts provided by the Hardhat node into MetaMask for local testing.

The first account is the deployer and becomes the Admin.

**Security note:** Hardhat development accounts and their private keys are for local testing only. Never use them on a public network or with real funds.

### 7. Start the Frontend

Open another terminal:

```bash
cd frontend
npm start
```

The application will normally open at:

```text
http://localhost:3000
```

Connect MetaMask and begin using MedTrack.

---

## Demonstration Workflow

For a complete end-to-end demonstration:

1. Connect the Admin wallet.
2. Register Manufacturer, Distributor, Warehouse, and Pharmacy wallet addresses.
3. Switch to the Manufacturer wallet.
4. Create a medicine batch and generate its QR code.
5. Dispatch the batch to the registered Distributor.
6. Switch to the Distributor wallet, receive the batch, and dispatch it to the Warehouse.
7. Switch to the Warehouse wallet, receive the batch, and dispatch it to the Pharmacy.
8. Switch to the Pharmacy wallet, receive the batch, and record a medicine sale.
9. Scan or open the generated QR code to verify the medicine and inspect its supply-chain history.

**Note:** A local Hardhat blockchain is temporary. Restarting its node resets the local chain, including deployed contracts, participant registrations, medicine batches, and transaction history. The contract must be redeployed and the demo data registered again.

## Project Structure

```text
MedTrack/
│
├── contracts/
│   └── MedTrack.sol
│
├── scripts/
│   └── deploy.js
│
├── frontend/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       │   ├── AdminPanel.js
│       │   ├── CreateBatch.js
│       │   ├── DistributorPanel.js
│       │   ├── ManufacturerPanel.js
│       │   ├── WarehousePanel.js
│       │   ├── PharmacyPanel.js
│       │   └── QRScanner.js
│       │
│       ├── utils/
│       │   └── blockchain.js
│       │
│       └── App.js
│
├── hardhat.config.js
├── package.json
└── README.md
```

## Security and Limitations

- Smart-contract role checks restrict unauthorized supply-chain operations.
- The project currently uses a local Hardhat development blockchain for demonstration.
- Local blockchain data is not persistent across node restarts.
- Wallet addresses and transaction information are recorded on-chain and should not be treated as private.
- The project demonstrates medicine traceability; it does not independently establish the physical authenticity or quality of a medicine.
- Production deployment would require additional security auditing, operational controls, and integration with verified pharmaceutical data sources.

## Future Enhancements

Potential improvements include:

- Deployment to a production-ready blockchain network.
- Integration with verified manufacturer and pharmaceutical databases.
- Improved counterfeit detection and reporting workflows.
- Advanced analytics and supply-chain monitoring dashboards.
- Automated alerts for expired or suspicious medicine batches.
- Stronger identity verification for supply-chain participants.
- Automated smart-contract testing and security audits.

## Learning Outcomes

This project provided practical experience with:

- Solidity smart-contract development.
- Blockchain architecture and transaction workflows.
- Role-based access control.
- React frontend development.
- Ethers.js and MetaMask integration.
- QR code generation and scanning.
- Smart-contract deployment using Hardhat.
- Full-stack application integration.

## Contributors

**Rajan Rana**

MCA Student — Jawaharlal Nehru University (JNU)

GitHub: [@rajan0756](https://github.com/rajan0756)

## Repository

[https://github.com/rajan0756/MedTrack](https://github.com/rajan0756/MedTrack)

---

<p align="center">
  **MedTrack — Bringing Transparency and Traceability to the Medicine Supply Chain.**
</p>
