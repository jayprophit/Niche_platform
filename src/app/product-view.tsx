import React, { useState } from 'react';
import { 
  BookOpen, 
  CircuitBoard, 
  FileText, 
  Share2, 
  ShoppingCart,
  Star,
  Code
} from 'lucide-react';

const ProductView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const product = {
    name: "Arduino Mega 2560 R3",
    price: 45.99,
    rating: 4.5,
    description: "Advanced microcontroller board based on the ATmega2560.",
    specifications: {
      processor: "ATmega2560",
      clockSpeed: "16 MHz",
      digitalPins: 54,
      analogInputs: 16,
      memory: "256 KB"
    },
    relatedCourses: [
      {
        id: 1,
        title: "Arduino Programming Fundamentals",
        rating: 4.8,
        students: 15000,
        price: 29.99
      },
      {
        id: 2,
        title: "Building IoT Projects with Arduino",
        rating: 4.6,
        students: 12000,
        price: 39.99
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Product Image and Basic Info */}
        <div className="col-span-5">
          <div className="bg-white p-6 rounded-lg shadow">
            <img 
              src="/api/placeholder/400/400"
              alt={product.name}
              className="w-full rounded-lg mb-4"
            />
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-lg">{product.rating}</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">${product.price}</span>
            </div>
            <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-span-7">
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                {[
                  { id: 'overview', label: 'Overview', icon: FileText },
                  { id: 'technical', label: 'Technical Details', icon: CircuitBoard },
                  { id: 'learning', label: 'Learning Resources', icon: BookOpen },
                  { id: 'code', label: 'Sample Code', icon: Code }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 ${
                        activeTab === tab.id
                          ? 'border-b-2 border-indigo-600 text-indigo-600'
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

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>54 digital input/output pins</li>
                      <li>16 analog inputs</li>
                      <li>256 KB flash memory</li>
                      <li>USB connectivity</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                  <div className="space-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium capitalize">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Technical Documentation</h3>
                    <div className="space-y-3">
                      <a 
                        href="#" 
                        className="block p-3 border rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Datasheet (PDF)
                      </a>
                      <a 
                        href="#" 
                        className="block p-3 border rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Schematics (PDF)
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Related Courses</h2>
                  <div className="space-y-4">
                    {product.relatedCourses.map(course => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{course.title}</h3>
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1">{course.rating}</span>
                              <span className="text-gray-500 ml-2">({course.students} students)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold">${course.price}</span>
                            <button className="block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                              Enroll
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Sample Code</h2>
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <pre className="text-sm">
                      <code>
{`// Blink LED Example
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`}
                      </code>
                    </pre>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">More Examples</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-indigo-600 hover:underline flex items-center">
                          <Code className="w-4 h-4 mr-2" />
                          Serial Communication Example
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-indigo-600 hover:underline flex items-center">
                          <Code className="w-4 h-4 mr-2" />
                          Sensor Reading Example
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;