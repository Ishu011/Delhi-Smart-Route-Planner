// Dijkstra's algorithm for shortest path
export const dijkstra = (adjacencyList, start, end) => {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set();

  // Initialize distances and add all nodes to unvisited set
  for (const node in adjacencyList) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  }

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    }

    if (currentNode === null || minDistance === Infinity) break;
    if (currentNode === end) break;

    unvisited.delete(currentNode);
    visited.add(currentNode);

    // Update distances to neighbors
    const neighbors = adjacencyList[currentNode] || [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue;

      const tentativeDistance = distances[currentNode] + neighbor.weight;
      if (tentativeDistance < distances[neighbor.node]) {
        distances[neighbor.node] = tentativeDistance;
        previous[neighbor.node] = currentNode;
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  // If no path exists, return empty path
  if (path[0] !== start) {
    return { path: [], distance: Infinity };
  }

  return {
    path,
    distance: distances[end]
  };
};