import React, { useState } from 'react';

// Course and Product Data
const courseLibrary = {
  technical: [
    {
      id: "tech-001",
      title: "Full Stack Web Development",
      category: "Programming",
      level: "Intermediate",
      duration: "120 hours",
      modules: [
        {
          title: "Frontend Development",
          description: "Master modern web development",
          lessons: ["HTML5 & CSS3", "JavaScript", "React"]
        },
        {
          title: "Backend Development",
          description: "Build robust server applications",
          lessons: ["Node.js", "Express", "Databases"]
        }
      ],
      price: 199.99,
      certification: true
    },
    {
      id: "tech-002",
      title: "Mobile App Development",
      category: "Programming",
      level: "Advanced",
      duration: "100 hours",
      modules: [
        {
          title: "iOS Development",
          description: "Build iOS applications",
          lessons: ["Swift", "UIKit", "App Store"]
        }
      ],
      price: 249.99,
      certification: true
    }
  ],
  design: [
    {
      id: "des-001",
      title: "UI/UX Design Professional",
      category: "Design",
      level: "Advanced",
      duration: "80 hours",
      modules: [
        {
          title: "User Interface Design",
          description: "Create beautiful interfaces",
          lessons: ["Design Principles", "Tools & Software", "Projects"]
        }
      ],
      price: 299.99,
      certification: true
    }
  ]
};

const digitalProducts = {
  software: [
    {
      id: "sw-001",
      title: "Developer Toolkit Pro",
      category: "Development Tools",
      description: "Complete developer toolkit with code snippets and templates",
      features: [
        "200+ Code Templates",
        "50+ UI Components",
        "Custom Snippet Manager"
      ],
      price: 79.99
    }
  ],
  assets: [
    {
      id: "ast-001",
      title: "Professional UI Kit",
      category: "Design Assets",
      description: "Comprehensive UI kit for web and mobile applications",
      features: [
        "500+ UI Components",
        "200+ Icons",
        "100+ Page Templates"
      ],
      price: 59.99
    }
  ]
};

const ContentMarketplace = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'courses' ? <CourseCatalog /> : <ProductCatalog />}
      </div>
    </div>
  );
};

const MarketplaceNav = ({ activeTab, onTabChange }) => (
  <nav className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex space-x-8">
        <button
          onClick={() => onTabChange('courses')}
          className={`px-3 py-4 text-sm font-medium ${
            activeTab === 'courses'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Online Courses
        </button>
        <button
          onClick={() => onTabChange('products')}
          className={`px-3 py-4 text-sm font-medium ${
            activeTab === 'products'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Digital Products
        </button>
      </div>
    </div>
  </nav>
);

const CourseCatalog = () => {
  const allCourses = [
    ...courseLibrary.technical,
    ...courseLibrary.design
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

const ProductCatalog = () => {
  const allProducts = [
    ...digitalProducts.software,
    ...digitalProducts.assets
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{course.level}</span>
            <span>{course.duration}</span>
          </div>
        </div>
        <span className="text-xl font-bold">${course.price}</span>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Includes:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {course.modules.map((module, idx) => (
            <li key={idx} className="flex items-center">
              <span className="mr-2">•</span>
              {module.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="p-6 bg-gray-50 border-t">
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
        Enroll Now
      </button>
    </div>
  </div>
);

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        <span className="text-xl font-bold">${product.price}</span>
      </div>
      <p className="mt-4 text-gray-600">{product.description}</p>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-center">
              <span className="mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="p-6 bg-gray-50 border-t">
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
        Purchase Now
      </button>
    </div>
  </div>
);

export default ContentMarketplace;