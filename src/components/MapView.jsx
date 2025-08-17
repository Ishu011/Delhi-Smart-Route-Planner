import React from 'react';

const MapView = ({ nodes, edges, bestRoute, alternativeRoutes, aqiData, darkMode }) => {
  // Create a visual representation of the Delhi graph
  const svgWidth = 800;
  const svgHeight = 600;
  
  // Position nodes in a layout that resembles Delhi's geography
  const nodePositions = {
    CP: { x: 400, y: 250 },      // Central
    IG: { x: 450, y: 280 },      // East of CP
    AIIMS: { x: 350, y: 350 },   // Southwest of CP
    NDR: { x: 380, y: 200 },     // North of CP
    ISBT: { x: 420, y: 150 },    // North of NDR
    HK: { x: 300, y: 400 },      // South of AIIMS
    IIT: { x: 280, y: 420 },     // West of HK
    QUTUB: { x: 250, y: 450 },   // Southwest of IIT
    DU: { x: 350, y: 180 },      // North of CP
    LOTUS: { x: 480, y: 380 },   // Southeast
    AIRPORT: { x: 200, y: 300 }, // West
    GURGAON: { x: 320, y: 500 }  // Southwest
  };

  const getTrafficColor = (trafficLevel) => {
    switch (trafficLevel) {
      case 'low': return '#10b981';    // green
      case 'medium': return '#f59e0b'; // yellow
      case 'high': return '#ef4444';   // red
      default: return '#6b7280';       // gray
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10b981';   // Good - Green
    if (aqi <= 100) return '#f59e0b';  // Moderate - Yellow
    if (aqi <= 150) return '#f97316';  // Unhealthy for Sensitive - Orange
    if (aqi <= 200) return '#ef4444';  // Unhealthy - Red
    return '#7c2d12';                  // Very Unhealthy - Dark Red
  };

  const isNodeInRoute = (nodeId, routes) => {
    return routes.some(route => route.includes(nodeId));
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Edges */}
        {edges.map((edge, index) => {
          const startPos = nodePositions[edge.u];
          const endPos = nodePositions[edge.v];
          if (!startPos || !endPos) return null;

          const isInBestRoute = bestRoute.length > 1 && 
            ((bestRoute.includes(edge.u) && bestRoute.includes(edge.v)) &&
             (Math.abs(bestRoute.indexOf(edge.u) - bestRoute.indexOf(edge.v)) === 1));

          return (
            <g key={index}>
              {/* Traffic edge */}
              <line
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke={getTrafficColor(edge.trafficLevel)}
                strokeWidth={isInBestRoute ? "6" : "3"}
                opacity={isInBestRoute ? "0.9" : "0.6"}
                strokeDasharray={isInBestRoute ? "0" : "5,5"}
              />
              
              {/* Edge weight label */}
              <text
                x={(startPos.x + endPos.x) / 2}
                y={(startPos.y + endPos.y) / 2}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-300"
                dy="-5"
              >
                {edge.weight.toFixed(1)}km
              </text>
            </g>
          );
        })}

        {/* Alternative route paths */}
        {alternativeRoutes.map((route, routeIndex) => {
          if (route.length < 2) return null;
          
          const pathCoords = route.map(nodeId => nodePositions[nodeId]).filter(Boolean);
          const pathString = pathCoords.map((pos, i) => 
            `${i === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`
          ).join(' ');

          return (
            <path
              key={`alt-${routeIndex}`}
              d={pathString}
              stroke="#8b5cf6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8,4"
              opacity="0.7"
            />
          );
        })}

        {/* Nodes */}
        {Object.entries(nodePositions).map(([nodeId, position]) => {
          const node = nodes[nodeId];
          if (!node) return null;

          const aqi = aqiData[nodeId] || 0;
          const isInAnyRoute = isNodeInRoute(nodeId, [bestRoute, ...alternativeRoutes]);
          const isStart = bestRoute[0] === nodeId;
          const isEnd = bestRoute[bestRoute.length - 1] === nodeId;

          return (
            <g key={nodeId}>
              {/* AQI Circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r="25"
                fill={getAQIColor(aqi)}
                opacity="0.3"
              />
              
              {/* Node circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isInAnyRoute ? "12" : "8"}
                fill={isStart ? "#10b981" : isEnd ? "#ef4444" : "#3b82f6"}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Node label */}
              <text
                x={position.x}
                y={position.y - 35}
                textAnchor="middle"
                className="text-sm font-semibold fill-gray-800 dark:fill-gray-200"
              >
                {node.name}
              </text>
              
              {/* AQI value */}
              <text
                x={position.x}
                y={position.y + 45}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                AQI: {aqi}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Low Traffic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Medium Traffic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Heavy Traffic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Start</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">End</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;