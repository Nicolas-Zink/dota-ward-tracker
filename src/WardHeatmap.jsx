import React, { useEffect, useRef, useState } from 'react';

const WardHeatmap = ({ wardData }) => {
  const canvasRef = useRef(null);
  const [showObservers, setShowObservers] = useState(true);
  const [showSentries, setShowSentries] = useState(false);
  const MAP_SIZE = 400;

  const convertToCanvasCoords = (x, y) => {
    const normalizedX = (x - 80) / (190 - 80);
    const normalizedY = (y - 65) / (95 - 65);
    return [normalizedX * MAP_SIZE, normalizedY * MAP_SIZE];
  };

  const drawWardSpot = (ctx, x, y, count, type) => {
    try {
      const [canvasX, canvasY] = convertToCanvasCoords(x, y);
      
      const radius = Math.min(25, Math.max(15, Math.sqrt(count) * 8));
      const alpha = Math.min(1, 0.6 + (count / 8));

      // Simpler color definitions
      const isObserver = type === 'observer';
      const glowColor = isObserver ? 'rgba(255, 255, 0,' : 'rgba(0, 191, 255,';
      const mainColor = isObserver ? 'rgba(255, 255, 100,' : 'rgba(100, 219, 255,';

      // Draw outer glow
      const outerGradient = ctx.createRadialGradient(
        canvasX, canvasY, 0,
        canvasX, canvasY, radius * 2
      );
      
      outerGradient.addColorStop(0, `${glowColor}${alpha * 0.7})`);
      outerGradient.addColorStop(1, `${glowColor}0)`);

      ctx.beginPath();
      ctx.fillStyle = outerGradient;
      ctx.arc(canvasX, canvasY, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw main circle
      ctx.beginPath();
      ctx.fillStyle = `${mainColor}${alpha})`;
      ctx.arc(canvasX, canvasY, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Add white border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add count number if more than 2 wards
      if (count > 2) {
        ctx.font = `${Math.min(radius * 1.2, 20)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw text outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeText(count.toString(), canvasX, canvasY);
        
        // Draw actual text
        ctx.fillStyle = 'black';
        ctx.fillText(count.toString(), canvasX, canvasY);
      }

    } catch (error) {
      console.error('Error drawing ward spot:', error);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !wardData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);

    const mapImage = new Image();
    mapImage.src = '/minimap.jpg';
    
    mapImage.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(mapImage, 0, 0, MAP_SIZE, MAP_SIZE);

      // Draw observer wards
      if (showObservers && wardData.obs) {
        Object.entries(wardData.obs).forEach(([yPos, xPositions]) => {
          const y = parseInt(yPos);
          Object.entries(xPositions).forEach(([x, count]) => {
            drawWardSpot(ctx, parseInt(x), y, count, 'observer');
          });
        });
      }

      // Draw sentry wards
      if (showSentries && wardData.sen) {
        Object.entries(wardData.sen).forEach(([yPos, xPositions]) => {
          const y = parseInt(yPos);
          Object.entries(xPositions).forEach(([x, count]) => {
            drawWardSpot(ctx, parseInt(x), y, count, 'sentry');
          });
        });
      }
    };
  }, [wardData, showObservers, showSentries]);

  return (
    <div className="mt-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ward Placement Heatmap</h2>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showObservers}
                onChange={(e) => setShowObservers(e.target.checked)}
                className="mr-2"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-sm">Observer Wards</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showSentries}
                onChange={(e) => setShowSentries(e.target.checked)}
                className="mr-2"
              />
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span className="text-sm">Sentry Wards</span>
            </label>
          </div>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={MAP_SIZE}
            height={MAP_SIZE}
            className="w-full border border-gray-200 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default WardHeatmap;