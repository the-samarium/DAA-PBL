/**
 * Graph Builder for Equipment Location Network
 * 
 * DAA Concept: Graph Data Structure
 * Builds adjacency list representation for Dijkstra's algorithm
 */

export class GraphBuilder {
  constructor() {
    this.graph = {};
    this.locations = new Map();
  }

  /**
   * Add a node (location) to the graph
   * Time Complexity: O(1)
   */
  addNode(nodeId, latitude, longitude, metadata = {}) {
    this.locations.set(nodeId, {
      id: nodeId,
      latitude,
      longitude,
      ...metadata
    });

    if (!this.graph[nodeId]) {
      this.graph[nodeId] = [];
    }
  }

  /**
   * Add an edge between two nodes
   * Time Complexity: O(1)
   */
  addEdge(fromNode, toNode, weight = null) {
    if (!this.graph[fromNode]) {
      this.graph[fromNode] = [];
    }

    // Calculate weight if not provided (using coordinates)
    if (weight === null) {
      const fromLoc = this.locations.get(fromNode);
      const toLoc = this.locations.get(toNode);
      
      if (fromLoc && toLoc) {
        weight = this.calculateDistance(
          fromLoc.latitude,
          fromLoc.longitude,
          toLoc.latitude,
          toLoc.longitude
        );
      } else {
        weight = 1; // Default weight
      }
    }

    this.graph[fromNode].push([toNode, weight]);
  }

  /**
   * Build graph from equipment data
   * Time Complexity: O(n²) for complete graph, O(n) for linear connections
   */
  buildFromEquipment(equipmentList) {
    // Add all equipment as nodes
    equipmentList.forEach(eq => {
      if (eq.latitude && eq.longitude) {
        this.addNode(eq.id, eq.latitude, eq.longitude, {
          name: eq.name,
          price: eq.price_per_day,
          available: eq.available
        });
      }
    });

    // Connect nearby nodes (within threshold)
    const threshold = 50; // km
    const nodeIds = Array.from(this.locations.keys());

    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const loc1 = this.locations.get(nodeIds[i]);
        const loc2 = this.locations.get(nodeIds[j]);

        const distance = this.calculateDistance(
          loc1.latitude,
          loc1.longitude,
          loc2.latitude,
          loc2.longitude
        );

        // Add edge if within threshold (creating sparse graph)
        if (distance <= threshold) {
          this.addEdge(nodeIds[i], nodeIds[j], distance);
          this.addEdge(nodeIds[j], nodeIds[i], distance); // Undirected graph
        }
      }
    }

    return this.graph;
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get graph representation
   */
  getGraph() {
    return this.graph;
  }

  /**
   * Get all locations
   */
  getLocations() {
    return Array.from(this.locations.values());
  }
}

