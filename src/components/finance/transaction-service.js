class TransactionService {
  constructor() {
    this.transactions = [];
  }

  async createTransaction(type, amount, metadata) {
    const transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      metadata,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Add to local state
    this.transactions.push(transaction);

    // Record on blockchain
    try {
      await this.recordOnChain(transaction);
      transaction.status = 'confirmed';
    } catch (error) {
      transaction.status = 'failed';
      throw new Error('Transaction failed');
    }

    return transaction;
  }

  async recordOnChain(transaction) {
    // Simulate blockchain interaction
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Transaction recorded:', transaction);
        resolve(true);
      }, 1000);
    });
  }

  async getTransactionHistory(address) {
    return this.transactions.filter(tx => 
      tx.metadata.from === address || tx.metadata.to === address
    );
  }

  async verifyCertificate(certId) {
    const cert = this.transactions.find(tx => 
      tx.type === 'CERTIFICATE' && tx.metadata.certId === certId
    );
    return cert ? cert.status === 'confirmed' : false;
  }
}

export default TransactionService;