import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { 
  makeContractDeploy, 
  makeContractCall,
  broadcastTransaction, 
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  someCV,
  noneCV
} from '@stacks/transactions';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const NETWORK = process.env.NODE_ENV === 'production' ? STACKS_MAINNET : STACKS_TESTNET;
const CONTRACT_NAME = 'certifychain';
const CONTRACT_PATH = path.join(__dirname, 'certifychain.clar');

// Your private key (replace with your actual private key)
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY || 'your-private-key-here';

// Helper function to get address from private key
function getAddressFromPrivateKey(privateKey: string): string {
  // This is a simplified version - in production you'd use proper key derivation
  // For now, we'll use a placeholder address
  return 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
}

// Helper function to get nonce
async function getNonce(address: string, network: any): Promise<number> {
  try {
    const apiUrl = network.getCoreApiUrl();
    const response = await fetch(`${apiUrl}/extended/v1/address/${address}/nonces`);
    const data = await response.json();
    return data.last_executed_tx_nonce || 0;
  } catch (error) {
    console.log('Error getting nonce, using 0:', error);
    return 0;
  }
}

export async function deployContract() {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY);
    
    console.log('🚀 Deploying CertifyChain contract...');
    console.log('Address:', address);
    console.log('Network:', NETWORK.getCoreApiUrl().includes('mainnet') ? 'mainnet' : 'testnet');
    console.log('Contract Path:', CONTRACT_PATH);
    
    // Check if contract file exists
    if (!fs.existsSync(CONTRACT_PATH)) {
      throw new Error(`Contract file not found at: ${CONTRACT_PATH}`);
    }
    
    // Read contract source
    const contractSource = fs.readFileSync(CONTRACT_PATH, 'utf8');
    console.log('✅ Contract source loaded, length:', contractSource.length);
    
    // Get nonce
    const nonce = await getNonce(address, NETWORK);
    console.log('Current nonce:', nonce);
    
    // Create deployment transaction
    const transaction = await makeContractDeploy({
      contractName: CONTRACT_NAME,
      codeBody: contractSource,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      nonce: nonce,
      fee: 10000,
    });
    
    console.log('📝 Transaction created, broadcasting...');
    
    // Broadcast transaction
    const result = await broadcastTransaction(transaction, NETWORK);
    
    console.log('📡 Broadcast result:', result);
    
    if ('error' in result) {
      throw new Error(`Deployment failed: ${result.error}`);
    }
    
    console.log('✅ Contract deployed successfully!');
    console.log('Transaction ID:', result.txid);
    console.log('Contract Address:', `${address}.${CONTRACT_NAME}`);
    
    return {
      txid: result.txid,
      contractAddress: `${address}.${CONTRACT_NAME}`,
      address: address
    };
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
    throw error;
  }
}

export async function initializeContract(contractAddress: string) {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY);
    const nonce = await getNonce(address, NETWORK);
    
    console.log('🔧 Initializing contract...');
    
    const transaction = await makeContractCall({
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      functionName: 'initialize',
      functionArgs: [],
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      nonce: nonce,
      fee: 5000,
    });
    
    const result = await broadcastTransaction(transaction, NETWORK);
    
    if ('error' in result) {
      throw new Error(`Initialization failed: ${result.error}`);
    }
    
    console.log('✅ Contract initialized successfully!');
    console.log('Transaction ID:', result.txid);
    
    return result.txid;
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
    throw error;
  }
}

// Example usage functions
export async function issueCertificate(
  contractAddress: string,
  recipient: string,
  title: string,
  description: string,
  expiryDate?: number
) {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY);
    const nonce = await getNonce(address, NETWORK);
    
    const functionArgs = [
      standardPrincipalCV(recipient),
      stringAsciiCV(title),
      stringAsciiCV(description),
      expiryDate ? someCV(uintCV(expiryDate)) : noneCV()
    ];
    
    const transaction = await makeContractCall({
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      functionName: 'issue-certificate',
      functionArgs: functionArgs,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      nonce: nonce,
      fee: 10000,
    });
    
    const result = await broadcastTransaction(transaction, NETWORK);
    
    if ('error' in result) {
      throw new Error(`Certificate issuance failed: ${result.error}`);
    }
    
    console.log('✅ Certificate issued successfully!');
    console.log('Transaction ID:', result.txid);
    
    return result.txid;
    
  } catch (error) {
    console.error('❌ Certificate issuance error:', error);
    throw error;
  }
}

export async function verifyCertificate(
  contractAddress: string,
  certificateId: number
) {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY);
    const nonce = await getNonce(address, NETWORK);
    
    const functionArgs = [uintCV(certificateId)];
    
    const transaction = await makeContractCall({
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      functionName: 'verify-certificate',
      functionArgs: functionArgs,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      nonce: nonce,
      fee: 5000,
    });
    
    const result = await broadcastTransaction(transaction, NETWORK);
    
    if ('error' in result) {
      throw new Error(`Certificate verification failed: ${result.error}`);
    }
    
    console.log('✅ Certificate verified successfully!');
    console.log('Transaction ID:', result.txid);
    
    return result.txid;
    
  } catch (error) {
    console.error('❌ Certificate verification error:', error);
    throw error;
  }
}

// Main deployment function
if (require.main === module) {
  console.log('🎯 CertifyChain Smart Contract Deployment');
  console.log('==========================================\n');
  
  deployContract()
    .then(async (deployment) => {
      console.log('⏳ Waiting for deployment to confirm...');
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      
      console.log('🔧 Initializing contract...');
      await initializeContract(deployment.contractAddress);
      
      console.log('🎉 Deployment complete!');
      console.log('Contract ready for use at:', deployment.contractAddress);
    })
    .catch((error) => {
      console.error('❌ Deployment failed:', error);
      process.exit(1);
    });
}
