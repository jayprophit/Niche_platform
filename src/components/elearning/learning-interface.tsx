import React, { useState } from 'react';
import {
  FileText,
  Code,
  Link,
  MessageSquare,
  PlayCircle,
  CheckCircle,
  Book,
  ChevronDown,
  Pause,
  Settings,
  Volume2,
  Maximize
} from 'lucide-react';

// Previous components remain the same (CourseNavigation, CourseProgress, ModuleList, ModuleItem)...

const CourseContent = ({ modules }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Web Development</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{modules.length} Modules</span>
          <span>36 Hours</span>
          <span>Intermediate</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <main className="col-span-8">
          <VideoPlayer />
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <LessonContent activeTab={activeTab} />
        </main>

        <aside className="col-span-4">
          <ResourcePanel />
          <DiscussionPanel />
        </aside>
      </div>
    </div>
  );
};

const ContentTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-4 border-b">
        {['overview', 'transcript', 'resources'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 ${
              activeTab === tab
                ? 'border-primary-main text-primary-main'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const LessonContent = ({ activeTab }) => {
  return (
    <div className="prose max-w-none">
      {activeTab === 'overview' && (
        <div>
          <h2>Course Overview</h2>
          <p>This comprehensive course covers advanced web development concepts...</p>
        </div>
      )}
      {activeTab === 'transcript' && (
        <div>
          <h2>Lesson Transcript</h2>
          <p>Welcome to this lesson on advanced web development...</p>
        </div>
      )}
      {activeTab === 'resources' && (
        <div>
          <h2>Additional Resources</h2>
          <ul>
            <li>Course materials</li>
            <li>Example code</li>
            <li>Reference guides</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const ResourcePanel = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
      <h3 className="font-bold text-lg mb-4">Course Resources</h3>
      <div className="space-y-4">
        <ResourceItem
          icon={FileText}
          label="Course Notes"
          type="PDF"
        />
        <ResourceItem
          icon={Code}
          label="Starter Code"
          type="ZIP"
        />
        <ResourceItem
          icon={Link}
          label="Additional Reading"
          type="URL"
        />
      </div>
    </div>
  );
};

const ResourceItem = ({ icon: Icon, label, type }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
    <div className="flex items-center">
      <Icon className="w-5 h-5 text-gray-500 mr-3" />
      <span>{label}</span>
    </div>
    <span className="text-sm text-gray-500">{type}</span>
  </div>
);

const DiscussionPanel = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-bold text-lg mb-4">Discussion</h3>
      <div className="space-y-4">
        <DiscussionThread
          author="Jane Smith"
          content="How do we handle error states in this example?"
          replies={3}
          timestamp="2h ago"
        />
      </div>
    </div>
  );
};

const DiscussionThread = ({ author, content, replies, timestamp }) => (
  <div className="border-b pb-4">
    <div className="flex items-start justify-between mb-2">
      <span className="font-medium">{author}</span>
      <span className="text-sm text-gray-500">{timestamp}</span>
    </div>
    <p className="text-gray-600 mb-2">{content}</p>
    <div className="flex items-center text-sm text-gray-500">
      <MessageSquare className="w-4 h-4 mr-1" />
      {replies} replies
    </div>
  </div>
);

// VideoPlayer component and other components remain the same...

const LearningPlatform = () => {
  const [courseModules] = useState([
    {
      id: 1,
      title: 'Getting Started',
      lessons: [
        { id: 1, title: 'Course Introduction', duration: '10:00', completed: true },
        { id: 2, title: 'Setting Up Your Environment', duration: '15:00', completed: true }
      ],
      completed: true
    },
    {
      id: 2,
      title: 'Core Concepts',
      lessons: [
        { id: 3, title: 'Basic Principles', duration: '20:00', completed: false },
        { id: 4, title: 'Advanced Techniques', duration: '25:00', completed: false }
      ],
      completed: false
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseNavigation modules={courseModules} />
      <div className="ml-64">
        <CourseContent modules={courseModules} />
      </div>
    </div>
  );
};

export default LearningPlatform;