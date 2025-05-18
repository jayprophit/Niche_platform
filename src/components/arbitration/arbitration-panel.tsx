import React, { useState } from 'react';
import {
  Scale,
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Clock
} from 'lucide-react';

const ArbitrationPanel = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolution, setResolution] = useState('pending');
  const [deliberationNote, setDeliberationNote] = useState('');

  const cases = [
    {
      id: 'ARB-123',
      status: 'Pending Review',
      priority: 'High',
      type: 'Payment Dispute',
      amount: '5000 USDC',
      createdAt: '2025-01-20',
      deadline: '2025-01-27',
      parties: {
        client: {
          address: '0x1234...5678',
          rating: 4.8,
          history: '15 completed projects'
        },
        freelancer: {
          address: '0x8765...4321',
          rating: 4.9,
          history: '23 completed projects'
        }
      },
      evidence: [
        {
          party: 'client',
          type: 'Project Requirements',
          content: 'Original project specifications...',
          timestamp: '2025-01-20'
        },
        {
          party: 'freelancer',
          type: 'Work Submission',
          content: 'Completed deliverables...',
          timestamp: '2025-01-21'
        }
      ],
      deliberations: []
    }
  ];

  const resolutionOptions = [
    { value: 'clientWins', label: 'In Favor of Client' },
    { value: 'freelancerWins', label: 'In Favor of Freelancer' },
    { value: 'split', label: 'Split Resolution' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Scale className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold">Arbitration Panel</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Case List */}
          <div className="col-span-4">
            <h2 className="font-semibold mb-4">Active Cases</h2>
            <div className="space-y-4">
              {cases.map(case_ => (
                <div
                  key={case_.id}
                  onClick={() => setSelectedCase(case_)}
                  className="border rounded-lg p-4 cursor-pointer hover:border-indigo-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{case_.id}</span>
                    <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {case_.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div>{case_.type}</div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Due: {case_.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Details */}
          {selectedCase && (
            <div className="col-span-8 space-y-6">
              {/* Case Overview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedCase.id}</h2>
                    <div className="mt-1 text-gray-500">{selectedCase.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{selectedCase.amount}</div>
                    <div className="text-sm text-gray-500">In Dispute</div>
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-6">
                {['client', 'freelancer'].map(party => (
                  <div key={party} className="border rounded-lg p-4">
                    <h3 className="font-semibold capitalize mb-2">{party}</h3>
                    <div className="space-y-2">
                      <div className="font-mono text-sm">
                        {selectedCase.parties[party].address}
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-1 text-gray-500" />
                        {selectedCase.parties[party].history}
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {selectedCase.parties[party].rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Evidence Timeline */}
              <div>
                <h3 className="font-semibold mb-4">Evidence Timeline</h3>
                <div className="space-y-4">
                  {selectedCase.evidence.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.timestamp}</span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{item.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Form */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Resolution</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Resolution Decision
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="pending">Select Resolution</option>
                      {resolutionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Deliberation Notes
                    </label>
                    <textarea
                      value={deliberationNote}
                      onChange={(e) => setDeliberationNote(e.target.value)}
                      className="w-full h-32 p-2 border rounded-lg resize-none"
                      placeholder="Provide reasoning for the resolution..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Save Draft
                    </button>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                      Submit Resolution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArbitrationPanel;