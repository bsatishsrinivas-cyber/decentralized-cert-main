# CertifyChain Smart Contract

A decentralized certificate verification system built on Stacks blockchain.

## 📋 Overview

The CertifyChain smart contract enables:
- ✅ **Certificate Issuance**: Authorized issuers can create digital certificates
- ✅ **Certificate Verification**: Anyone can verify certificate authenticity
- ✅ **Certificate Management**: Update, revoke, and manage certificates
- ✅ **Issuer Authorization**: Control who can issue certificates
- ✅ **Event Tracking**: All actions are recorded as blockchain events

## 🏗️ Smart Contract Features

### Core Functions

#### Read-Only Functions
- `get-certificate` - Retrieve certificate by ID
- `get-certificate-count` - Get total number of certificates
- `is-authorized-issuer` - Check if address is authorized issuer
- `get-contract-stats` - Get contract statistics

#### Write Functions
- `initialize` - Initialize the contract
- `authorize-issuer` - Authorize an issuer (contract owner only)
- `revoke-issuer` - Revoke issuer authorization (contract owner only)
- `issue-certificate` - Issue a new certificate
- `verify-certificate` - Verify a certificate
- `revoke-certificate` - Revoke a certificate
- `update-certificate` - Update certificate details
- `emergency-pause` - Emergency pause (contract owner only)

### Events
- `certificate-issued` - Emitted when certificate is issued
- `certificate-verified` - Emitted when certificate is verified
- `issuer-authorized` - Emitted when issuer is authorized

## 🚀 Deployment

### Prerequisites
1. **Stacks Wallet**: Install Leather wallet from [leather.io](https://leather.io)
2. **STX Tokens**: Have STX tokens for deployment fees
3. **Private Key**: Your wallet's private key for deployment

### Environment Setup

1. **Set Environment Variables**:
```bash
export STACKS_PRIVATE_KEY="your-private-key-here"
export NODE_ENV="development"  # or "production" for mainnet
```

2. **Install Dependencies**:
```bash
npm install
```

### Deploy to Testnet

```bash
npm run deploy:testnet
```

### Deploy to Mainnet

```bash
npm run deploy:mainnet
```

### Manual Deployment

```bash
# Using the deployment script
tsx contracts/deploy.ts

# Or using Clarinet (if you have it installed)
clarinet contract deploy certifychain
```

## 📝 Contract Configuration

### Update Configuration

Edit `contracts/deploy.config.ts`:

```typescript
export const DEPLOY_CONFIG: DeployConfig = {
  network: 'testnet', // Change to 'mainnet' for production
  contractName: 'certifychain',
  contractPath: './contracts/certifychain.clar',
  deployerAddress: 'YOUR_STACKS_ADDRESS', // Replace with your address
  fee: 10000,
};
```

### Network Configuration

```typescript
export const NETWORK_CONFIG = {
  testnet: {
    apiUrl: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
    network: 'testnet',
  },
  mainnet: {
    apiUrl: 'https://api.mainnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
    network: 'mainnet',
  },
};
```

## 🔧 Usage

### Frontend Integration

```typescript
import { createCertifyChainService } from '@/lib/contract-service';

// Create service instance
const contractService = createCertifyChainService(
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifychain',
  false // false for testnet, true for mainnet
);

// Get certificate
const certificate = await contractService.getCertificate(1);

// Get certificate count
const count = await contractService.getCertificateCount();

// Check if address is authorized issuer
const isAuthorized = await contractService.isAuthorizedIssuer('ST1...');

// Get contract statistics
const stats = await contractService.getContractStats();
```

### Wallet Integration

The contract integrates with Leather wallet for transactions:

```typescript
// Issue certificate (requires wallet connection)
const txId = await contractService.issueCertificate(
  'ST1RECIPIENT...',
  'Blockchain Developer',
  'Certified blockchain developer',
  1234567890 // expiry date (optional)
);

// Verify certificate
const verificationId = await contractService.verifyCertificate(1);

// Revoke certificate
const revocationId = await contractService.revokeCertificate(1);
```

## 📊 Contract Structure

### Certificate Data Structure

```clarity
{
  issuer: principal,
  recipient: principal,
  title: (string-ascii 100),
  description: (string-ascii 500),
  issue-date: uint,
  expiry-date: (optional uint),
  status: (string-ascii 20),
  block-hash: (buff 32),
  transaction-id: (buff 32)
}
```

### Error Codes

- `ERR_NOT_AUTHORIZED (1001)` - Unauthorized action
- `ERR_INVALID_CERTIFICATE (1002)` - Invalid certificate data
- `ERR_CERTIFICATE_NOT_FOUND (1003)` - Certificate not found
- `ERR_INVALID_AMOUNT (1004)` - Invalid amount
- `ERR_CERTIFICATE_EXPIRED (1005)` - Certificate expired
- `ERR_ALREADY_VERIFIED (1006)` - Already verified

## 🔍 Testing

### Test the Contract

1. **Deploy to testnet**
2. **Initialize the contract**
3. **Authorize an issuer**
4. **Issue a certificate**
5. **Verify the certificate**

### Example Test Flow

```bash
# 1. Deploy contract
npm run deploy:testnet

# 2. Initialize (this happens automatically after deployment)

# 3. Test certificate issuance
# Use the frontend or call contract functions directly

# 4. Verify on explorer
# Check https://explorer.hiro.so for your transactions
```

## 🌐 Explorer Integration

After deployment, view your contract on:
- **Testnet**: https://explorer.hiro.so/address/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifychain
- **Mainnet**: https://explorer.hiro.so/address/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifychain

## 🔒 Security Considerations

1. **Private Key Security**: Never commit private keys to version control
2. **Access Control**: Only authorized issuers can create certificates
3. **Input Validation**: All inputs are validated on-chain
4. **Emergency Controls**: Contract owner can pause operations
5. **Audit Trail**: All actions are recorded as blockchain events

## 📈 Gas Optimization

- Certificate issuance: ~10,000 microSTX
- Certificate verification: ~5,000 microSTX
- Certificate revocation: ~5,000 microSTX
- Certificate update: ~10,000 microSTX

## 🛠️ Development

### Local Development

1. **Install Clarinet** (optional):
```bash
curl -L https://raw.githubusercontent.com/hirosystems/clarinet/master/install.sh | bash
```

2. **Run local node**:
```bash
clarinet dev
```

3. **Test contract**:
```bash
clarinet test
```

### Contract Verification

The contract follows Stacks best practices:
- ✅ Input validation
- ✅ Access control
- ✅ Error handling
- ✅ Event emission
- ✅ Gas optimization

## 📞 Support

For issues or questions:
1. Check the [Stacks documentation](https://docs.stacks.co/)
2. Review [Clarity language guide](https://docs.stacks.co/write-smart-contracts/overview)
3. Join the [Stacks Discord](https://discord.gg/stacks)

## 📄 License

This project is licensed under the MIT License.
