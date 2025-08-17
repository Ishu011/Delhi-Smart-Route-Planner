// Utility functions for graph operations

// Build adjacency list from edges
export const buildAdjacencyList = (edges) => {
  const adjacencyList = {};

  // Initialize adjacency list
  edges.forEach(edge => {
    if (!adjacencyList[edge.u]) adjacencyList[edge.u] = [];
    if (!adjacencyList[edge.v]) adjacencyList[edge.v] = [];
  });

  // Add edges (bidirectional for undirected graph)
  edges.forEach(edge => {
    adjacencyList[edge.u].push({ node: edge.v, weight: edge.weight });
    adjacencyList[edge.v].push({ node: edge.u, weight: edge.weight });
  });

  return adjacencyList;
};

// Calculate total distance for a path
export const calculateDistance = (edges, path) => {
  if (path.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const currentNode = path[i];
    const nextNode = path[i + 1];
    
    const edge = edges.find(e => 
      (e.u === currentNode && e.v === nextNode) || 
      (e.v === currentNode && e.u === nextNode)
    );
    
    if (edge) {
      totalDistance += edge.weight;
    }
  }

  return totalDistance;
};

// Estimate travel time based on distance (assuming average speed of 25 km/h in Delhi traffic)
export const estimateTime = (distanceKm) => {
  const averageSpeedKmh = 25;
  return Math.round((distanceKm / averageSpeedKmh) * 60);
};

// Calculate air quality impact on route
export const calculateAQIImpact = (path, aqiData) => {
  if (path.length === 0) return 0;

  let totalAQI = 0;
  let validNodes = 0;

  path.forEach(nodeId => {
    if (aqiData[nodeId] !== undefined) {
      totalAQI += aqiData[nodeId];
      validNodes++;
    }
  });

  return validNodes > 0 ? totalAQI / validNodes : 0;
};

// Find nodes within a certain distance
export const findNearbyNodes = (nodeId, nodes, maxDistanceKm = 5) => {
  const targetNode = nodes[nodeId];
  if (!targetNode) return [];

  return Object.entries(nodes)
    .filter(([id, node]) => {
      if (id === nodeId) return false;
      const distance = calculateHaversineDistance(
        targetNode.coordinate[0], targetNode.coordinate[1],
        node.coordinate[0], node.coordinate[1]
      );
      return distance <= maxDistanceKm;
    })
    .map(([id, node]) => ({ id, ...node }));
};

// Calculate distance between two coordinates using Haversine formula
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};