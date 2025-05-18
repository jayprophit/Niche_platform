import React, { useState } from 'react';
import { 
  ShoppingCart,
  Book,
  Briefcase,
  Users,
  MessageCircle,
  Video,
  Star,
  DollarSign,
  Globe,
  Award,
  Clock,
  MapPin,
  TrendingUp,
  Heart 
} from 'lucide-react';

const MainPlatform = () => {
  const [activeSection, setActiveSection] = useState('marketplace');
  const [currentView, setCurrentView] = useState('products');

  // Universal wallet/points system for the platform
  const userWallet = {
    fiat: 1250.00,
    crypto: 2.5,
    learningPoints: 750,
    skillCredits: 500
  };

  // Unified search across all platform sections
  const UnifiedSearch = () => (
    <div className="bg-white shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex space-x-4">
        <input
          type="text"
          placeholder="Search products, courses, jobs, or content..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select className="px-4 py-2 border rounded-lg w-48">
          <option value="all">All Categories</option>
          <option value="products">Products</option>
          <option value="courses">Courses</option>
          <option value="jobs">Jobs</option>
          <option value="services">Services</option>
        </select>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Search
        </button>
      </div>
    </div>
  );

  // Navigation menu with all platform features
  const Navigation = () => (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {[
            { id: 'marketplace', label: 'Shop', icon: ShoppingCart },
            { id: 'learning', label: 'Learn', icon: Book },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'social', label: 'Social', icon: Users },
            { id: 'streaming', label: 'Live', icon: Video }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center px-4 py-3 ${
                  activeSection === item.id
                    ? 'border-b-2 border-indigo-400'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );

  // User profile and wallet overview
  const UserDashboard = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Fiat Balance</div>
          <div className="text-xl font-bold">${userWallet.fiat}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Crypto Balance</div>
          <div className="text-xl font-bold">{userWallet.crypto} ETH</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Learning Points</div>
          <div className="text-xl font-bold">{userWallet.learningPoints}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Skill Credits</div>
          <div className="text-xl font-bold">{userWallet.skillCredits}</div>
        </div>
      </div>
    </div>
  );

  // View selector for different sections
  const ViewSelector = ({ views, currentView, onChange }) => (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b">
        <div className="flex">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => onChange(view.id)}
              className={`px-6 py-3 ${
                currentView === view.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Main content area based on active section
  const MainContent = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <UserDashboard />
      {/* Content switches based on activeSection */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <UnifiedSearch />
      <MainContent />
    </div>
  );
};

export default MainPlatform;