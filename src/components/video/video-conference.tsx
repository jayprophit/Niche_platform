import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  MessageCircle,
  Share2,
  Settings,
  Hand,
  Layout,
  Phone
} from 'lucide-react';

const VideoConference = () => {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [showChat, setShowChat] = useState(false);

  const participants = [
    { id: 1, name: 'John Doe', speaking: true },
    { id: 2, name: 'Jane Smith', muted: true },
    { id: 3, name: 'Alex Johnson', handRaised: true },
    { id: 4, name: 'Sarah Wilson', sharing: true }
  ];

  return (
    <div className="h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex h-full">
        {/* Video Grid */}
        <div className={`flex-1 p-4 ${showChat ? 'mr-80' : ''}`}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {participants.map(participant => (
              <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src="/api/placeholder/640/360" 
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Participant Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70">
                  <div className="flex items-center justify-between">
                    <span>{participant.name}</span>
                    <div className="flex items-center space-x-2">
                      {participant.speaking && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {participant.muted && <MicOff className="w-4 h-4" />}
                      {participant.handRaised && <Hand className="w-4 h-4" />}
                      {participant.sharing && <Share2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold">Chat</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img 
                    src="/api/placeholder/32/32"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-sm text-gray-400">Can everyone see my screen?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMuted(!muted)}
                className={`p-3 rounded-full ${
                  muted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setVideoOff(!videoOff)}
                className={`p-3 rounded-full ${
                  videoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {videoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </button>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Hand className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-full ${
                  showChat ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Users className="w-6 h-6" />
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Layout className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Settings className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full bg-red-500 hover:bg-red-600">
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;