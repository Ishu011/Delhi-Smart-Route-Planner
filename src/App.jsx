import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Route, Share2, Moon, Sun, Zap, Wind } from 'lucide-react';
import MapView from './components/MapView';
import RouteCard from './components/RouteCard';
import QRShare from './components/QRShare';
import { dijkstra } from './utils/dijkstra';
import { bfsAlternatives } from './utils/bfs';
import { buildAdjacencyList, calculateDistance, estimateTime } from './utils/graphUtils';
import { DELHI_NODES, DELHI_EDGES, generateTrafficData, generateAQIData } from './data/delhiGraph';

function App() {
  const [selectedSource, setSelectedSource] = useState('CP');
  const [selectedDestination, setSelectedDestination] = useState('QUTUB');
  const [darkMode, setDarkMode] = useState(false);
  const [trafficData, setTrafficData] = useState({});
  const [aqiData, setAQIData] = useState({});
  const [routes, setRoutes] = useState({ best: null, alternatives: [] });
  const [isCalculating, setIsCalculating] = useState(false);

  // Generate initial traffic and AQI data
  useEffect(() => {
    const updateRealTimeData = () => {
      setTrafficData(generateTrafficData());
      setAQIData(generateAQIData());
    };
    
    updateRealTimeData();
    const interval = setInterval(updateRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Apply traffic multipliers to edges
  const trafficAdjustedEdges = useMemo(() => {
    return DELHI_EDGES.map(edge => {
      const trafficMultiplier = trafficData[`${edge.u}-${edge.v}`] || trafficData[`${edge.v}-${edge.u}`] || 1;
      return {
        ...edge,
        weight: edge.weight * trafficMultiplier,
        trafficLevel: trafficMultiplier < 1.3 ? 'low' : trafficMultiplier < 1.8 ? 'medium' : 'high'
      };
    });
  }, [trafficData]);

  const adjacencyList = useMemo(() => buildAdjacencyList(trafficAdjustedEdges), [trafficAdjustedEdges]);

  const calculateRoutes = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Calculate best route using Dijkstra
      const dijkstraResult = dijkstra(adjacencyList, selectedSource, selectedDestination);
      
      // Calculate alternative routes using BFS
      const alternatives = bfsAlternatives(adjacencyList, selectedSource, selectedDestination, 3);
      
      const bestRoute = {
        path: dijkstraResult.path,
        distance: dijkstraResult.distance,
        time: estimateTime(dijkstraResult.distance),
        algorithm: 'Dijkstra (Shortest Path)'
      };

      const alternativeRoutes = alternatives.map((path, index) => ({
        path,
        distance: calculateDistance(trafficAdjustedEdges, path),
        time: estimateTime(calculateDistance(trafficAdjustedEdges, path)),
        algorithm: `Alternative ${index + 1} (BFS)`
      }));

      setRoutes({ best: bestRoute, alternatives: alternativeRoutes });
      setIsCalculating(false);
    }, 1000);
  };

  const shareUrl = `${window.location.origin}?from=${selectedSource}&to=${selectedDestination}`;

  const nodeOptions = Object.entries(DELHI_NODES).map(([id, node]) => ({
    value: id,
    label: node.name
  }));

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-emerald-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Delhi Smart Route Planner</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Graph-based optimal routing</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Route Planning */}
          <div className="lg:col-span-1 space-y-6">
            {/* Route Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plan Your Route</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source Location
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    {nodeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    {nodeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={calculateRoutes}
                  disabled={isCalculating}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Route className="h-5 w-5" />
                      <span>Find Best Routes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Traffic & AQI Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Data</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Traffic Status</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                    <Wind className="h-4 w-4" />
                    <span>Average AQI</span>
                  </span>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {Math.round(Object.values(aqiData).reduce((a, b) => a + b, 0) / Object.keys(aqiData).length) || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Route */}
            {routes.best && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Share2 className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Route</h3>
                </div>
                <QRShare url={shareUrl} />
              </div>
            )}
          </div>

          {/* Right Panel - Map and Routes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <MapView
                nodes={DELHI_NODES}
                edges={trafficAdjustedEdges}
                bestRoute={routes.best?.path || []}
                alternativeRoutes={routes.alternatives.map(r => r.path)}
                aqiData={aqiData}
                darkMode={darkMode}
              />
            </div>

            {/* Route Results */}
            {routes.best && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Route Options</h3>
                
                <RouteCard
                  route={routes.best}
                  nodes={DELHI_NODES}
                  isPrimary={true}
                  darkMode={darkMode}
                />
                
                {routes.alternatives.map((route, index) => (
                  <RouteCard
                    key={index}
                    route={route}
                    nodes={DELHI_NODES}
                    isPrimary={false}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;