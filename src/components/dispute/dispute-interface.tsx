import React, { useState } from 'react';
import {
  AlertTriangle,
  FileText,
  Upload,
  Scale,
  Clock,
  Check,
  XCircle,
  ArrowRight
} from 'lucide-react';

const DisputeInterface = () => {
  const [activeDispute, setActiveDispute] = useState(null);
  const [evidenceText, setEvidenceText] = useState('');

  const disputes = [
    {
      id: 1,
      projectId: 'PRJ-123',
      client: '0x1234...5678',
      freelancer: '0x8765...4321',
      amount: '5000 USDC',
      status: 'Evidence',
      evidence: [
        {
          submitter: '0x1234...5678',
          evidence: 'Milestone requirements not met',
          timestamp: '2025-01-24 14:30'
        }
      ],
      deadline: '2025-01-31'
    }
  ];

  const handleSubmitEvidence = () => {
    // Implementation for submitting evidence to smart contract
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Dispute Resolution</h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Dispute List */}
          <div className="col-span-4">
            <div className="space-y-4">
              {disputes.map(dispute => (
                <div
                  key={dispute.id}
                  onClick={() => setActiveDispute(dispute)}
                  className="border rounded-lg p-4 cursor-pointer hover:border-indigo-500"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Project {dispute.projectId}</h3>
                      <div className="mt-1 text-sm text-gray-500">
                        Amount: {dispute.amount}
                      </div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      {dispute.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute Details */}
          {activeDispute && (
            <div className="col-span-8">
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Project {activeDispute.projectId}</h2>
                    <div className="flex items-center mt-1 text-yellow-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>Dispute in Progress</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Deadline: {activeDispute.deadline}
                    </span>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Client</div>
                    <div className="font-mono mt-1">{activeDispute.client}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Freelancer</div>
                    <div className="font-mono mt-1">{activeDispute.freelancer}</div>
                  </div>
                </div>

                {/* Evidence Timeline */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Evidence Timeline</h3>
                  <div className="space-y-4">
                    {activeDispute.evidence.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-mono text-sm">{item.submitter}</span>
                            <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                            <span className="text-sm text-gray-500">{item.timestamp}</span>
                          </div>
                          <p className="mt-1">{item.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Evidence */}
                {activeDispute.status === 'Evidence' && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Submit Evidence</h3>
                    <div className="space-y-4">
                      <textarea
                        value={evidenceText}
                        onChange={(e) => setEvidenceText(e.target.value)}
                        className="w-full h-32 px-3 py-2 border rounded-lg resize-none"
                        placeholder="Provide your evidence..."
                      />
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setEvidenceText('')}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleSubmitEvidence}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          Submit Evidence
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resolution (for resolved disputes) */}
                {activeDispute.status === 'Resolved' && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Resolution</h3>
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Scale className="w-5 h-5 mr-2" />
                        <span className="font-medium">Resolution Details</span>
                      </div>
                      <p className="mt-2">
                        {activeDispute.resolution}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeInterface;