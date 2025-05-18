import React, { useState } from 'react';
import {
  Wallet,
  Key,
  Shield,
  Copy,
  CheckCircle,
  AlertCircle,
  History
} from 'lucide-react';

const BlockchainAuth = () => {
  const [authState, setAuthState] = useState('disconnected');
  const [activeTab, setActiveTab] = useState('wallet');

  const walletData = {
    address: '0x1234...5678',
    balances: {
      eth: '2.5',
      usdc: '1000.00'
    },
    transactions: [
      {
        type: 'Course Purchase',
        amount: '50 USDC',
        timestamp: '2025-01-24 14:30',
        status: 'confirmed'
      },
      {
        type: 'Certificate Issuance',
        courseId: 'TECH-101',
        timestamp: '2025-01-23 09:15',
        status: 'confirmed'
      }
    ],
    certificates: [
      {
        id: 'CERT-123',
        title: 'Advanced Electronics',
        issueDate: '2025-01-23',
        verified: true
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  activeTab === 'wallet'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Wallet
              </button>
              <button
                onClick={() => setActiveTab('credentials')}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  activeTab === 'credentials'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-5 h-5 mr-2" />
                Credentials
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  activeTab === 'history'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <History className="w-5 h-5 mr-2" />
                History
              </button>
            </div>

            {authState === 'disconnected' ? (
              <button
                onClick={() => setAuthState('connected')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-lg flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Connected
                </div>
                <button
                  onClick={() => setAuthState('disconnected')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-gray-500" />
                  <span className="font-mono">{walletData.address}</span>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(walletData.balances).map(([currency, amount]) => (
                <div key={currency} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 uppercase">{currency}</div>
                  <div className="text-2xl font-bold">{amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="space-y-4">
            {walletData.certificates.map(cert => (
              <div key={cert.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{cert.title}</h3>
                    <div className="text-sm text-gray-500">
                      Issued: {cert.issueDate}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {cert.id}
                    </div>
                  </div>
                  {cert.verified ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="w-5 h-5 mr-1" />
                      Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {walletData.transactions.map((tx, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{tx.type}</h3>
                    <div className="text-sm text-gray-500">
                      {tx.timestamp}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {tx.amount && (
                      <span className="font-medium mr-2">{tx.amount}</span>
                    )}
                    <div className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainAuth;