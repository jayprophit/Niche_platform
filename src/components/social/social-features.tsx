import React, { useState } from 'react';
import {
  Video,
  Camera,
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  Users,
  Phone,
  Send,
  Play,
  Image,
  Globe,
  ArrowUp,
  MessageSquare
} from 'lucide-react';

const SocialFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('feed');

  const features = {
    feed: {
      stories: [
        { user: 'alex_tech', type: 'live' },
        { user: 'maker_space', type: 'story' }
      ],
      posts: [
        {
          user: 'tech_reviews',
          content: 'Just launched our new Arduino course! #tech #education',
          type: 'video',
          engagement: { likes: 1200, comments: 345, shares: 89 }
        },
        {
          user: 'project_showcase',
          content: 'Check out this 3D printed drone design',
          type: 'image',
          engagement: { likes: 892, comments: 156, shares: 45 }
        }
      ]
    },
    streaming: {
      live: [
        { user: 'tech_workshop', viewers: 1200, title: 'PCB Design Tutorial' },
        { user: 'coding_stream', viewers: 890, title: 'Building with React' }
      ]
    },
    messages: {
      chats: [
        { user: 'team_alpha', unread: 3, lastMessage: 'Project files updated' },
        { user: 'course_support', unread: 1, lastMessage: 'Your question about...' }
      ]
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Content */}
      <div className="col-span-8">
        {/* Stories/Status Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="flex space-x-4 overflow-x-auto">
              <div className="flex-shrink-0">
                <button className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-indigo-600" />
                </button>
                <span className="text-xs mt-1 block text-center">Add</span>
              </div>
              {features.feed.stories.map((story, idx) => (
                <div key={idx} className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <img
                        src="/api/placeholder/56/56"
                        alt={story.user}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-xs mt-1 block text-center">{story.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {features.feed.posts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src="/api/placeholder/40/40"
                    alt={post.user}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{post.user}</h3>
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {post.type === 'video' ? (
                  <Play className="w-12 h-12 text-gray-400" />
                ) : (
                  <Image className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1">
                      <Heart className="w-6 h-6" />
                      <span>{post.engagement.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <MessageCircle className="w-6 h-6" />
                      <span>{post.engagement.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <Share2 className="w-6 h-6" />
                      <span>{post.engagement.shares}</span>
                    </button>
                  </div>
                  <button>
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-4 space-y-6">
        {/* Live Streams */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Live Now
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {features.streaming.live.map((stream, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/api/placeholder/48/48"
                    alt={stream.user}
                    className="rounded"
                  />
                  <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 rounded">
                    LIVE
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{stream.title}</h3>
                  <p className="text-sm text-gray-500">{stream.viewers} watching</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Messages
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {features.messages.chats.map((chat, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <img
                  src="/api/placeholder/48/48"
                  alt={chat.user}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-medium flex items-center">
                    {chat.user}
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-indigo-600 text-white text-xs px-2 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeatures;