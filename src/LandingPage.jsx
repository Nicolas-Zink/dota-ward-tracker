import React from 'react';

const LandingPage = ({ onSignIn }) => {
  return (
    <>
      {/* Top Navigation Bar with Sign In Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">Dota 2 Ward Tracker</div>
          <button
            onClick={onSignIn}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Dota 2 Ward Tracker
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analyze Your Ward Placements</h2>
            <p className="text-gray-600 mb-4">
              Take your Dota 2 gameplay to the next level by analyzing your and other players ward placements. 
              Our Ward Tracker generates heatmaps showing where players place observer and 
              sentry wards, helping you identify patterns and improve your vision game.
            </p>
            
            <div className="flex justify-center mb-6">
              <img 
                src="/sample-heatmap.jpg" 
                alt="Sample Ward Heatmap" 
                className="border border-gray-200 rounded-lg max-w-full shadow-sm"
                onError={(e) => {
                  e.target.src = 'https://i.imgur.com/JYlJu7G.png'; // Fallback image
                  e.target.style.maxWidth = '500px';
                }}
              />
            </div>
            
            <p className="text-gray-600">
              Simply sign in with your Google account, enter a Dota 2 Account ID, 
              and instantly visualize the ward placement patterns across recent matches.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span> 
                  Generate ward heatmaps from your recent matches
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span> 
                  Filter by team (Radiant/Dire)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span> 
                  Compare with pro player ward patterns
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span> 
                  Save and share your heatmaps
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Sign in with Google</li>
                <li>Enter your Dota 2 Account ID</li>
                <li>Specify the number of recent games to analyze</li>
                <li>Generate your personalized ward heatmap</li>
                <li>Compare with pro players to improve your warding</li>
              </ol>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <p className="text-gray-600 mb-4">Ready to improve your vision game?</p>
            <button
              onClick={onSignIn}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span className="font-medium">Sign in with Google</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">
              We use the OpenDota API to fetch your ward data. Your account information is kept private.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Analyze Ward Placement?</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Vision is one of the most critical aspects of Dota 2. Proper ward placement can give your team 
              a significant advantage by revealing enemy movements, protecting key objectives, and enabling 
              successful ganks.
            </p>
            <p>
              By analyzing where you typically place wards and comparing your patterns with professional players, 
              you can identify blind spots in your vision game and optimize your ward placements for maximum 
              effectiveness.
            </p>
            <p>
              Start tracking your wards today and take your support game to the next level!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;