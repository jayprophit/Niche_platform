import React, { useState } from 'react';
import {
  BarChart,
  Activity,
  Users,
  Heart,
  Star,
  Gift,
  Sparkle,
  ChevronsUp,
  Award,
  TrendingUp
} from 'lucide-react';

const StreamFeatures = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  const streamStats = {
    viewers: {
      current: 1234,
      peak: 1500,
      trend: '+15%'
    },
    engagement: {
      reactions: 3200,
      comments: 850,
      shares: 145
    },
    donations: {
      total: '$1,250',
      topDonator: 'TechFan123',
      recentDonations: [
        { user: 'Alex', amount: '$50', message: 'Great content!' },
        { user: 'Sarah', amount: '$25', message: 'Keep it up!' }
      ]
    }
  };

  const reactions = [
    { type: 'heart', count: 324 },
    { type: 'star', count: 156 },
    { type: 'rocket', count: 89 }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Quick Reactions */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Live Reactions</h3>
        <div className="flex space-x-4">
          <button className="flex-1 bg-pink-500/20 hover:bg-pink-500/30 p-3 rounded-lg">
            <Heart className="w-6 h-6 text-pink-500 mx-auto" />
            <span className="block text-center mt-1">{reactions[0].count}</span>
          </button>
          <button className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 p-3 rounded-lg">
            <Star className="w-6 h-6 text-yellow-500 mx-auto" />
            <span className="block text-center mt-1">{reactions[1].count}</span>
          </button>
          <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 p-3 rounded-lg">
            <Sparkle className="w-6 h-6 text-blue-500 mx-auto" />
            <span className="block text-center mt-1">{reactions[2].count}</span>
          </button>
        </div>
      </div>

      {/* Stream Analytics */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Stream Analytics</h3>
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="text-gray-400 hover:text-white"
          >
            <BarChart className="w-5 h-5" />
          </button>
        </div>

        {showAnalytics && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-green-400">{streamStats.viewers.trend}</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{streamStats.viewers.current}</div>
                <div className="text-sm text-gray-400">Current Viewers</div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-blue-400">{streamStats.engagement.comments}</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{streamStats.engagement.reactions}</div>
                <div className="text-sm text-gray-400">Total Reactions</div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Gift className="w-5 h-5 text-pink-400" />
                <span className="text-yellow-400">{streamStats.donations.total}</span>
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold">Top: {streamStats.donations.topDonator}</div>
                <div className="text-sm text-gray-400">Donations</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievements/Milestones */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Stream Milestones</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg">
            <Award className="w-6 h-6 text-yellow-500" />
            <div className="flex-1">
              <div className="font-medium">1000 Viewers Reached!</div>
              <div className="text-sm text-gray-400">New milestone achieved</div>
            </div>
            <ChevronsUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <div className="flex-1">
              <div className="font-medium">Top Education Stream</div>
              <div className="text-sm text-gray-400">Currently trending</div>
            </div>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Recent Support */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Support</h3>
        <div className="space-y-3">
          {streamStats.donations.recentDonations.map((donation, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg">
              <Gift className="w-6 h-6 text-pink-500" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{donation.user}</span>
                  <span className="text-green-400">{donation.amount}</span>
                </div>
                <div className="text-sm text-gray-400">{donation.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamFeatures;