import React from 'react';
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { BarChart2, TrendingUp, AlertCircle } from 'lucide-react';

const DisputeAnalytics = () => {
  const disputeStats = {
    monthly: [
      { month: 'Jan', disputes: 24, resolved: 20, clientWins: 8, freelancerWins: 7, split: 5 },
      { month: 'Feb', disputes: 28, resolved: 25, clientWins: 10, freelancerWins: 9, split: 6 }
    ],
    categories: [
      { type: 'Payment', count: 45, avgResolutionTime: 5.2 },
      { type: 'Quality', count: 32, avgResolutionTime: 6.8 },
      { type: 'Delivery', count: 28, avgResolutionTime: 4.5 }
    ],
    riskFactors: [
      { factor: 'New Freelancer', score: 0.8 },
      { factor: 'High Value Project', score: 0.7 },
      { factor: 'Tight Deadline', score: 0.6 }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Disputes</h3>
          <div className="text-2xl font-bold">52</div>
          <div className="text-sm text-green-600 mt-1">86% Resolution Rate</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Resolution Time</h3>
          <div className="text-2xl font-bold">5.5 days</div>
          <div className="text-sm text-blue-600 mt-1">-12% vs Last Month</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Success Rate</h3>
          <div className="text-2xl font-bold">92%</div>
          <div className="text-sm text-green-600 mt-1">+5% vs Last Month</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Dispute Resolution Trends
          </h3>
          <LineChart width={400} height={200} data={disputeStats.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="disputes" stroke="#6366F1" />
            <Line type="monotone" dataKey="resolved" stroke="#10B981" />
          </LineChart>
        </div>

        {/* Category Distribution */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2" />
            Dispute Categories
          </h3>
          <BarChart width={400} height={200} data={disputeStats.categories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </div>

        {/* Risk Analysis */}
        <div className="border rounded-lg p-4 col-span-2">
          <h3 className="font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Risk Factors
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {disputeStats.riskFactors.map(factor => (
              <div key={factor.factor} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium">{factor.factor}</div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${factor.score * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Risk Score: {factor.score.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeAnalytics;