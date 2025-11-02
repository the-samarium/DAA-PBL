/**
 * Price Optimization using Dynamic Programming
 * 
 * DAA Concept: Dynamic Programming - Optimization
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 * 
 * Use Case: Find optimal rental duration combinations for maximum value
 */

export class PriceOptimizer {
  /**
   * Optimize rental duration combinations
   * @param {Array} options - Array of {duration, price, value}
   * @param {number} maxDays - Maximum total days
   * @returns {Object} Optimal combination
   */
  optimizeCombination(options, maxDays) {
    const n = options.length;
    const dp = Array(maxDays + 1).fill(0);
    const selected = Array(maxDays + 1).fill([]);

    for (let i = 0; i < n; i++) {
      const option = options[i];
      
      for (let days = maxDays; days >= option.duration; days--) {
        const valueWithOption = dp[days - option.duration] + option.value;
        
        if (valueWithOption > dp[days]) {
          dp[days] = valueWithOption;
          selected[days] = [
            ...selected[days - option.duration],
            option
          ];
        }
      }
    }

    const bestDays = dp.indexOf(Math.max(...dp));
    
    return {
      maxValue: dp[bestDays],
      selectedOptions: selected[bestDays],
      totalDays: bestDays,
      totalPrice: selected[bestDays].reduce((sum, opt) => sum + opt.price, 0)
    };
  }

  /**
   * Find best rental duration for equipment
   * @param {number} pricePerDay 
   * @param {number} budget 
   * @param {Array} discounts - Array of {minDays, discountPercent}
   * @returns {Object} Optimal rental plan
   */
  findOptimalRentalDuration(pricePerDay, budget, discounts = []) {
    // Calculate value for each possible duration
    const options = [];
    
    for (let days = 1; days <= Math.floor(budget / pricePerDay); days++) {
      // Apply discount if applicable
      let discount = 0;
      for (const disc of discounts.sort((a, b) => b.minDays - a.minDays)) {
        if (days >= disc.minDays) {
          discount = disc.discountPercent;
          break;
        }
      }

      const discountedPrice = pricePerDay * days * (1 - discount / 100);
      
      if (discountedPrice <= budget) {
        // Value = days * discount_factor (more days = more value)
        const value = days * (1 + discount / 100);
        
        options.push({
          duration: days,
          price: discountedPrice,
          value: value,
          discount: discount
        });
      }
    }

    if (options.length === 0) {
      return null;
    }

    // Find option with best value-to-price ratio
    const best = options.reduce((best, current) => {
      const bestRatio = best.value / best.price;
      const currentRatio = current.value / current.price;
      return currentRatio > bestRatio ? current : best;
    });

    return best;
  }
}

