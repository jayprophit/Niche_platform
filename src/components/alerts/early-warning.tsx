import React from 'react';
import {
  AlertTriangle,
  Bell,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

const EarlyWarningSystem = () => {
  const alerts = [
    {
      projectId: 'PRJ-123',
      type: 'communication',
      severity: 'high',
      message: 'Response time exceeding 24h',
      timestamp: '2h ago'
    }
  ];

  const metrics = {
    responseTime: 36,
    milestoneProgress: 0.4,
    expectedProgress: 0.6,
    qualityScore: 0.75
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Early Warning System
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-red-600 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              3 High Priority Alerts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries({
            'Response Time': `${metrics.responseTime}h`,
            'Milestone Progress': `${metrics.milestoneProgress * 100}%`,
            'Expected Progress': `${metrics.expectedProgress * 100}%`,
            'Quality Score': `${metrics.qualityScore * 100}%`
          }).map(([label, value]) => (
            <div key={label} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{label}</div>
              <div className="text-xl font-bold mt-1">{value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div 
              key={idx}
              className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    {alert.message}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Project: {alert.projectId}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{alert.timestamp}</span>
              </div>
              <div className="mt-4 flex space-x-4">
                <button className="text-sm bg-white px-3 py-1 rounded border">
                  View Details
                </button>
                <button className="text-sm bg-red-600 text-white px-3 py-1 rounded">
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarlyWarningSystem;