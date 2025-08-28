import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export interface Certificate {
  id: number;
  issuer: string;
  recipient: string;
  title: string;
  description: string;
  issueDate: number;
  expiryDate?: number;
  status: string;
  blockHash: string;
  transactionId: string;
}

export interface ContractStats {
  totalCertificates: number;
  contractOwner: string;
  certificateCost: number;
}

export class CertifyChainContractService {
  private network: any;
  private contractAddress: string;
  private contractName: string;
  private apiUrl: string;

  constructor(contractAddress: string, isMainnet: boolean = false) {
    this.network = isMainnet ? STACKS_MAINNET : STACKS_TESTNET;
    this.contractAddress = contractAddress.split('.')[0];
    this.contractName = contractAddress.split('.')[1];
    this.apiUrl = isMainnet 
      ? 'https://api.mainnet.hiro.so' 
      : 'https://api.testnet.hiro.so';
  }

  // Read-only functions using Hiro API
  async getCertificate(certificateId: number): Promise<Certificate | null> {
    try {
      const response = await fetch(`${this.apiUrl}/extended/v1/contract/call-read/${this.contractAddress}/${this.contractName}/get-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.contractAddress,
          arguments: [certificateId.toString()]
        })
      });

      if (!response.ok) return null;

      const result = await response.json();
      if (!result.result) return null;

      // Parse the result (simplified - would need proper CV parsing)
      return {
        id: certificateId,
        issuer: result.result.issuer || '',
        recipient: result.result.recipient || '',
        title: result.result.title || '',
        description: result.result.description || '',
        issueDate: result.result['issue-date'] || 0,
        expiryDate: result.result['expiry-date'],
        status: result.result.status || '',
        blockHash: result.result['block-hash'] || '',
        transactionId: result.result['transaction-id'] || '',
      };
    } catch (error) {
      console.error('Error getting certificate:', error);
      return null;
    }
  }

  async getCertificateCount(): Promise<number> {
    try {
      const response = await fetch(`${this.apiUrl}/extended/v1/contract/call-read/${this.contractAddress}/${this.contractName}/get-certificate-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.contractAddress,
          arguments: []
        })
      });

      if (!response.ok) return 0;

      const result = await response.json();
      return parseInt(result.result) || 0;
    } catch (error) {
      console.error('Error getting certificate count:', error);
      return 0;
    }
  }

  async isAuthorizedIssuer(issuer: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/extended/v1/contract/call-read/${this.contractAddress}/${this.contractName}/is-authorized-issuer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.contractAddress,
          arguments: [issuer]
        })
      });

      if (!response.ok) return false;

      const result = await response.json();
      return result.result === 'true';
    } catch (error) {
      console.error('Error checking authorized issuer:', error);
      return false;
    }
  }

  async getContractStats(): Promise<ContractStats> {
    try {
      const response = await fetch(`${this.apiUrl}/extended/v1/contract/call-read/${this.contractAddress}/${this.contractName}/get-contract-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.contractAddress,
          arguments: []
        })
      });

      if (!response.ok) {
        return {
          totalCertificates: 0,
          contractOwner: '',
          certificateCost: 0,
        };
      }

      const result = await response.json();
      const stats = result.result || {};
      
      return {
        totalCertificates: parseInt(stats['total-certificates']) || 0,
        contractOwner: stats['contract-owner'] || '',
        certificateCost: parseInt(stats['certificate-cost']) || 0,
      };
    } catch (error) {
      console.error('Error getting contract stats:', error);
      return {
        totalCertificates: 0,
        contractOwner: '',
        certificateCost: 0,
      };
    }
  }

  // Write functions - these would be handled by the wallet integration
  async issueCertificate(
    recipient: string,
    title: string,
    description: string,
    expiryDate?: number
  ): Promise<string> {
    // This would be handled by the wallet integration
    // For now, return a mock transaction ID
    console.log('Issuing certificate:', { recipient, title, description, expiryDate });
    return 'mock-transaction-id-' + Date.now();
  }

  async verifyCertificate(certificateId: number): Promise<string> {
    // This would be handled by the wallet integration
    console.log('Verifying certificate:', certificateId);
    return 'mock-verification-id-' + Date.now();
  }

  async revokeCertificate(certificateId: number): Promise<string> {
    // This would be handled by the wallet integration
    console.log('Revoking certificate:', certificateId);
    return 'mock-revocation-id-' + Date.now();
  }

  async updateCertificate(
    certificateId: number,
    newTitle: string,
    newDescription: string
  ): Promise<string> {
    // This would be handled by the wallet integration
    console.log('Updating certificate:', { certificateId, newTitle, newDescription });
    return 'mock-update-id-' + Date.now();
  }

  // Batch operations
  async getMultipleCertificates(certificateIds: number[]): Promise<Certificate[]> {
    const certificates: Certificate[] = [];
    
    for (const id of certificateIds) {
      const certificate = await this.getCertificate(id);
      if (certificate) {
        certificates.push(certificate);
      }
    }
    
    return certificates;
  }

  // Search certificates by recipient (simplified)
  async searchCertificatesByRecipient(recipient: string): Promise<Certificate[]> {
    const totalCount = await this.getCertificateCount();
    const certificates: Certificate[] = [];
    
    // This is a simplified search - in production you'd want proper indexing
    for (let i = 1; i <= totalCount; i++) {
      const certificate = await this.getCertificate(i);
      if (certificate && certificate.recipient === recipient) {
        certificates.push(certificate);
      }
    }
    
    return certificates;
  }

  // Get recent certificates
  async getRecentCertificates(limit: number = 10): Promise<Certificate[]> {
    const totalCount = await this.getCertificateCount();
    const certificates: Certificate[] = [];
    
    const startId = Math.max(1, totalCount - limit + 1);
    
    for (let i = startId; i <= totalCount; i++) {
      const certificate = await this.getCertificate(i);
      if (certificate) {
        certificates.push(certificate);
      }
    }
    
    return certificates.reverse(); // Most recent first
  }

  // Get contract events
  async getContractEvents(limit: number = 50): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/extended/v1/address/${this.contractAddress}.${this.contractName}/events?limit=${limit}`);
      
      if (!response.ok) return [];

      const result = await response.json();
      return result.results || [];
    } catch (error) {
      console.error('Error getting contract events:', error);
      return [];
    }
  }
}

// Factory function to create contract service
export function createCertifyChainService(
  contractAddress: string,
  isMainnet: boolean = false
): CertifyChainContractService {
  return new CertifyChainContractService(contractAddress, isMainnet);
}

// Default contract configuration
export const DEFAULT_CONTRACT_CONFIG = {
  testnet: {
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifychain',
    network: false
  },
  mainnet: {
    address: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifychain',
    network: true
  }
};
