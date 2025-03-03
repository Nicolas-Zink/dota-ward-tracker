import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import WardHeatmap from './WardHeatmap';

// Ad component for reusability
const AdBanner = ({ className }) => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isDevelopment) {
    return (
      <div className={`${className} bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center`}>
        <p className="text-gray-500 text-sm font-medium">Ad Placeholder</p>
      </div>
    );
  }

  useEffect(() => {
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="your-ad-client-id"
        data-ad-slot="your-ad-slot"
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
    </div>
  );
};

const App = () => {
  const [formData, setFormData] = useState({
    accountId: '',
    numGames: 100,
    isRadiant: 'all'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wardData, setWardData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing token in localStorage on component mount
    const token = localStorage.getItem('google_token');
    if (token) {
      setUser(JSON.parse(token));
    }
  }, []);

  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userData = {
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      token: token
    };
    setUser(userData);
    localStorage.setItem('google_token', JSON.stringify(userData));
  };

  const handleError = () => {
    setError('Login Failed');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('google_token');
    setWardData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchWardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `https://api.opendota.com/api/players/${formData.accountId}/wardmap?limit=${formData.numGames}`;
      
      if (formData.isRadiant !== 'all') {
        url += `&is_radiant=${formData.isRadiant === 'true'}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch ward data');
      }

      const data = await response.json();
      setWardData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ward data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWardData();
  };

  const content = !user ? (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Dota 2 Ward Tracker
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 mb-4">Sign in to access the ward tracker</p>
          
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Dota 2 Ward Tracker
        </h1>
        <div className="flex items-center gap-4">
          {user.picture && (
            <img 
              src={user.picture} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label 
            htmlFor="accountId" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Account ID
          </label>
          <input
            id="accountId"
            name="accountId"
            type="text"
            required
            value={formData.accountId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter Dota 2 Account ID"
          />
        </div>

        <div>
          <label 
            htmlFor="numGames" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Games
          </label>
          <input
            id="numGames"
            name="numGames"
            type="number"
            min="1"
            max="500"
            value={formData.numGames}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label 
            htmlFor="isRadiant" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Team Filter
          </label>
          <select
            id="isRadiant"
            name="isRadiant"
            value={formData.isRadiant}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Games</option>
            <option value="true">Radiant Only</option>
            <option value="false">Dire Only</option>
          </select>
        </div>

        <div className="mt-8">
          <input 
            type="submit" 
            value={loading ? "Loading..." : "Generate Heatmap"}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
      </form>

      {wardData && <WardHeatmap wardData={wardData} />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Three-column layout */}
      <div className="flex justify-center px-4 py-12">
        {/* Left ad - hidden on mobile */}
        <div className="hidden lg:block w-64 mr-8">
          <div className="sticky top-8">
            <AdBanner className="w-64 h-full" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 max-w-xl">
          {content}
        </div>

        {/* Right ad - hidden on mobile */}
        <div className="hidden lg:block w-64 ml-8">
          <div className="sticky top-8">
            <AdBanner className="w-64 h-full" />
          </div>
        </div>
      </div>

      {/* Mobile ad - only shown on mobile */}
      <div className="lg:hidden px-4 py-6">
        <AdBanner className="w-full h-32" />
      </div>
    </div>
  );
};

export default App;