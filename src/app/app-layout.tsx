import React, { useState } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Book, 
  Users, 
  Briefcase,
  MessageCircle,
  Wallet
} from 'lucide-react';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'education', label: 'Education', icon: Book },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">UniPlatform</h1>
          <div className="flex space-x-4">
            <input
              type="search"
              placeholder="Search products, courses, or people..."
              className="w-96 px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
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
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">Categories</h2>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-indigo-600 cursor-pointer">Electronics</li>
              <li className="text-gray-600 hover:text-indigo-600 cursor-pointer">Courses</li>
              <li className="text-gray-600 hover:text-indigo-600 cursor-pointer">Communities</li>
              <li className="text-gray-600 hover:text-indigo-600 cursor-pointer">Job Listings</li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-span-6 space-y-6">
            {/* Example Content Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to UniPlatform</h2>
              <p className="text-gray-600">
                Your all-in-one platform for shopping, learning, connecting, and growing professionally.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Wallet Widget */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Your Wallet</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Fiat Balance</span>
                  <span className="font-medium">$1,000.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Crypto Balance</span>
                  <span className="font-medium">₿0.025</span>
                </div>
              </div>
            </div>

            {/* Messages Preview */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Recent Messages</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Hello there!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;