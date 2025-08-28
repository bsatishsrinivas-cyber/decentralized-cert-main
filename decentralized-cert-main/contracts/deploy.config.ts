export interface DeployConfig {
  network: 'testnet' | 'mainnet';
  contractName: string;
  contractPath: string;
  deployerAddress: string;
  fee: number;
  nonce?: number;
}

export const DEPLOY_CONFIG: DeployConfig = {
  network: 'testnet', // Change to 'mainnet' for production
  contractName: 'certifychain',
  contractPath: './contracts/certifychain.clar',
  deployerAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Replace with your address
  fee: 10000,
};

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

export const CONTRACT_FUNCTIONS = {
  // Read-only functions
  readOnly: [
    'get-certificate',
    'get-certificate-count',
    'is-authorized-issuer',
    'get-contract-stats',
  ],
  
  // Write functions
  write: [
    'initialize',
    'authorize-issuer',
    'revoke-issuer',
    'issue-certificate',
    'verify-certificate',
    'revoke-certificate',
    'update-certificate',
    'emergency-pause',
  ],
};

export const CONTRACT_EVENTS = [
  'certificate-issued',
  'certificate-verified',
  'issuer-authorized',
];

export const ERROR_CODES = {
  ERR_NOT_AUTHORIZED: 1001,
  ERR_INVALID_CERTIFICATE: 1002,
  ERR_CERTIFICATE_NOT_FOUND: 1003,
  ERR_INVALID_AMOUNT: 1004,
  ERR_CERTIFICATE_EXPIRED: 1005,
  ERR_ALREADY_VERIFIED: 1006,
};
