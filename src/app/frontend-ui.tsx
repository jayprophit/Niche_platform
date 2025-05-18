// Frontend UI with modern design system
const theme = {
  colors: {
    primary: {
      main: '#2563eb', // Modern blue
      light: '#60a5fa',
      dark: '#1e40af'
    },
    secondary: {
      main: '#10b981', // Fresh green
      light: '#34d399',
      dark: '#059669'
    },
    accent: {
      main: '#8b5cf6', // Vibrant purple
      light: '#a78bfa',
      dark: '#6d28d9'
    },
    neutral: {
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280'
    },
    background: {
      light: '#ffffff',
      dark: '#111827',
      alt: '#f9fafb'
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Plus Jakarta Sans, sans-serif'
  }
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background-light">
      <Navigation />
      <MainContent />
      <RightSidebar />
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg">
      <div className="p-6">
        <Logo />
        <MenuItems />
      </div>
    </nav>
  );
};

const MainContent = () => {
  return (
    <main className="ml-64 p-8">
      <Header />
      <ContentTabs />
      <ContentArea />
    </main>
  );
};

const ContentTabs = () => {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="flex space-x-2 mb-6">
      <TabButton 
        label="Learn" 
        icon={Book} 
        active={activeTab === 'learn'} 
        onClick={() => setActiveTab('learn')} 
      />
      <TabButton 
        label="Shop" 
        icon={ShoppingCart} 
        active={activeTab === 'shop'} 
        onClick={() => setActiveTab('shop')} 
      />
      <TabButton 
        label="Community" 
        icon={Users} 
        active={activeTab === 'community'} 
        onClick={() => setActiveTab('community')} 
      />
    </div>
  );
};

const ContentArea = () => {
  const [activeView, setActiveView] = useState('learn');

  return (
    <div className="grid grid-cols-12 gap-6">
      {activeView === 'learn' && <LearningView />}
      {activeView === 'shop' && <ShopView />}
      {activeView === 'community' && <CommunityView />}
    </div>
  );
};

const LearningView = () => {
  return (
    <div className="col-span-12">
      <div className="grid grid-cols-3 gap-6">
        <CourseCard 
          title="Advanced Web Development"
          instructor="John Doe"
          level="Intermediate"
          rating={4.8}
          students={1234}
          image="/course-1.jpg"
        />
        {/* More course cards */}
      </div>
    </div>
  );
};

const ShopView = () => {
  return (
    <div className="col-span-12">
      <div className="grid grid-cols-4 gap-6">
        <ProductCard
          title="Arduino Pro Kit"
          price={89.99}
          rating={4.9}
          sales={523}
          image="/product-1.jpg"
        />
        {/* More product cards */}
      </div>
    </div>
  );
};

// Reusable Components
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const baseClasses = 'rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-primary-main hover:bg-primary-dark text-white',
    secondary: 'bg-secondary-main hover:bg-secondary-dark text-white',
    outline: 'border-2 border-primary-main text-primary-main hover:bg-primary-main hover:text-white'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const TabButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-primary-main text-white' 
        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
    }`}
  >
    <Icon className="w-5 h-5 mr-2" />
    {label}
  </button>
);

export { Dashboard, theme };