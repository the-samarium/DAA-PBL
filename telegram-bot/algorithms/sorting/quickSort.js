/**
 * Quick Sort Implementation for Equipment Sorting
 * 
 * DAA Concept: Divide and Conquer - Quick Sort
 * Time Complexity: 
 *   - Average: O(n log n)
 *   - Worst: O(n²) when pivot is always smallest/largest
 *   - Best: O(n log n)
 * Space Complexity: O(log n) for recursion stack
 * 
 * Use Case: Sort equipment by price, rating, or other criteria
 */

export class QuickSort {
  /**
   * Sort array using Quick Sort
   * @param {Array} arr - Array to sort
   * @param {Function} compareFn - Comparison function (optional)
   * @param {string} sortBy - Field to sort by (optional)
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} Sorted array
   */
  sort(arr, compareFn = null, sortBy = null, order = 'asc') {
    if (arr.length <= 1) return arr;

    // Clone array to avoid mutating original
    const array = [...arr];

    // Default compare function
    if (!compareFn && sortBy) {
      compareFn = (a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      };
    } else if (!compareFn) {
      compareFn = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
    }

    this.quickSort(array, 0, array.length - 1, compareFn);
    return array;
  }

  /**
   * Recursive Quick Sort implementation
   * @param {Array} arr 
   * @param {number} low 
   * @param {number} high 
   * @param {Function} compareFn 
   */
  quickSort(arr, low, high, compareFn) {
    if (low < high) {
      // Partition and get pivot index
      const pivotIndex = this.partition(arr, low, high, compareFn);

      // Recursively sort elements before and after partition
      this.quickSort(arr, low, pivotIndex - 1, compareFn);
      this.quickSort(arr, pivotIndex + 1, high, compareFn);
    }
  }

  /**
   * Partition function using Lomuto partition scheme
   * @param {Array} arr 
   * @param {number} low 
   * @param {number} high 
   * @param {Function} compareFn 
   * @returns {number} Pivot index
   */
  partition(arr, low, high, compareFn) {
    // Choose rightmost element as pivot
    const pivot = arr[high];
    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
      // If current element is smaller than or equal to pivot
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
      }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  /**
   * Optimized version with median-of-three pivot selection
   * Reduces worst-case probability
   */
  partitionWithMedianPivot(arr, low, high, compareFn) {
    // Median-of-three pivot selection
    const mid = Math.floor((low + high) / 2);
    
    if (compareFn(arr[mid], arr[low]) < 0) {
      [arr[mid], arr[low]] = [arr[low], arr[mid]];
    }
    if (compareFn(arr[high], arr[low]) < 0) {
      [arr[high], arr[low]] = [arr[low], arr[high]];
    }
    if (compareFn(arr[high], arr[mid]) < 0) {
      [arr[high], arr[mid]] = [arr[mid], arr[high]];
    }

    // Use median as pivot
    [arr[mid], arr[high]] = [arr[high], arr[mid]];
    return this.partition(arr, low, high, compareFn);
  }

  /**
   * Sort equipment by multiple criteria
   * @param {Array} equipment 
   * @param {Array} sortCriteria - Array of {field, order}
   * @returns {Array} Sorted equipment
   */
  multiCriteriaSort(equipment, sortCriteria) {
    return this.sort(equipment, (a, b) => {
      for (const criteria of sortCriteria) {
        const aVal = a[criteria.field];
        const bVal = b[criteria.field];
        
        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }

        if (criteria.order === 'desc') {
          comparison = -comparison;
        }

        if (comparison !== 0) {
          return comparison;
        }
      }
      return 0;
    });
  }
}

// Example usage:
// const quickSort = new QuickSort();
// const sorted = quickSort.sort(equipment, null, 'price_per_day', 'asc');
// const multiSorted = quickSort.multiCriteriaSort(equipment, [
//   { field: 'rating', order: 'desc' },
//   { field: 'price_per_day', order: 'asc' }
// ]);

