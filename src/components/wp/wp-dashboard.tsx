import React, { useState } from 'react';
import {
  Book,
  Briefcase,
  Users,
  Calendar,
  Settings,
  Layout,
  Clock,
  Bell
} from 'lucide-react';

const WordPressDashboard = () => {
  const [activeSection, setActiveSection] = useState('courses');

  const metrics = {
    courses: { active: 25, students: 1250, completion: 78 },
    jobs: { posted: 45, applications: 320, filled: 28 },
    community: { members: 3400, groups: 56, posts: 890 },
    events: { upcoming: 12, registered: 450, completed: 89 }
  };

  const automations = [
    {
      name: 'Course Completion',
      trigger: 'Course > Completed',
      actions: ['Award Badge', 'Send Email', 'Update Group']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Platform Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-500" />
              <Settings className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {Object.entries(metrics).map(([key, data]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold capitalize mb-4">{key}</h3>
              <div className="space-y-2">
                {Object.entries(data).map(([metric, value]) => (
                  <div key={metric} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{metric}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-4 gap-4 p-4">
            {[
              { icon: Book, label: 'New Course' },
              { icon: Briefcase, label: 'Post Job' },
              { icon: Users, label: 'Create Group' },
              { icon: Calendar, label: 'Schedule Event' }
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Active Automations</h2>
          </div>
          <div className="p-4">
            {automations.map((automation, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{automation.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {automation.trigger}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
                    Edit
                  </button>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Actions:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {automation.actions.map((action, actionIdx) => (
                      <span
                        key={actionIdx}
                        className="px-2 py-1 bg-gray-100 rounded text-sm"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressDashboard;