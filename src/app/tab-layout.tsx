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

const TabLayout = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      content: (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Welcome to UniPlatform</h2>
          <p>Your all-in-one platform for shopping, learning, and networking.</p>
        </div>
      )
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      subTabs: [
        { id: 'feed', label: 'Feed' },
        { id: 'groups', label: 'Groups' },
        { id: 'events', label: 'Events' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Shop',
      icon: ShoppingCart,
      subTabs: [
        { id: 'products', label: 'Products' },
        { id: 'technical', label: 'Technical Docs' },
        { id: 'patents', label: 'Patents' }
      ]
    },
    {
      id: 'education',
      label: 'Learn',
      icon: Book,
      subTabs: [
        { id: 'courses', label: 'Courses' },
        { id: 'certificates', label: 'Certificates' },
        { id: 'resources', label: 'Resources' }
      ]
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      subTabs: [
        { id: 'listings', label: 'Listings' },
        { id: 'applications', label: 'Applications' },
        { id: 'profile', label: 'Profile' }
      ]
    }
  ];

  const [activeSubTab, setActiveSubTab] = useState(null);

  const getActiveTab = () => tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.subTabs) {
                      setActiveSubTab(tab.subTabs[0].id);
                    } else {
                      setActiveSubTab(null);
                    }
                  }}
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

      {/* Sub Navigation */}
      {getActiveTab()?.subTabs && (
        <div className="bg-gray-100 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-4">
              {getActiveTab().subTabs.map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id)}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeSubTab === subTab.id
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow min-h-[500px]">
          {activeSubTab ? (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {getActiveTab()?.label} - {getActiveTab()?.subTabs.find(st => st.id === activeSubTab)?.label}
              </h2>
              {/* Content would be rendered here based on activeTab and activeSubTab */}
            </div>
          ) : (
            getActiveTab()?.content
          )}
        </div>
      </main>
    </div>
  );
};

export default TabLayout;