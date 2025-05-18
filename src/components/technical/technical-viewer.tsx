import React, { useState } from 'react';
import { 
  Box,
  Image,
  FileVideo,
  FileText,
  Download,
  Link,
  Info,
  Share2
} from 'lucide-react';

const TechnicalViewer = () => {
  const [activeView, setActiveView] = useState('3d');

  const technicalData = {
    modelName: "Advanced Microcontroller Board",
    files: {
      '3d': [
        { name: 'Board Assembly.step', size: '15.2 MB', type: 'CAD' },
        { name: 'PCB Layout.stp', size: '8.4 MB', type: 'CAD' }
      ],
      images: [
        { name: 'Board Dimensions.png', size: '2.1 MB', type: 'Technical Drawing' },
        { name: 'Layer Stack.jpg', size: '1.8 MB', type: 'Documentation' }
      ],
      videos: [
        { name: 'Assembly Guide.mp4', size: '45.6 MB', type: 'Tutorial' },
        { name: 'Testing Procedure.mp4', size: '32.1 MB', type: 'Guide' }
      ]
    },
    metadata: {
      version: "2.0.1",
      lastUpdated: "2025-01-20",
      author: "Engineering Team",
      license: "CC BY-NC-SA 4.0",
      tags: ["electronics", "microcontroller", "arduino-compatible"]
    },
    resources: [
      { name: "Manufacturing Guidelines", url: "#" },
      { name: "Component Datasheets", url: "#" },
      { name: "Assembly Instructions", url: "#" }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{technicalData.modelName}</h2>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Viewer Area */}
        <div className="col-span-8">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            {activeView === '3d' && (
              <div className="text-center">
                <Box className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">CAD Model Viewer</p>
              </div>
            )}
            {activeView === 'images' && (
              <div className="text-center">
                <Image className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Image Viewer</p>
              </div>
            )}
            {activeView === 'videos' && (
              <div className="text-center">
                <FileVideo className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Video Player</p>
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="mt-4 flex space-x-2">
            {['3d', 'images', 'videos'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-lg ${
                  activeView === view
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* File List and Metadata */}
        <div className="col-span-4 space-y-6">
          {/* Files */}
          <div>
            <h3 className="font-semibold mb-3">Files</h3>
            <div className="space-y-2">
              {technicalData.files[activeView].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.type} • {file.size}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-full">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="font-semibold mb-3">Metadata</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {Object.entries(technicalData.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium">{
                    Array.isArray(value) 
                      ? value.join(", ") 
                      : value
                  }</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <div className="space-y-2">
              {technicalData.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <Link className="w-4 h-4 mr-2" />
                  <span>{resource.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalViewer;