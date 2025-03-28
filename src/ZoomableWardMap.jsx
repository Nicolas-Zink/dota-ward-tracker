import React, { useState, useRef, useEffect } from 'react';
import WardHeatmap from './WardHeatmap';

const ZoomableWardMap = ({ wardData, label }) => {
  const [showZoom, setShowZoom] = useState(false);
  const mapContainerRef = useRef(null);
  
  // Function to hide the "Ward Placement Heatmap" title if it exists
  useEffect(() => {
    if (mapContainerRef.current) {
      // Target common title elements that might exist
      const titleElements = mapContainerRef.current.querySelectorAll(
        'h2, .ward-heatmap-title, .heatmap-title'
      );
      
      // Hide each title element
      titleElements.forEach(el => {
        if (el.textContent.includes('Ward Placement') || 
            el.textContent.includes('Heatmap')) {
          el.style.display = 'none';
        }
      });
    }
  }, [wardData, showZoom]);

  // Function to set up click listeners once the component is mounted
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Find the canvas element inside the container
    const canvasElement = mapContainerRef.current.querySelector('canvas');
    
    if (canvasElement) {
      // Add click event only to the canvas
      const handleCanvasClick = () => setShowZoom(true);
      canvasElement.addEventListener('click', handleCanvasClick);
      
      // Cleanup function
      return () => {
        canvasElement.removeEventListener('click', handleCanvasClick);
      };
    }
  }, [wardData]); // Re-run when ward data changes as it might rebuild the canvas

  return (
    <div className="relative">
      {/* Thumbnail view */}
      <div 
        ref={mapContainerRef}
        className="ward-map-container"
      >
        <style>{`
          /* Hide Ward Placement Heatmap title in the component */
          .ward-map-container h2,
          .ward-map-container .ward-heatmap-title,
          .ward-map-container .heatmap-title {
            display: none;
          }
          
          /* Make just the canvas show a pointer cursor */
          .ward-map-container canvas {
            cursor: zoom-in;
          }
        `}</style>
        <WardHeatmap wardData={wardData} />
      </div>

      {/* Zoomed view - transparent background */}
      {showZoom && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowZoom(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl"
            style={{ width: '600px', maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">{label}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowZoom(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4 ward-popup-content">
              <WardHeatmap wardData={wardData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomableWardMap;