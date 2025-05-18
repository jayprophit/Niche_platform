import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ResponsiveLayout } from '../../lib/responsive/ResponsiveLayout';

// Blockchain Wallet Component
export const BlockchainWallet = ({ user, walletData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState({
    recipient: '',
    amount: 0,
    tokenType: 'platform',
    message: ''
  });
  
  const handleTransaction = () => {
    // Process transaction logic
    console.log('Processing transaction:', transactionData);
    setShowTransactionModal(false);
    // Show success message or refresh wallet data
  };
  
  return (
    <ResponsiveLayout>
      <div className="blockchain-wallet">
        <div className="wallet-header">
          <h1>Blockchain Wallet</h1>
          <div className="wallet-actions">
            {walletData ? (
              <button 
                className="send-tokens-btn primary-btn"
                onClick={() => setShowTransactionModal(true)}
              >
                Send Tokens
              </button>
            ) : (
              <button 
                className="connect-wallet-btn primary-btn"
                onClick={() => setShowConnectModal(true)}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        
        {walletData ? (
          <>
            <div className="wallet-balance-cards">
              <div className="balance-card platform-token">
                <div className="token-icon">
                  <img src="/images/platform-token-icon.svg" alt="Platform Token" />
                </div>
                <div className="token-details">
                  <h3 className="token-name">Platform Tokens</h3>
                  <p className="token-balance">{walletData.platformTokens.toFixed(2)}</p>
                  <p className="token-value">${walletData.platformTokenValue.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="balance-card reputation-token">
                <div className="token-icon">
                  <img src="/images/reputation-token-icon.svg" alt="Reputation Token" />
                </div>
                <div className="token-details">
                  <h3 className="token-name">Reputation Points</h3>
                  <p className="token-balance">{walletData.reputationTokens.toFixed(2)}</p>
                  <p className="token-info">Non-transferable</p>
                </div>
              </div>
              
              {walletData.otherTokens.map(token => (
                <div key={token.id} className="balance-card other-token">
                  <div className="token-icon">
                    <img src={token.icon} alt={token.name} />
                  </div>
                  <div className="token-details">
                    <h3 className="token-name">{token.name}</h3>
                    <p className="token-balance">{token.balance.toFixed(2)}</p>
                    <p className="token-value">${token.value.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="wallet-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
              <button 
                className={`tab-btn ${activeTab === 'nfts' ? 'active' : ''}`}
                onClick={() => setActiveTab('nfts')}
              >
                NFTs
              </button>
              <button 
                className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
                onClick={() => setActiveTab('rewards')}
              >
                Rewards
              </button>
            </div>
            
            <div className="wallet-content">
              {activeTab === 'overview' && (
                <div className="overview-tab-content">
                  <div className="wallet-stats">
                    <div className="stat-card">
                      <h3>Total Value</h3>
                      <p className="stat-value">${walletData.totalValue.toFixed(2)}</p>
                      <p className={`stat-change ${walletData.valueChange >= 0 ? 'positive' : 'negative'}`}>
                        {walletData.valueChange >= 0 ? '+' : ''}{walletData.valueChange.toFixed(2)}%
                      </p>
                    </div>
                    
                    <div className="stat-card">
                      <h3>Transactions</h3>
                      <p className="stat-value">{walletData.transactionCount}</p>
                      <p className="stat-period">Last 30 days</p>
                    </div>
                    
                    <div className="stat-card">
                      <h3>Reputation Level</h3>
                      <p className="stat-value">{walletData.reputationLevel}</p>
                      <div className="level-progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${walletData.reputationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    {walletData.recentTransactions.length > 0 ? (
                      <div className="activity-list">
                        {walletData.recentTransactions.map(transaction => (
                          <div key={transaction.id} className="activity-item">
                            <div className="activity-icon">
                              {transaction.type === 'send' ? (
                                <i className="send-icon"></i>
                              ) : transaction.type === 'receive' ? (
                                <i className="receive-icon"></i>
                              ) : (
                                <i className="reward-icon"></i>
                              )}
                            </div>
                            
                            <div className="activity-details">
                              <p className="activity-title">
                                {transaction.type === 'send' ? 'Sent to ' : 
                                 transaction.type === 'receive' ? 'Received from ' : 
                                 'Reward for '}
                                {transaction.counterparty}
                              </p>
                              <p className="activity-time">{transaction.time}</p>
                            </div>
                            
                            <div className="activity-amount">
                              <p className={`amount ${transaction.type === 'send' ? 'negative' : 'positive'}`}>
                                {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.token}
                              </p>
                              <p className="amount-value">${transaction.value.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-activity-message">No recent activity to display.</p>
                    )}
                    
                    <Link href="/blockchain/transactions">
                      <a className="view-all-link">View All Transactions</a>
                    </Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'transactions' && (
                <div className="transactions-tab-content">
                  <div className="transactions-filters">
                    <div className="filter-group">
                      <label>Type</label>
                      <select>
                        <option value="all">All Types</option>
                        <option value="send">Sent</option>
                        <option value="receive">Received</option>
                        <option value="reward">Rewards</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label>Token</label>
                      <select>
                        <option value="all">All Tokens</option>
                        <option value="platform">Platform Token</option>
                        <option value="reputation">Reputation</option>
                        {walletData.otherTokens.map(token => (
                          <option key={token.id} value={token.id}>{token.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label>Date Range</label>
                      <select>
                        <option value="all">All Time</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="transactions-list">
                    {walletData.transactions.length > 0 ? (
                      walletData.transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-item">
                          <div className="transaction-icon">
                            {transaction.type === 'send' ? (
                              <i className="send-icon"></i>
                            ) : transaction.type === 'receive' ? (
                              <i className="receive-icon"></i>
                            ) : (
                              <i className="reward-icon"></i>
                            )}
                          </div>
                          
                          <div className="transaction-details">
                            <p className="transaction-title">
                              {transaction.type === 'send' ? 'Sent to ' : 
                               transaction.type === 'receive' ? 'Received from ' : 
                               'Reward for '}
                              {transaction.counterparty}
                            </p>
                            <p className="transaction-message">{transaction.message}</p>
                            <p className="transaction-time">{transaction.time}</p>
                          </div>
                          
                          <div className="transaction-amount">
                            <p className={`amount ${transaction.type === 'send' ? 'negative' : 'positive'}`}>
                              {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.token}
                            </p>
                            <p className="amount-value">${transaction.value.toFixed(2)}</p>
                          </div>
                          
                          <div className="transaction-status">
                            <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                              {transaction.status}
                            </span>
                            <Link href={`/blockchain/transaction/${transaction.hash}`}>
                              <a className="view-details-link">View Details</a>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-transactions-message">No transactions to display.</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'nfts' && (
                <div className="nfts-tab-content">
                  <div className="nfts-filters">
                    <div className="filter-group">
                      <label>Category</label>
                      <select>
                        <option value="all">All Categories</option>
                        <option value="certificates">Certificates</option>
                        <option value="collectibles">Collectibles</option>
                        <option value="achievements">Achievements</option>
                        <option value="art">Art</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="nfts-grid">
                    {walletData.nfts.length > 0 ? (
                      walletData.nfts.map(nft => (
                        <div key={nft.id} className="nft-card">
                          <div className="nft-image">
                            <img src={nft.image} alt={nft.name} />
                          </div>
                          <div className="nft-details">
                            <h3 className="nft-name">{nft.name}</h3>
                            <p className="nft-category">{nft.category}</p>
                            <p className="nft-description">{nft.description}</p>
                          </div>
                          <div className="nft-footer">
                            <p className="nft-date">Acquired: {nft.acquiredDate}</p>
                            <Link href={`/blockchain/nft/${nft.id}`}>
                              <a className="view-nft-btn">View Details</a>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-nfts-message">
                        <p>You don't have any NFTs yet.</p>
                        <Link href="/marketplace/nfts">
                          <a className="browse-nfts-btn">Browse NFT Marketplace</a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'rewards' && (
                <div className="rewards-tab-content">
                  <div className="rewards-overview">
                    <div className="rewards-stats">
                      <div className="stat-card">
                        <h3>Total Rewards Earned</h3>
                        <p className="stat-value">{walletData.totalRewards.toFixed(2)} Tokens</p>
                      </div>
                      
                      <div className="stat-card">
                        <h3>Available Rewards</h3>
                        <p className="stat-value">{walletData.availableRewards.toFixed(2)} Tokens</p>
                      </div>
                      
                      <div className="stat-card">
                        <h3>Reward Rate</h3>
                        <p className="stat-value">{walletData.rewardRate.toFixed(2)} Tokens/Day</p>
                      </div>
                    </div>
                    
                    <div className="rewards-categories">
                      <h3>Rewards by Category</h3>
                      <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>