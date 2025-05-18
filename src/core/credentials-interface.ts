import { injectable, inject } from 'inversify';
import { ContractInterface, TransactionConfig } from './types/contracts';
import { CredentialMetadata, SkillSet } from './types/education';

@injectable()
class EducationalCredentialsInterface {
  private readonly contract: ContractInterface;
  private readonly ipfs: IPFSService;
  private readonly monitor: ContractMonitor;

  constructor(
    @inject('ContractInterface') contract: ContractInterface,
    @inject('IPFSService') ipfs: IPFSService,
    @inject('ContractMonitor') monitor: ContractMonitor
  ) {
    this.contract = contract;
    this.ipfs = ipfs;
    this.monitor = monitor;
  }

  async issueCredential(
    recipient: string,
    metadata: CredentialMetadata,
    skills: string[]
  ): Promise<string> {
    try {
      // Upload metadata to IPFS
      const ipfsHash = await this.ipfs.uploadMetadata({
        ...metadata,
        skills,
        timestamp: Date.now()
      });

      // Prepare transaction
      const tx = await this.contract.methods.issueCredential(
        recipient,
        metadata.credentialType,
        metadata.institution,
        metadata.expiryDate || 0,
        metadata.subjectArea,
        metadata.grade || '',
        skills,
        ipfsHash
      );

      // Monitor transaction
      const receipt = await this.monitor.watchTransaction(tx);
      const tokenId = this.extractTokenId(receipt);

      // Log issuance
      await this.monitor.logCredentialIssued(tokenId, recipient, metadata);

      return tokenId;
    } catch (error) {
      await this.monitor.logError('credential_issuance_failed', {
        recipient,
        metadata,
        error
      });
      throw new CredentialOperationError('issuance', error);
    }
  }

  async verifyCredential(tokenId: string): Promise<void> {
    try {
      const tx = await this.contract.methods.verifyCredential(tokenId);
      await this.monitor.watchTransaction(tx);
      await this.monitor.logCredentialVerified(tokenId);
    } catch (error) {
      await this.monitor.logError('credential_verification_failed', {
        tokenId,
        error
      });
      throw new CredentialOperationError('verification', error);
    }
  }

  async revokeCredential(tokenId: string): Promise<void> {
    try {
      const tx = await this.contract.methods.revokeCredential(tokenId);
      await this.monitor.watchTransaction(tx);
      await this.monitor.logCredentialRevoked(tokenId);
    } catch (error) {
      await this.monitor.logError('credential_revocation_failed', {
        tokenId,
        error
      });
      throw new CredentialOperationError('revocation', error);
    }
  }

  async addSkills(tokenId: string, newSkills: string[]): Promise<void> {
    try {
      const tx = await this.contract.methods.addSkills(tokenId, newSkills);
      await this.monitor.watchTransaction(tx);
      await this.monitor.logSkillsAdded(tokenId, newSkills);
    } catch (error) {
      await this.monitor.logError('skills_addition_failed', {
        tokenId,
        newSkills,
        error
      });
      throw new CredentialOperationError('skills_addition', error);
    }
  }

  async getCredentialDetails(tokenId: string): Promise<CredentialDetails> {
    try {
      // Get on-chain data
      const [
        credentialType,
        institution,
        issueDate,
        expiryDate,
        subjectArea,
        grade,
        revoked,
        skills
      ] = await this.contract.methods.getCredentialDetails(tokenId).call();

      // Get IPFS metadata
      const uri = await this.contract.methods.tokenURI(tokenId).call();
      const metadata = await this.ipfs.getMetadata(uri);

      // Get verification status
      const verificationCount = await this.contract.methods
        .getVerificationCount(tokenId)
        .call();
      const isExpired = await this.contract.methods.isExpired(tokenId).call();

      return {
        id: tokenId,
        credentialType,
        institution,
        issueDate: new Date(Number(issueDate) * 1000),
        expiryDate: expiryDate > 0 ? new Date(Number(expiryDate) * 1000) : null,
        subjectArea,
        grade,
        revoked,
        skills,
        metadata,
        verifications: Number(verificationCount),
        isExpired,
        uri
      };
    } catch (error) {
      await this.monitor.logError('credential_details_fetch_failed', {
        tokenId,
        error
      });
      throw new CredentialOperationError('details_fetch', error);
    }
  }

  async getCredentialsByOwner(owner: string): Promise<CredentialDetails[]> {
    try {
      // Get token balance
      const balance = await this.contract.methods.balanceOf(owner).call();

      // Get all tokens
      const tokens = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await this.contract.methods
          .tokenOfOwnerByIndex(owner, i)
          .call();
        tokens.push(tokenId);
      }

      // Get details for each token
      return Promise.all(tokens.map(tokenId => this.getCredentialDetails(tokenId)));
    } catch (error) {
      await this.monitor.logError('owner_credentials_fetch_failed', {
        owner,
        error
      });
      throw new CredentialOperationError('owner_fetch', error);
    }
  }

  async isVerifiedBy(tokenId: string, verifier: string): Promise<boolean> {
    try {
      return this.contract.methods.isVerifiedBy(tokenId, verifier).call();
    } catch (error) {
      await this.monitor.logError('verification_check_failed', {
        tokenId,
        verifier,
        error
      });
      throw new CredentialOperationError('verification_check', error);
    }
  }

  private extractTokenId(receipt: TransactionReceipt): string {
    // Implementation to extract token ID from transaction receipt
    return '';
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      const [contractHealth, ipfsHealth] = await Promise.all([
        this.contract.healthCheck(),
        this.ipfs.healthCheck()
      ]);

      return {
        status: contractHealth.status === 'healthy' && ipfsHealth.status === 'healthy'
          ? 'healthy'
          : 'unhealthy',
        contract: contractHealth,
        ipfs: ipfsHealth,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Error classes
class CredentialOperationError extends Error {
  constructor(operation: string, error: any) {
    super(`Credential operation '${operation}' failed: ${error.message}`);
    this.name = 'CredentialOperationError';
  }
}

export {
  EducationalCredentialsInterface,
  CredentialDetails,
  HealthStatus
};