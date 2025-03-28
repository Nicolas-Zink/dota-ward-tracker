import React, { useState, useEffect, useRef } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import WardHeatmap from './WardHeatmap';
import ProPlayerComparison from './ProPlayerComparison';
import SaveAndShare from './SaveAndShare';
import LandingPage from './LandingPage';

const AdBanner = ({ className }) => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Show placeholder in development
  if (isDevelopment) {
    return (
      <div className={`${className} bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center`}>
        <p className="text-gray-500 text-sm font-medium">Ad Placeholder</p>
      </div>
    );
  }

  useEffect(() => {
    // Initialize ads after component mounts
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense Publisher ID
        data-ad-slot="XXXXXXXXXX" // Replace with your ad slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
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
  const wardMapRef = useRef(null);

  useEffect(() => {
    // Check for authentication state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          email: user.email,
          name: user.displayName,
          picture: user.photoURL,
          uid: user.uid
        };
        setUser(userData);
        localStorage.setItem('google_token', JSON.stringify(userData));
      } else {
        // Check for existing token in localStorage as fallback
        const token = localStorage.getItem('google_token');
        if (token) {
          setUser(JSON.parse(token));
        }
      }
    });

    // Check for shared URL parameters
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('shared');
    
    if (sharedParam === 'true') {
      const accountId = params.get('accountId');
      const numGames = params.get('games');
      const isRadiant = params.get('team');
      
      if (accountId) {
        setFormData({
          accountId,
          numGames: numGames || '100',
          isRadiant: isRadiant || 'all'
        });
        
        // We'll fetch ward data after authentication is checked
      }
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Effect to handle auto-fetching for shared links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('shared');
    
    if (sharedParam === 'true' && user && formData.accountId) {
      fetchWardData();
    }
  }, [user, formData.accountId]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info
      const user = result.user;
      
      const userData = {
        email: user.email,
        name: user.displayName,
        picture: user.photoURL,
        token: token,
        uid: user.uid
      };
      
      setUser(userData);
      localStorage.setItem('google_token', JSON.stringify(userData));
    } catch (error) {
      setError(`Login Failed: ${error.message}`);
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      setUser(null);
      localStorage.removeItem('google_token');
      setWardData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(`Sign out failed: ${error.message}`);
    }
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

  // Render landing page if user is not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LandingPage onSignIn={handleGoogleSignIn} />
        
        {error && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Content for logged in users
  const loggedInContent = (
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

      {wardData && (
        <div className="mt-8">
          <div ref={wardMapRef}>
            <WardHeatmap wardData={wardData} />
          </div>
          
          <SaveAndShare 
            wardMapRef={wardMapRef} 
            playerInfo={{
              accountId: formData.accountId,
              numGames: formData.numGames,
              isRadiant: formData.isRadiant
            }}
          />
          
          <ProPlayerComparison 
            userWardData={wardData} 
            userAccountId={formData.accountId}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center px-4 py-12">
        {/* Left ad - only shown when user has content */}
        {user && wardData && (
          <div className="hidden lg:block w-64 mr-8">
            <div className="sticky top-8">
              <AdBanner className="w-64 h-full" />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 max-w-xl">
          {loggedInContent}
        </div>

        {/* Right ad - only shown when user has content */}
        {user && wardData && (
          <div className="hidden lg:block w-64 ml-8">
            <div className="sticky top-8">
              <AdBanner className="w-64 h-full" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile ad - only shown on mobile when user has content */}
      {user && wardData && (
        <div className="lg:hidden px-4 py-6">
          <AdBanner className="w-full h-32" />
        </div>
      )}
    </div>
  );
};

export default App;