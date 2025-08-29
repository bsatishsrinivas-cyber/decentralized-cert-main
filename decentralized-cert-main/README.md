# Decentralized certificate verifier

# 🏆 CertifyChain - Decentralized Certificate Verification System

> **Revolutionizing certificate verification through blockchain technology and advanced security protocols**

![CertifyChain Logo](https://img.shields.io/badge/CertifyChain-Blockchain%20Certificates-brightgreen)
![Stacks Blockchain](https://img.shields.io/badge/Blockchain-Stacks-orange)
![Next.js](https://img.shields.io/badge/Framework-Next.js-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## 🎯 Vision

CertifyChain envisions a world where certificate verification is **transparent, secure, and immutable**. We're building the future of credential management by leveraging blockchain technology to eliminate fraud, reduce verification costs, and provide instant authenticity validation.

### 🌟 Mission
- **Eliminate Certificate Fraud**: Prevent forgery through blockchain immutability
- **Instant Verification**: Real-time certificate authenticity checks
- **Decentralized Trust**: Remove dependency on centralized authorities
- **Global Accessibility**: Enable borderless certificate verification

## ✨ Features

### 🔐 Advanced Security
- **5-Layer Verification System**: File integrity, metadata validation, blockchain verification, digital signatures, timestamp validation
- **Malware Detection**: Automatic detection of suspicious file types
- **Tamper Prevention**: Cryptographic verification of certificate authenticity
- **Real-time Blockchain Validation**: Instant verification against Stacks blockchain

### 📁 Certificate Management
- **File Upload Support**: PDF, JPEG, PNG with size validation (up to 5MB)
- **Metadata Management**: Comprehensive certificate information tracking
- **Batch Processing**: Handle multiple certificates efficiently
- **Search & Filter**: Advanced certificate discovery capabilities

### 🏦 Wallet Integration
- **Leather Wallet Support**: Native Stacks wallet integration
- **Multi-Network Support**: Mainnet and testnet compatibility
- **Secure Connection**: Encrypted wallet communication
- **Transaction Management**: Direct blockchain interactions

### 🎨 User Experience
- **Modern UI/UX**: Fluorescent green theme with responsive design
- **Interactive Elements**: Hover effects and smooth animations
- **Progressive Disclosure**: Information revealed on-demand
- **Mobile Responsive**: Optimized for all device sizes

### 🔍 Verification System
- **Authenticity Scoring**: Percentage-based verification results
- **Detailed Breakdown**: Individual check results with explanations
- **Status Tracking**: Real-time verification status updates
- **Blockchain Records**: Immutable verification history

## 🏗️ Technical Architecture

### Frontend Stack
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │    │   TypeScript    │    │   Tailwind CSS  │
│   (React 18)    │    │   (Type Safe)   │    │   (Styling)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Radix UI      │
                    │   (Components)  │
                    └─────────────────┘
```

### Backend & Blockchain
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Stacks.js     │    │   Clarity       │    │   Hiro API      │
│   (SDK)         │    │   (Smart       │    │   (Blockchain   │
│                 │    │    Contract)   │    │    Data)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Leather       │
                    │   Wallet        │
                    └─────────────────┘
```

### Security Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│ 1. File Integrity Check    │ 2. Metadata Validation        │
│    • File type validation  │    • Required fields check    │
│    • Size validation       │    • Date validation          │
│    • Malware detection     │    • Recipient validation     │
├─────────────────────────────────────────────────────────────┤
│ 3. Blockchain Verification │ 4. Digital Signature          │
│    • On-chain record       │    • Cryptographic validation │
│    • Transaction history   │    • Algorithm verification   │
├─────────────────────────────────────────────────────────────┤
│ 5. Timestamp Validation    │ Overall Score Calculation     │
│    • Issue date logic      │    • Percentage-based result  │
│    • Upload sequence       │    • Status determination     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
decentralized-cert-main/
├── 📁 app/                          # Next.js app directory
│   ├── 📄 page.tsx                  # Main application page
│   ├── 📄 layout.tsx                # Root layout component
│   └── 📄 globals.css               # Global styles
├── 📁 components/                   # React components
│   ├── 📄 enhanced-wallet-connect.tsx    # Wallet connection
│   ├── 📄 certificate-details-modal.tsx  # Certificate modal
│   └── 📁 ui/                       # UI components
├── 📁 contracts/                    # Smart contracts
│   ├── 📄 certifychain.clar         # Main contract
│   ├── 📄 deploy-final.ts           # Deployment script
│   └── 📄 deploy.config.ts          # Deployment config
├── 📁 lib/                          # Utility libraries
│   ├── 📄 wallet.ts                 # Wallet utilities
│   ├── 📄 wallet-context.tsx        # Wallet context
│   └── 📄 contract-service.ts       # Contract service
├── 📁 public/                       # Static assets
├── 📄 package.json                  # Dependencies
└── 📄 README.md                     # Documentation
```

## 🔗 Smart Contract

### Contract Address
```
Mainnet: ST1PQHQKV0RJXZFYVDGX8X8H8G9ZGP0K8G3ZQJQJQ.certifychain
Testnet: ST000000000000000000002AMW42H.testnet-certifychain
```

### Key Functions
- `issue-certificate`: Create new certificates
- `verify-certificate`: Verify certificate authenticity
- `authorize-issuer`: Grant issuer permissions
- `revoke-issuer`: Remove issuer permissions
- `get-certificate`: Retrieve certificate data

### Contract Features
- **Immutable Records**: All certificates stored on blockchain
- **Access Control**: Authorized issuer management
- **Event Logging**: Comprehensive audit trail
- **Cost Management**: STX-based certificate issuance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Leather Wallet extension

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/decentralized-cert-main.git
cd decentralized-cert-main

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
```bash
# Create .env.local file
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST000000000000000000002AMW42H.testnet-certifychain
```

## 📸 Screenshots

### Main Dashboard
![Dashboard](https://via.placeholder.com/800x400/00ff00/ffffff?text=CertifyChain+Dashboard)

### Certificate Upload
![Upload](https://via.placeholder.com/800x400/00ff00/ffffff?text=Certificate+Upload+Form)

### Verification Results
![Verification](https://via.placeholder.com/800x400/00ff00/ffffff?text=Verification+Results)

### Wallet Connection
![Wallet](https://via.placeholder.com/800x400/00ff00/ffffff?text=Leather+Wallet+Integration)

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Smart Contract Deployment
```bash
# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stacks Foundation** for blockchain infrastructure
- **Leather Wallet** for wallet integration
- **Next.js Team** for the amazing framework
- **Open Source Community** for inspiration and support

---

**Built with ❤️ for the decentralized future**

DEMO VIDEO:
https://drive.google.com/file/d/15wxfVbUKM6Wfz0ZKJ6NUZQ_s4yF5Kdhw/view?usp=drive_link
