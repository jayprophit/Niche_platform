import React, { useState } from 'react';
import {
  ShoppingCart,
  Book,
  Tag,
  Bookmark,
  Star,
  Award,
  Code,
  DollarSign,
  CheckSquare,
  Clock,
  Users,
  Globe
} from 'lucide-react';

const IntegratedPlatform = () => {
  const [activeTab, setActiveTab] = useState('marketplace');

  const marketplaceItems = {
    products: [
      {
        title: "Arduino Pro Kit",
        price: 89.99,
        rating: 4.8,
        seller: "TechStore",
        shipping: "Prime",
        condition: "New",
        orders: 1250,
        type: "retail"
      },
      {
        title: "Circuit Design Service",
        price: 150,
        rating: 4.9,
        seller: "ElectroExpert",
        deliveryTime: "3 days",
        orders: 89,
        type: "service"
      }
    ],
    deals: [
      {
        title: "Electronics Bundle",
        discount: "40% OFF",
        originalPrice: 299.99,
        currentPrice: 179.99,
        timeLeft: "2 days"
      }
    ]
  };

  const courses = {
    featured: [
      {
        title: "Complete Electronics Masterclass",
        instructor: "Dr. Emily Chen",
        platform: "Udemy",
        rating: 4.9,
        students: 15000,
        price: 89.99,
        certificate: true,
        level: "Beginner to Advanced"
      },
      {
        title: "MIT Electronics Engineering",
        platform: "edX",
        instructor: "Prof. James Wilson",
        rating: 4.8,
        students: 8500,
        price: "Free",
        certificate: "Paid",
        level: "Advanced"
      }
    ],
    paths: [
      {
        title: "Electronics Engineering",
        courses: 12,
        duration: "6 months",
        certificate: true
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-3 ${
                activeTab === 'marketplace' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-3 ${
                activeTab === 'learning' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500'
              }`}
            >
              Learning
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Featured Products */}
            <section>
              <h2 className="text-xl font-bold mb-4">Featured Products</h2>
              <div className="grid grid-cols-2 gap-6">
                {marketplaceItems.products.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{item.rating}</span>
                          <span className="text-gray-500 ml-2">({item.orders} orders)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${item.price}</div>
                        {item.shipping && (
                          <span className="text-sm text-indigo-600">{item.shipping}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {item.seller}
                      </div>
                      {item.condition && (
                        <div className="mt-1 text-sm text-gray-500">
                          Condition: {item.condition}
                        </div>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                      {item.type === 'service' ? 'Order Service' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Deals */}
            <section>
              <h2 className="text-xl font-bold mb-4">Today's Deals</h2>
              <div className="grid grid-cols-3 gap-6">
                {marketplaceItems.deals.map((deal, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="text-red-600 font-bold mb-2">{deal.discount}</div>
                    <h3 className="font-semibold">{deal.title}</h3>
                    <div className="mt-2">
                      <span className="text-gray-500 line-through">${deal.originalPrice}</span>
                      <span className="text-xl font-bold ml-2">${deal.currentPrice}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Ends in {deal.timeLeft}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Featured Courses */}
            <section>
              <h2 className="text-xl font-bold mb-4">Featured Courses</h2>
              <div className="grid grid-cols-2 gap-6">
                {courses.featured.map((course, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{course.rating}</span>
                          <span className="text-gray-500 ml-2">
                            ({course.students.toLocaleString()} students)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {course.price === "Free" ? "Free" : `$${course.price}`}
                        </div>
                        <span className="text-sm text-indigo-600">{course.platform}</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {course.instructor}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="w-4 h-4 mr-1" />
                        {course.level}
                      </div>
                      {course.certificate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <CheckSquare className="w-4 h-4 mr-1" />
                          Certificate Included
                        </div>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Paths */}
            <section>
              <h2 className="text-xl font-bold mb-4">Learning Paths</h2>
              <div className="grid grid-cols-3 gap-6">
                {courses.paths.map((path, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold">{path.title}</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Book className="w-4 h-4 mr-1" />
                        {path.courses} Courses
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {path.duration}
                      </div>
                      {path.certificate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Award className="w-4 h-4 mr-1" />
                          Professional Certificate
                        </div>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                      View Path
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default IntegratedPlatform;