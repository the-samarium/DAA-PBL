/**
 * 0/1 Knapsack Problem using Dynamic Programming
 * 
 * DAA Concept: Dynamic Programming - Optimization Problem
 * Time Complexity: O(n × W) where n is items and W is capacity
 * Space Complexity: O(n × W) for 2D array, O(W) for optimized version
 * 
 * Use Case: Optimize equipment selection within budget constraint
 */

export class KnapsackDP {
  /**
   * Solve 0/1 Knapsack using Dynamic Programming
   * @param {Array} items - Array of {value, weight, data}
   * @param {number} capacity - Maximum capacity (budget)
   * @returns {Object} {maxValue, selectedItems, totalWeight}
   */
  solve(items, capacity) {
    const n = items.length;
    
    // DP table: dp[i][w] = maximum value using first i items with capacity w
    const dp = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));

    // Fill DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const item = items[i - 1];
        
        // Don't include current item
        dp[i][w] = dp[i - 1][w];
        
        // Try including current item if it fits
        if (item.weight <= w) {
          dp[i][w] = Math.max(
            dp[i][w],
            dp[i - 1][w - item.weight] + item.value
          );
        }
      }
    }

    // Reconstruct solution
    const selectedItems = [];
    let w = capacity;
    
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        const item = items[i - 1];
        selectedItems.push(item);
        w -= item.weight;
      }
    }

    return {
      maxValue: dp[n][capacity],
      selectedItems: selectedItems.reverse(),
      totalWeight: selectedItems.reduce((sum, item) => sum + item.weight, 0)
    };
  }

  /**
   * Space-optimized version using 1D array
   * Space Complexity: O(W)
   * @param {Array} items 
   * @param {number} capacity 
   * @returns {Object}
   */
  solveOptimized(items, capacity) {
    const n = items.length;
    const dp = Array(capacity + 1).fill(0);
    const selected = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(false));

    for (let i = 0; i < n; i++) {
      const item = items[i];
      
      // Iterate backwards to avoid using updated values
      for (let w = capacity; w >= item.weight; w--) {
        if (dp[w] < dp[w - item.weight] + item.value) {
          dp[w] = dp[w - item.weight] + item.value;
          selected[i + 1][w] = true;
        }
      }
    }

    // Reconstruct solution
    const selectedItems = [];
    let w = capacity;
    
    for (let i = n; i > 0 && w > 0; i--) {
      if (selected[i][w]) {
        const item = items[i - 1];
        selectedItems.push(item);
        w -= item.weight;
      }
    }

    return {
      maxValue: dp[capacity],
      selectedItems: selectedItems.reverse(),
      totalWeight: selectedItems.reduce((sum, item) => sum + item.weight, 0)
    };
  }

  /**
   * Fractional Knapsack (Greedy Approach)
   * Time Complexity: O(n log n) for sorting
   * Use Case: When items can be divided (not applicable to equipment but included for completeness)
   */
  fractionalKnapsack(items, capacity) {
    // Sort by value/weight ratio (greedy choice)
    const sorted = [...items].sort((a, b) => {
      const ratioA = a.value / a.weight;
      const ratioB = b.value / b.weight;
      return ratioB - ratioA; // Descending
    });

    let remainingCapacity = capacity;
    let totalValue = 0;
    const selectedItems = [];

    for (const item of sorted) {
      if (remainingCapacity >= item.weight) {
        // Take whole item
        selectedItems.push({ ...item, fraction: 1 });
        totalValue += item.value;
        remainingCapacity -= item.weight;
      } else if (remainingCapacity > 0) {
        // Take fraction
        const fraction = remainingCapacity / item.weight;
        selectedItems.push({ ...item, fraction });
        totalValue += item.value * fraction;
        remainingCapacity = 0;
        break;
      }
    }

    return {
      maxValue: totalValue,
      selectedItems,
      totalWeight: capacity - remainingCapacity
    };
  }

  /**
   * Optimize equipment selection within budget
   * @param {Array} equipment - Array of equipment objects
   * @param {number} budget - Maximum budget
   * @param {Function} valueFn - Function to calculate value (e.g., rating * availability)
   * @param {Function} weightFn - Function to get cost/weight
   * @returns {Object}
   */
  optimizeEquipment(equipment, budget, valueFn = null, weightFn = null) {
    // Default value function: rating * availability score
    if (!valueFn) {
      valueFn = (eq) => {
        const rating = eq.rating || 3;
        const availability = eq.available ? 1 : 0.5;
        return rating * availability * 100; // Scale for integer DP
      };
    }

    // Default weight function: price per day
    if (!weightFn) {
      weightFn = (eq) => Math.ceil(eq.price_per_day || 0);
    }

    const items = equipment.map(eq => ({
      value: valueFn(eq),
      weight: weightFn(eq),
      data: eq
    }));

    return this.solveOptimized(items, Math.floor(budget));
  }

  /**
   * Unbounded Knapsack (can use items multiple times)
   * Time Complexity: O(n × W)
   */
  unboundedKnapsack(items, capacity) {
    const dp = Array(capacity + 1).fill(0);

    for (let w = 0; w <= capacity; w++) {
      for (const item of items) {
        if (item.weight <= w) {
          dp[w] = Math.max(
            dp[w],
            dp[w - item.weight] + item.value
          );
        }
      }
    }

    return {
      maxValue: dp[capacity],
      // Reconstruction for unbounded is more complex
      selectedItems: []
    };
  }
}

// Example usage:
// const knapsack = new KnapsackDP();
// const result = knapsack.optimizeEquipment(equipment, 10000);
// console.log('Max value:', result.maxValue);
// console.log('Selected:', result.selectedItems.map(i => i.data.name));

