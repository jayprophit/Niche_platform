import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Main feature sections with descriptions
  const features = [
    {
      title: 'Social Network',
      description: 'Connect with friends, join communities, share updates, and engage with content from people across the platform.',
      icon: '👥',
      link: '/social',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell products with enhanced interactive product views, detailed specs, and secure transactions.',
      icon: '🛒',
      link: '/shop',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Learning Center',
      description: 'Take courses, earn certificates, and build skills with our comprehensive e-learning platform.',
      icon: '📚',
      link: '/learn',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Blog',
      description: 'Discover articles, share your knowledge, and stay updated with the latest content in your areas of interest.',
      icon: '📝',
      link: '/blog',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Job Marketplace',
      description: 'Find job opportunities, showcase your skills with certificates, and connect with employers.',
      icon: '💼',
      link: '/jobs',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Chat & Communities',
      description: 'Join conversations, video calls, and community spaces with age-appropriate access controls.',
      icon: '💬',
      link: '/chat',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Your All-In-One Digital Platform
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in opacity-90">
            Connect, learn, shop, work, and share — all in one integrated experience
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <Link href="/register" className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all">
              Get Started
            </Link>
            <Link href="/about" className="px-8 py-3 bg-transparent border-2 border-white rounded-full font-semibold hover:bg-white/10 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Everything You Need In One Place
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border ${feature.borderColor} ${feature.bgColor} hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link 
                  href={feature.link}
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  Explore <span className="ml-1">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Seamlessly Connected Experience
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform integrates social networking, e-commerce, e-learning, 
                job marketplace, and content publishing into one cohesive ecosystem.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Link all your external profiles and websites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Showcase certificates earned on your job profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Discover related courses while shopping for products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Interactive product pages with technical specs and previews</span>
                </li>
              </ul>
              <Link 
                href="/features"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all inline-block"
              >
                Discover All Features
              </Link>
            </div>
            <div className="md:w-1/2 bg-white p-4 rounded-xl shadow-lg">
              {/* Placeholder for integration diagram/image */}
              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-400">Integration Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Create your account today and experience the future of digital interaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all"
            >
              Sign Up Free
            </Link>
            <Link 
              href="/business" 
              className="px-8 py-3 bg-transparent border-2 border-white rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Business Solutions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
