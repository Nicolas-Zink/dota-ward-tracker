import React, { useState } from 'react';
import WardHeatmap from './WardHeatmap';

const App = () => {
  const [formData, setFormData] = useState({
    accountId: '',
    numGames: 100,
    isRadiant: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wardData, setWardData] = useState(null);

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
      
      // Add team filter if not 'all'
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Dota 2 Ward Tracker
        </h1>
        
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
    </div>
  );
};

export default App;