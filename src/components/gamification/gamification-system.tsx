import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Award,
  Target,
  TrendingUp,
  Gift,
  Shield
} from 'lucide-react';

const GamificationSystem = () => {
  const [activeTab, setActiveTab] = useState('achievements');

  const userProgress = {
    level: 15,
    xp: 2800,
    nextLevel: 3000,
    rank: "Expert Creator",
    reputation: 850,
    achievements: [
      { id: 1, name: "First Sale", icon: "💰", completed: true },
      { id: 2, name: "Top Rated", icon: "⭐", completed: true },
      { id: 3, name: "Community Leader", icon: "👑", progress: 80 }
    ],
    badges: [
      { id: 1, name: "Quality Expert", icon: "🎯", tier: "gold" },
      { id: 2, name: "Fast Responder", icon: "⚡", tier: "silver" }
    ],
    quests: [
      { 
        id: 1, 
        name: "Complete 5 projects", 
        progress: 3, 
        total: 5,
        reward: "100 XP + Quality Badge" 
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* User Progress Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{userProgress.rank}</h2>
            <div className="flex items-center mt-1">
              <Shield className="w-4 h-4 text-indigo-600 mr-1" />
              <span>Reputation: {userProgress.reputation}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Level {userProgress.level}</div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${(userProgress.xp / userProgress.nextLevel) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {userProgress.xp}/{userProgress.nextLevel} XP
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b">
        <div className="flex">
          {[
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'quests', label: 'Quests', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-4">
            {userProgress.achievements.map(achievement => (
              <div key={achievement.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div>
                      <div className="font-medium">{achievement.name}</div>
                      {achievement.progress && (
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-indigo-600 rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {achievement.progress}% Complete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {achievement.completed && (
                    <div className="text-green-500">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-3 gap-4">
            {userProgress.badges.map(badge => (
              <div 
                key={badge.id}
                className={`border rounded-lg p-4 ${
                  badge.tier === 'gold' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{badge.icon}</div>
                  <div>
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {badge.tier} Tier
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quests' && (
          <div className="space-y-4">
            {userProgress.quests.map(quest => (
              <div key={quest.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{quest.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Reward: {quest.reward}
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full w-48">
                        <div 
                          className="h-2 bg-indigo-600 rounded-full"
                          style={{ 
                            width: `${(quest.progress / quest.total) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {quest.progress}/{quest.total} Completed
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded">
                    Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationSystem;