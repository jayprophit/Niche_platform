import { injectable, inject } from 'inversify';
import { BlockchainConfig, NetworkConfig, ContractConfig } from './types/config';

@injectable()
class BlockchainIntegration {
  private readonly networks: Map<string, BlockchainNetwork>;
  private readonly contracts: Map<string, SmartContract>;
  private readonly bridge: ChainBridge;
  private readonly wallet: WalletManager;
  private readonly monitor: BlockchainMonitor;

  constructor(private readonly config: BlockchainConfig) {
    this.networks = new Map();
    this.contracts = new Map();
    this.bridge = new ChainBridge(config.bridge);
    this.wallet = new WalletManager(config.wallet);
    this.monitor = new BlockchainMonitor(config.monitoring);
  }

  async initialize(): Promise<void> {
    // Initialize networks
    await this.initializeNetworks();
    
    // Deploy contracts
    await this.deployContracts();
    
    // Setup cross-chain bridge
    await this.bridge.initialize();
    
    // Start monitoring
    await this.monitor.start();
  }

  private async initializeNetworks(): Promise<void> {
    // Initialize Ethereum network
    const ethereumNetwork = new EthereumNetwork(this.config.networks.ethereum);
    await ethereumNetwork.connect();
    this.networks.set('ethereum', ethereumNetwork);

    // Initialize Polygon network
    const polygonNetwork = new PolygonNetwork(this.config.networks.polygon);
    await polygonNetwork.connect();
    this.networks.set('polygon', polygonNetwork);

    // Initialize other supported networks...
  }

  private async deployContracts(): Promise<void> {
    // Deploy token contracts
    const tokenContract = await this.deployContract('token', this.config.contracts.token);
    this.contracts.set('token', tokenContract);

    // Deploy NFT contracts
    const nftContract = await this.deployContract('nft', this.config.contracts.nft);
    this.contracts.set('nft', nftContract);

    // Deploy DeFi contracts
    const defiContract = await this.deployContract('defi', this.config.contracts.defi);
    this.contracts.set('defi', defiContract);

    // Deploy governance contracts
    const governanceContract = await this.deployContract('governance', this.config.contracts.governance);
    this.contracts.set('governance', governanceContract);
  }

  private async deployContract(type: string, config: ContractConfig): Promise<SmartContract> {
    try {
      const network = this.networks.get(config.network);
      if (!network) {
        throw new NetworkNotFoundError(config.network);
      }

      const contract = await network.deployContract(config);
      await this.monitor.logDeployment(type, contract.address);
      return contract;
    } catch (error) {
      await this.monitor.logError('contract_deployment_failed', { type, error });
      throw new ContractDeploymentError(type, error);
    }
  }

  // Token Management
  async mintTokens(amount: number, recipient: string): Promise<string> {
    try {
      const tokenContract = this.contracts.get('token');
      if (!tokenContract) {
        throw new ContractNotFoundError('token');
      }

      const tx = await tokenContract.mint(amount, recipient);
      await this.monitor.logTransaction('mint', tx);
      return tx.hash;
    } catch (error) {
      await this.monitor.logError('token_minting_failed', { amount, recipient, error });
      throw new TokenOperationError('mint', error);
    }
  }

  async transferTokens(from: string, to: string, amount: number): Promise<string> {
    try {
      const tokenContract = this.contracts.get('token');
      if (!tokenContract) {
        throw new ContractNotFoundError('token');
      }

      const tx = await tokenContract.transfer(from, to, amount);
      await this.monitor.logTransaction('transfer', tx);
      return tx.hash;
    } catch (error) {
      await this.monitor.logError('token_transfer_failed', { from, to, amount, error });
      throw new TokenOperationError('transfer', error);
    }
  }

  // NFT Operations
  async mintNFT(metadata: NFTMetadata, recipient: string): Promise<string> {
    try {
      const nftContract = this.contracts.get('nft');
      if (!nftContract) {
        throw new ContractNotFoundError('nft');
      }

      const tx = await nftContract.mint(metadata, recipient);
      await this.monitor.logTransaction('nft_mint', tx);
      return tx.hash;
    } catch (error) {
      await this.monitor.logError('nft_minting_failed', { metadata, recipient, error });
      throw new NFTOperationError('mint', error);
    }
  }

  // Cross-chain Operations
  async bridgeAssets(
    fromChain: string,
    toChain: string,
    assets: AssetTransfer[]
  ): Promise<string> {
    try {
      const sourceNetwork = this.networks.get(fromChain);
      const targetNetwork = this.networks.get(toChain);

      if (!sourceNetwork || !targetNetwork) {
        throw new NetworkNotFoundError(fromChain || toChain);
      }

      const tx = await this.bridge.transferAssets(sourceNetwork, targetNetwork, assets);
      await this.monitor.logTransaction('bridge', tx);
      return tx.hash;
    } catch (error) {
      await this.monitor.logError('bridge_transfer_failed', {
        fromChain,
        toChain,
        assets,
        error
      });
      throw new BridgeOperationError('transfer', error);
    }
  }

  // Wallet Operations
  async createWallet(): Promise<WalletInfo> {
    try {
      const wallet = await this.wallet.create();
      await this.monitor.logWalletCreation(wallet.address);
      return wallet;
    } catch (error) {
      await this.monitor.logError('wallet_creation_failed', error);
      throw new WalletOperationError('create', error);
    }
  }

  // Contract Interaction
  async callContract(
    contractType: string,
    method: string,
    params: any[]
  ): Promise<any> {
    try {
      const contract = this.contracts.get(contractType);
      if (!contract) {
        throw new ContractNotFoundError(contractType);
      }

      const result = await contract.call(method, params);
      await this.monitor.logContractCall(contractType, method, params);
      return result;
    } catch (error) {
      await this.monitor.logError('contract_call_failed', {
        contractType,
        method,
        params,
        error
      });
      throw new ContractCallError(contractType, method, error);
    }
  }

  // Health Check
  async healthCheck(): Promise<HealthStatus> {
    const networkHealth = await Promise.all(
      Array.from(this.networks.values()).map(network => network.healthCheck())
    );

    const contractHealth = await Promise.all(
      Array.from(this.contracts.values()).map(contract => contract.healthCheck())
    );

    return {
      status: this.determineOverallHealth([...networkHealth, ...contractHealth]),
      networks: Object.fromEntries(
        Array.from(this.networks.keys()).map((key, index) => [
          key,
          networkHealth[index]
        ])
      ),
      contracts: Object.fromEntries(
        Array.from(this.contracts.keys()).map((key, index) => [
          key,
          contractHealth[index]
        ])
      ),
      bridge: await this.bridge.healthCheck(),
      wallet: await this.wallet.healthCheck(),
      timestamp: new Date().toISOString()
    };
  }

  private determineOverallHealth(componentHealth: ComponentHealth[]): HealthStatus {
    return componentHealth.every(health => health.status === 'healthy')
      ? 'healthy'
      : 'unhealthy';
  }

  // Cleanup
  async shutdown(): Promise<void> {
    await this.monitor.stop();

    await Promise.all([
      ...Array.from(this.networks.values()).map(network => network.disconnect()),
      ...Array.from(this.contracts.values()).map(contract => contract.cleanup()),
      this.bridge.shutdown(),
      this.wallet.shutdown()
    ]);

    this.networks.clear();
    this.contracts.clear();
  }
}

// Error classes
class BlockchainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlockchainError';
  }
}

class NetworkNotFoundError extends BlockchainError {
  constructor(network: string) {
    super(`Network ${network} not found`);
    this.name = 'NetworkNotFoundError';
  }
}

class ContractNotFoundError extends BlockchainError {
  constructor(contractType: string) {
    super(`Contract ${contractType} not found`);
    this.name = 'ContractNotFoundError';
  }
}

class ContractDeploymentError extends BlockchainError {
  constructor(contractType: string, error: any) {
    super(`Failed to deploy ${contractType} contract: ${error.message}`);
    this.name = 'ContractDeploymentError';
  }
}

class TokenOperationError extends BlockchainError {
  constructor(operation: string, error: any) {
    super(`Token operation ${operation} failed: ${error.message}`);
    this.name = 'TokenOperationError';
  }
}

class NFTOperationError extends BlockchainError {
  constructor(operation: string, error: any) {
    super(`NFT operation ${operation} failed: ${error.message}`);
    this.name = 'NFTOperationError';
  }
}

class BridgeOperationError extends BlockchainError {
  constructor(operation: string, error: any) {
    super(`Bridge operation ${operation} failed: ${error.message}`);
    this.name = 'BridgeOperationError';
  }
}

class WalletOperationError extends BlockchainError {
  constructor(operation: string, error: any) {
    super(`Wallet operation ${operation} failed: ${error.message}`);
    this.name = 'WalletOperationError';
  }
}

class ContractCallError extends BlockchainError {
  constructor(contractType: string, method: string, error: any) {
    super(`Contract call ${contractType}.${method} failed: ${error.message}`);
    this.name = 'ContractCallError';
  }
}

export {
  BlockchainIntegration,
  BlockchainConfig,
  WalletInfo,
  AssetTransfer,
  NFTMetadata,
  HealthStatus
};