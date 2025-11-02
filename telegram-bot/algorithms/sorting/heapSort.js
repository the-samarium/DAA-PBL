/**
 * Heap Sort Implementation
 * 
 * DAA Concept: Heap Data Structure - Heap Sort
 * Time Complexity: O(n log n) - guaranteed in all cases
 * Space Complexity: O(1) for in-place sorting
 * 
 * Use Case: Sorting equipment with guaranteed O(n log n) performance
 */

export class HeapSort {
  /**
   * Sort array using Heap Sort
   * @param {Array} arr - Array to sort
   * @param {Function} compareFn - Comparison function (optional)
   * @param {string} sortBy - Field to sort by (optional)
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} Sorted array
   */
  sort(arr, compareFn = null, sortBy = null, order = 'asc') {
    if (arr.length <= 1) return arr;

    // Clone array
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

    this.heapSort(array, compareFn);
    return array;
  }

  /**
   * Heap Sort implementation
   * @param {Array} arr 
   * @param {Function} compareFn 
   */
  heapSort(arr, compareFn) {
    const n = arr.length;

    // Build max heap (for ascending) or min heap (for descending)
    // Start from last non-leaf node
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(arr, n, i, compareFn);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move root (max/min) to end
      [arr[0], arr[i]] = [arr[i], arr[0]];

      // Heapify reduced heap
      this.heapify(arr, i, 0, compareFn);
    }
  }

  /**
   * Heapify subtree rooted at index i
   * @param {Array} arr 
   * @param {number} heapSize 
   * @param {number} i 
   * @param {Function} compareFn 
   */
  heapify(arr, heapSize, i, compareFn) {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // Compare with left child
    if (left < heapSize && compareFn(arr[left], arr[largest]) > 0) {
      largest = left;
    }

    // Compare with right child
    if (right < heapSize && compareFn(arr[right], arr[largest]) > 0) {
      largest = right;
    }

    // If largest is not root, swap and continue heapifying
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      this.heapify(arr, heapSize, largest, compareFn);
    }
  }
}

// Example usage:
// const heapSort = new HeapSort();
// const sorted = heapSort.sort(equipment, null, 'price_per_day', 'asc');

