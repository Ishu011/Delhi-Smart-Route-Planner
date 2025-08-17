import React from 'react';
import { Clock, MapPin, Route, Zap } from 'lucide-react';

const RouteCard = ({ route, nodes, isPrimary = false, darkMode = false }) => {
  const routeNames = route.path?.map(nodeId => nodes[nodeId]?.name || nodeId).join(' → ') || '';
  
  const getStatusBadge = () => {
    if (isPrimary) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Zap className="h-3 w-3 mr-1" />
          Optimal
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        <Route className="h-3 w-3 mr-1" />
        Alternative
      </span>
    );
  };

  return (
    <div className={`
      p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl
      ${isPrimary 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {route.algorithm}
            </h4>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {routeNames}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="h-4 w-4 text-blue-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {route.distance?.toFixed(1) || '0.0'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">km</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-green-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {route.time || '0'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">min</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Route className="h-4 w-4 text-purple-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {route.path?.length || 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">stops</div>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;