import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Star,
  Play,
  ChevronDown,
  CreditCard
} from 'lucide-react';

const EnhancedMarketplace = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    level: 'all'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} />
      <SearchAndFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
      />
      <MainContent 
        searchQuery={searchQuery}
        filters={filters}
        onAddToCart={(item) => setCart([...cart, item])}
      />
      {cart.length > 0 && <Cart cart={cart} setCart={setCart} />}
    </div>
  );
};

const Header = ({ cart }) => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Learning Marketplace</h1>
      <button className="relative">
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  </header>
);

const SearchAndFilters = ({ searchQuery, setSearchQuery, filters, setFilters }) => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses and products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
        <select
          value={filters.priceRange}
          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-100">$51 - $100</option>
          <option value="101+">$101+</option>
        </select>
      </div>
    </div>
  </div>
);

const MainContent = ({ searchQuery, filters, onAddToCart }) => {
  const filteredItems = getFilteredItems(searchQuery, filters);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

const ItemCard = ({ item, onAddToCart }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <div className="flex items-center space-x-2">
              <Rating value={item.rating} />
              <span className="text-sm text-gray-500">
                ({item.reviewCount} reviews)
              </span>
            </div>
          </div>
          <span className="text-xl font-bold">${item.price}</span>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600">{item.description}</p>
          {item.preview && (
            <button 
              onClick={() => setShowPreview(true)}
              className="mt-2 flex items-center text-indigo-600"
            >
              <Play className="w-4 h-4 mr-1" />
              Watch Preview
            </button>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">What you'll learn:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {item.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center">
                <span className="mr-2">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t">
        <button 
          onClick={() => onAddToCart(item)}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Add to Cart
        </button>
      </div>

      {showPreview && (
        <PreviewModal 
          preview={item.preview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

const Rating = ({ value }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))}
  </div>
);

const Cart = ({ cart, setCart }) => (
  <div className="fixed bottom-0 right-0 w-96 bg-white shadow-lg rounded-t-lg">
    <div className="p-4 border-b">
      <h2 className="font-semibold">Shopping Cart ({cart.length} items)</h2>
    </div>
    <div className="p-4 max-h-96 overflow-auto">
      {cart.map(item => (
        <CartItem 
          key={item.id} 
          item={item}
          onRemove={() => {
            setCart(cart.filter(i => i.id !== item.id));
          }}
        />
      ))}
    </div>
    <div className="p-4 border-t">
      <div className="flex justify-between mb-4">
        <span>Total:</span>
        <span className="font-bold">
          ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
        </span>
      </div>
      <button 
        onClick={() => {/* Implement checkout */}}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        Checkout
      </button>
    </div>
  </div>
);

const CartItem = ({ item, onRemove }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <h4 className="font-medium">{item.title}</h4>
      <span className="text-sm text-gray-500">${item.price}</span>
    </div>
    <button 
      onClick={onRemove}
      className="text-red-500 hover:text-red-700"
    >
      Remove
    </button>
  </div>
);

export default EnhancedMarketplace;