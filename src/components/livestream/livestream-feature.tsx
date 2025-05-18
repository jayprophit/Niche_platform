import React, { useState } from 'react';
import {
  Video,
  Users,
  MessageCircle,
  Gift,
  Share2,
  Heart,
  Settings,
  Star,
  Sparkle
} from 'lucide-react';

const LiveStream = () => {
  const [viewCount, setViewCount] = useState(1234);
  const [showChat, setShowChat] = useState(true);

  const streamInfo = {
    title: "Live Arduino Workshop",
    streamer: "TechMaster",
    category: "Education",
    tags: ["electronics", "programming", "DIY"]
  };

  const chatMessages = [
    { user: "Alex", message: "Great explanation!", type: "chat" },
    { user: "Sarah", message: "Sent 50 coins", type: "donation" },
    { user: "Mike", message: "Subscribed for 3 months!", type: "subscription" }
  ];

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="flex h-full">
        {/* Stream Content */}
        <div className={`flex-1 flex flex-col ${showChat ? 'mr-80' : ''}`}>
          {/* Stream View */}
          <div className="aspect-video bg-black relative">
            <img 
              src="/api/placeholder/1280/720" 
              alt="Stream"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="bg-red-500 px-2 py-1 rounded flex items-center">
                <Video className="w-4 h-4 mr-1" />
                LIVE
              </div>
              <div className="bg-black/50 px-2 py-1 rounded flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {viewCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="bg-gray-800 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold">{streamInfo.title}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt={streamInfo.streamer}
                    className="rounded-full"
                  />
                  <span className="font-medium">{streamInfo.streamer}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                    {streamInfo.category}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600">
                  Follow
                </button>
                <button className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              {streamInfo.tags.map(tag => (
                <span key={tag} className="bg-gray-700 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-semibold">Live Chat</h2>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <img 
                    src="/api/placeholder/32/32"
                    alt={msg.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{msg.user}</span>
                      {msg.type === 'donation' && (
                        <Gift className="w-4 h-4 text-pink-500" />
                      )}
                      {msg.type === 'subscription' && (
                        <Star className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-gray-300">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-indigo-500 p-2 rounded-lg hover:bg-indigo-600">
                  <Sparkle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stream Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex space-x-4">
              <button className="bg-pink-500 px-6 py-2 rounded-lg hover:bg-pink-600 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Donate
              </button>
              <button className="bg-indigo-500 px-6 py-2 rounded-lg hover:bg-indigo-600 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;