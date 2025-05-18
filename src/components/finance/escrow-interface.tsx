import React, { useState } from 'react';
import {
  Clock,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader,
  Lock
} from 'lucide-react';

const EscrowInterface = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Website Development',
      client: '0x1234...5678',
      freelancer: '0x8765...4321',
      amount: '5000 USDC',
      deadline: '2025-02-15',
      status: 'InProgress',
      milestones: 3,
      completedMilestones: 1
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Project Escrow</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            New Project
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Project List */}
          <div className="col-span-4 space-y-4">
            {projects.map(project => (
              <div 
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="border rounded-lg p-4 cursor-pointer hover:border-indigo-500"
              >
                <h3 className="font-semibold">{project.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {project.amount}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Due: {project.deadline}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Details */}
          {activeProject && (
            <div className="col-span-8">
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{activeProject.title}</h2>
                    <div className="flex items-center mt-1">
                      <Shield className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-sm text-green-500">Escrow Protected</span>
                    </div>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                    {activeProject.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Client</div>
                    <div className="font-mono mt-1">{activeProject.client}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Freelancer</div>
                    <div className="font-mono mt-1">{activeProject.freelancer}</div>
                  </div>
                </div>

                {/* Milestone Progress */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Milestones</h3>
                  <div className="space-y-4">
                    {[...Array(activeProject.milestones)].map((_, idx) => (
                      <div key={idx} className="flex items-center">
                        {idx < activeProject.completedMilestones ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400 mr-2" />
                        )}
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full"
                              style={{ 
                                width: idx < activeProject.completedMilestones ? '100%' : '0%' 
                              }}
                            />
                          </div>
                        </div>
                        <span className="ml-2 text-sm">
                          {(activeProject.amount.split(' ')[0] / activeProject.milestones)} USDC
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Release Next Milestone
                  </button>
                  <button className="flex items-center px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Raise Dispute
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowInterface;