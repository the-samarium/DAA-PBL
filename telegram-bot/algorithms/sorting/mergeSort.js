/**
 * Merge Sort Implementation for Stable Equipment Sorting
 * 
 * DAA Concept: Divide and Conquer - Merge Sort
 * Time Complexity: O(n log n) - guaranteed in all cases
 * Space Complexity: O(n) - requires extra space
 * 
 * Use Case: Stable sorting of equipment by rating, name, etc.
 * Advantages: Stable, predictable performance, good for large datasets
 */

export class MergeSort {
  /**
   * Sort array using Merge Sort
   * @param {Array} arr - Array to sort
   * @param {Function} compareFn - Comparison function (optional)
   * @param {string} sortBy - Field to sort by (optional)
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} Sorted array (new array, doesn't mutate original)
   */
  sort(arr, compareFn = null, sortBy = null, order = 'asc') {
    if (!arr || arr.length <= 1) return arr || [];

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

    return this.mergeSort(arr, compareFn);
  }

  /**
   * Recursive Merge Sort
   * @param {Array} arr 
   * @param {Function} compareFn 
   * @returns {Array} Sorted array
   */
  mergeSort(arr, compareFn) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return this.merge(
      this.mergeSort(left, compareFn),
      this.mergeSort(right, compareFn),
      compareFn
    );
  }

  /**
   * Merge two sorted arrays
   * Time Complexity: O(n)
   * @param {Array} left 
   * @param {Array} right 
   * @param {Function} compareFn 
   * @returns {Array} Merged sorted array
   */
  merge(left, right, compareFn) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // Compare and merge
    while (leftIndex < left.length && rightIndex < right.length) {
      if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    // Add remaining elements
    while (leftIndex < left.length) {
      result.push(left[leftIndex]);
      leftIndex++;
    }

    while (rightIndex < right.length) {
      result.push(right[rightIndex]);
      rightIndex++;
    }

    return result;
  }

  /**
   * Sort equipment by rating (stable sort preserves original order for equal ratings)
   * @param {Array} equipment 
   * @param {string} order 
   * @returns {Array} Sorted equipment
   */
  sortByRating(equipment, order = 'desc') {
    return this.sort(equipment, (a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
  }

  /**
   * External merge sort for very large datasets (sorts in chunks)
   * Useful when data doesn't fit in memory
   * @param {Array} arr 
   * @param {Function} compareFn 
   * @param {number} chunkSize 
   * @returns {Array} Sorted array
   */
  externalMergeSort(arr, compareFn, chunkSize = 1000) {
    if (arr.length <= chunkSize) {
      return this.mergeSort(arr, compareFn);
    }

    // Divide into chunks and sort each
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      chunks.push(this.mergeSort(chunk, compareFn));
    }

    // Merge all sorted chunks
    while (chunks.length > 1) {
      const merged = [];
      for (let i = 0; i < chunks.length; i += 2) {
        if (i + 1 < chunks.length) {
          merged.push(this.merge(chunks[i], chunks[i + 1], compareFn));
        } else {
          merged.push(chunks[i]);
        }
      }
      chunks.length = 0;
      chunks.push(...merged);
    }

    return chunks[0] || [];
  }
}

// Example usage:
// const mergeSort = new MergeSort();
// const sorted = mergeSort.sort(equipment, null, 'rating', 'desc');
// const rated = mergeSort.sortByRating(equipment, 'desc');

