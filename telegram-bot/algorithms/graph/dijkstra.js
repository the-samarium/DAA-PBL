/**
 * Dijkstra's Algorithm Implementation for Finding Nearest Equipment
 * 
 * DAA Concept: Graph Algorithms - Shortest Path
 * Time Complexity: O(V²) or O(E log V) with priority queue
 * Space Complexity: O(V)
 * 
 * Use Case: Find nearest harvesters based on user location
 */

export class DijkstraAlgorithm {
  constructor(graph) {
    this.graph = graph; // Adjacency list representation
  }

  /**
   * Dijkstra's algorithm using priority queue
   * @param {string} startNode - Starting location/node
   * @param {string} endNode - Target location/node (optional)
   * @returns {Object} - Shortest distances and paths
   */
  findShortestPath(startNode, endNode = null) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    const visited = new Set();

    // Initialize distances
    for (const node in this.graph) {
      distances[node] = Infinity;
      previous[node] = null;
      unvisited.add(node);
    }
    distances[startNode] = 0;

    // Priority queue (min-heap would be ideal, but using array for simplicity)
    const priorityQueue = [[startNode, 0]];

    while (priorityQueue.length > 0 && unvisited.size > 0) {
      // Extract minimum (O(n) - would be O(log n) with proper heap)
      priorityQueue.sort((a, b) => a[1] - b[1]);
      const [currentNode, currentDistance] = priorityQueue.shift();

      if (visited.has(currentNode)) continue;
      
      visited.add(currentNode);
      unvisited.delete(currentNode);

      // Early termination if target reached
      if (endNode && currentNode === endNode) {
        break;
      }

      // Relax edges
      const neighbors = this.graph[currentNode] || [];
      for (const [neighbor, edgeWeight] of neighbors) {
        if (!unvisited.has(neighbor)) continue;

        const newDistance = currentDistance + edgeWeight;
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentNode;
          priorityQueue.push([neighbor, newDistance]);
        }
      }
    }

    return { distances, previous };
  }

  /**
   * Reconstruct path from start to end node
   * @param {string} startNode 
   * @param {string} endNode 
   * @param {Object} previous 
   * @returns {Array} Path array
   */
  reconstructPath(startNode, endNode, previous) {
    const path = [];
    let currentNode = endNode;

    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }

    return path[0] === startNode ? path : [];
  }

  /**
   * Find nearest equipment locations
   * @param {string} userLocation 
   * @param {Array} equipmentLocations 
   * @param {number} maxResults 
   * @returns {Array} Sorted nearest equipment
   */
  findNearestEquipment(userLocation, equipmentLocations, maxResults = 5) {
    const { distances } = this.findShortestPath(userLocation);
    
    const results = equipmentLocations
      .map(loc => ({
        ...loc,
        distance: distances[loc.id] || Infinity
      }))
      .filter(loc => loc.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);

    return results;
  }
}

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * Time Complexity: O(1)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

