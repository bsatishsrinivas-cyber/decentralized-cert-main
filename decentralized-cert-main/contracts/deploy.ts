import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { 
  makeContractDeploy, 
  makeContractCall,
  broadcastTransaction, 
  getNonce,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  someCV,
  noneCV
} from '@stacks/transactions';
import { 
  getAddressFromPrivateKey,
  getPublicKeyFromPrivateKey 
} from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const NETWORK = process.env.NODE_ENV === 'production' ? new StacksMainnet() : new StacksTestnet();
const CONTRACT_NAME = 'certifychain';
const CONTRACT_PATH = './contracts/certifychain.clar';

// Your private key (replace with your actual private key)
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY || 'ST1R35EDTA2K4V7SR2VBPC1Y3BFJ3SAKYZQNYXHK1';

export async function deployContract() {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY, NETWORK.version);
    const publicKey = getPublicKeyFromPrivateKey(PRIVATE_KEY);
    
    console.log('Deploying CertifyChain contract...');
    console.log('Address:', address);
    console.log('Network:', NETWORK.version);
    
    // Get nonce
    const nonce = await getNonce(address, NETWORK);
    
    // Read contract source
    const contractSource = await Bun.file(CONTRACT_PATH).text();
    
    // Create deployment transaction
    const transaction = await makeContractDeploy({
      contractName: CONTRACT_NAME,
      codeBody: contractSource,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      nonce: nonce,
      fee: 10000,
    });
    
    // Broadcast transaction
    const result = await broadcastTransaction(transaction, NETWORK);
    
    if (result.error) {
      throw new Error(`Deployment failed: ${result.error}`);
    }
    
    console.log('Contract deployed successfully!');
    console.log('Transaction ID:', result.txid);
    console.log('Contract Address:', `${address}.${CONTRACT_NAME}`);
    
    return {
      txid: result.txid,
      contractAddress: `${address}.${CONTRACT_NAME}`,
      address: address
    };
    
  } catch (error) {
    console.error('Deployment error:', error);
    throw error;
  }
}

export async function initializeContract(contractAddress: string) {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY, NETWORK.version);
    const nonce = await getNonce(address, NETWORK);
    
    console.log('Initializing contract...');
    
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
    
    if (result.error) {
      throw new Error(`Initialization failed: ${result.error}`);
    }
    
    console.log('Contract initialized successfully!');
    console.log('Transaction ID:', result.txid);
    
    return result.txid;
    
  } catch (error) {
    console.error('Initialization error:', error);
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
    const address = getAddressFromPrivateKey(PRIVATE_KEY, NETWORK.version);
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
    
    if (result.error) {
      throw new Error(`Certificate issuance failed: ${result.error}`);
    }
    
    console.log('Certificate issued successfully!');
    console.log('Transaction ID:', result.txid);
    
    return result.txid;
    
  } catch (error) {
    console.error('Certificate issuance error:', error);
    throw error;
  }
}

export async function verifyCertificate(
  contractAddress: string,
  certificateId: number
) {
  try {
    const address = getAddressFromPrivateKey(PRIVATE_KEY, NETWORK.version);
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
    
    if (result.error) {
      throw new Error(`Certificate verification failed: ${result.error}`);
    }
    
    console.log('Certificate verified successfully!');
    console.log('Transaction ID:', result.txid);
    
    return result.txid;
    
  } catch (error) {
    console.error('Certificate verification error:', error);
    throw error;
  }
}

// Main deployment function
if (require.main === module) {
  deployContract()
    .then(async (deployment) => {
      console.log('Waiting for deployment to confirm...');
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      
      console.log('Initializing contract...');
      await initializeContract(deployment.contractAddress);
      
      console.log('Deployment complete!');
      console.log('Contract ready for use at:', deployment.contractAddress);
    })
    .catch(console.error);
}
