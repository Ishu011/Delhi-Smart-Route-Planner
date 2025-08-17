// BFS algorithm for finding alternative routes
export const bfsAlternatives = (adjacencyList, start, end, maxAlternatives = 3) => {
  const alternatives = [];
  const visited = new Set();

  // Function to perform BFS and find a path
  const findPath = (excludedEdges = new Set()) => {
    const queue = [{ node: start, path: [start] }];
    const currentVisited = new Set();

    while (queue.length > 0) {
      const { node, path } = queue.shift();

      if (node === end) {
        return path;
      }

      if (currentVisited.has(node)) continue;
      currentVisited.add(node);

      const neighbors = adjacencyList[node] || [];
      for (const neighbor of neighbors) {
        const edgeKey = `${node}-${neighbor.node}`;
        const reverseEdgeKey = `${neighbor.node}-${node}`;
        
        if (excludedEdges.has(edgeKey) || excludedEdges.has(reverseEdgeKey)) continue;
        if (path.includes(neighbor.node)) continue;

        queue.push({
          node: neighbor.node,
          path: [...path, neighbor.node]
        });
      }
    }

    return null;
  };

  const usedEdges = new Set();

  // Find multiple alternative paths
  for (let i = 0; i < maxAlternatives; i++) {
    const path = findPath(usedEdges);
    if (!path) break;

    alternatives.push(path);

    // Add edges from this path to excluded edges for next iteration
    for (let j = 0; j < path.length - 1; j++) {
      usedEdges.add(`${path[j]}-${path[j + 1]}`);
    }
  }

  return alternatives;
};