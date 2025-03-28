import React, { useState, useEffect } from 'react';
import WardHeatmap from './WardHeatmap';
import ZoomableWardMap from './ZoomableWardMap';

const ProPlayerComparison = ({ userWardData, userAccountId }) => {
  const [proPlayers, setProPlayers] = useState([]);
  const [selectedProId, setSelectedProId] = useState('');
  const [proWardData, setProWardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get pro player info
  const getProPlayerInfo = (id) => {
    if (!proPlayers || !id) return { name: 'Unknown', team: 'No team' };
    const player = proPlayers.find(p => p.account_id.toString() === id.toString());
    return {
      name: player?.name || 'Unknown',
      team: player?.team_name || 'No team'
    };
  };

  // Fetch list of pro players when component mounts
  useEffect(() => {
    const fetchProPlayers = async () => {
      try {
        const response = await fetch('https://api.opendota.com/api/proPlayers');
        if (!response.ok) {
          throw new Error('Failed to fetch pro players');
        }
        const data = await response.json();
        setProPlayers(data);
      } catch (err) {
        setError("Couldn't load pro players: " + err.message);
        console.error('Error fetching pro players:', err);
      }
    };

    fetchProPlayers();
  }, []);

  // Fetch pro player ward data when a pro player is selected
  const fetchProWardData = async (proId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.opendota.com/api/players/${proId}/wardmap?limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch pro player ward data');
      }

      const data = await response.json();
      setProWardData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pro ward data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProPlayerChange = (e) => {
    const proId = e.target.value;
    setSelectedProId(proId);
    if (proId) {
      fetchProWardData(proId);
    } else {
      setProWardData(null);
    }
  };

  // Get player info for the selected pro
  const proInfo = getProPlayerInfo(selectedProId);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare with Pro Players</h2>
      
      <div className="mb-6">
        <label htmlFor="proPlayer" className="block text-sm font-medium text-gray-700 mb-1">
          Select Pro Player
        </label>
        <select
          id="proPlayer"
          value={selectedProId}
          onChange={handleProPlayerChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a pro player</option>
          {proPlayers.map((player) => (
            <option key={player.account_id} value={player.account_id}>
              {player.name} ({player.team_name || 'No team'})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-blue-600">Loading pro player data...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      {userWardData && proWardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 truncate">Your Wards</h3>
            <ZoomableWardMap 
              wardData={userWardData} 
              label={`Your Ward Placement`}
            />
            <p className="text-center text-sm text-gray-600 mt-2 truncate">Account ID: {userAccountId}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 truncate">
              {proInfo.name}'s Wards
            </h3>
            <ZoomableWardMap 
              wardData={proWardData} 
              label={`${proInfo.name}'s Wards`}
            />
            <p className="text-center text-sm text-gray-600 mt-2 truncate">
              Team: {proInfo.team}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProPlayerComparison;