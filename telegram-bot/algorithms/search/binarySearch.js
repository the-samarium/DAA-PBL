/**
 * Binary Search Implementation
 * 
 * DAA Concept: Divide and Conquer - Binary Search
 * Time Complexity: O(log n)
 * Space Complexity: O(1) for iterative, O(log n) for recursive
 * 
 * Prerequisite: Array must be sorted
 * Use Case: Fast lookup in sorted equipment lists
 */

export class BinarySearch {
  /**
   * Iterative Binary Search
   * @param {Array} arr - Sorted array
   * @param {*} target - Element to find
   * @param {Function} compareFn - Comparison function (optional)
   * @returns {number} Index of target, or -1 if not found
   */
  search(arr, target, compareFn = null) {
    if (!arr || arr.length === 0) return -1;

    let left = 0;
    let right = arr.length - 1;

    // Default compare function
    if (!compareFn) {
      compareFn = (a, b) => {
        if (a === b) return 0;
        return a > b ? 1 : -1;
      };
    }

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = compareFn(arr[mid], target);

      if (comparison === 0) {
        return mid; // Found
      } else if (comparison < 0) {
        left = mid + 1; // Search right half
      } else {
        right = mid - 1; // Search left half
      }
    }

    return -1; // Not found
  }

  /**
   * Recursive Binary Search
   * @param {Array} arr 
   * @param {*} target 
   * @param {Function} compareFn 
   * @param {number} left 
   * @param {number} right 
   * @returns {number} Index or -1
   */
  searchRecursive(arr, target, compareFn = null, left = 0, right = null) {
    if (right === null) right = arr.length - 1;
    if (left > right) return -1;

    if (!compareFn) {
      compareFn = (a, b) => {
        if (a === b) return 0;
        return a > b ? 1 : -1;
      };
    }

    const mid = Math.floor((left + right) / 2);
    const comparison = compareFn(arr[mid], target);

    if (comparison === 0) {
      return mid;
    } else if (comparison < 0) {
      return this.searchRecursive(arr, target, compareFn, mid + 1, right);
    } else {
      return this.searchRecursive(arr, target, compareFn, left, mid - 1);
    }
  }

  /**
   * Find first occurrence (for duplicate values)
   * @param {Array} arr 
   * @param {*} target 
   * @returns {number} Index of first occurrence or -1
   */
  findFirstOccurrence(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (arr[mid] === target) {
        result = mid;
        right = mid - 1; // Continue searching left
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Find last occurrence (for duplicate values)
   * @param {Array} arr 
   * @param {*} target 
   * @returns {number} Index of last occurrence or -1
   */
  findLastOccurrence(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (arr[mid] === target) {
        result = mid;
        left = mid + 1; // Continue searching right
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Find equipment by price range in sorted array
   * @param {Array} equipment - Sorted by price
   * @param {number} minPrice 
   * @param {number} maxPrice 
   * @returns {Array} Equipment in price range
   */
  searchByPriceRange(equipment, minPrice, maxPrice) {
    // Find first equipment >= minPrice
    const startIndex = this.findFirstPrice(equipment, minPrice);
    if (startIndex === -1) return [];

    // Find last equipment <= maxPrice
    const endIndex = this.findLastPrice(equipment, maxPrice);
    if (endIndex === -1) return [];

    return equipment.slice(startIndex, endIndex + 1);
  }

  findFirstPrice(arr, targetPrice) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const price = arr[mid].price_per_day || arr[mid].price || 0;

      if (price >= targetPrice) {
        result = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return result;
  }

  findLastPrice(arr, targetPrice) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const price = arr[mid].price_per_day || arr[mid].price || 0;

      if (price <= targetPrice) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Find insertion point for maintaining sorted order
   * @param {Array} arr 
   * @param {*} target 
   * @returns {number} Index where target should be inserted
   */
  findInsertionPoint(arr, target) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return left;
  }
}

// Example usage:
// const binarySearch = new BinarySearch();
// const sortedEquipment = mergeSort.sort(equipment, null, 'price_per_day', 'asc');
// const index = binarySearch.search(sortedEquipment, targetPrice, 
//   (a, b) => a.price_per_day - b);
// const inRange = binarySearch.searchByPriceRange(sortedEquipment, minPrice, maxPrice);

