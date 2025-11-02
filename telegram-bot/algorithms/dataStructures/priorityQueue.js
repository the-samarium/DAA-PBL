/**
 * Priority Queue Implementation using Min-Heap
 * 
 * DAA Concept: Heap Data Structure
 * Time Complexity:
 *   - Insert: O(log n)
 *   - Extract Min/Max: O(log n)
 *   - Peek: O(1)
 * Space Complexity: O(n)
 * 
 * Use Case: Ranking recommendations, scheduling, top-k queries
 */

export class PriorityQueue {
  constructor(compareFn = null, order = 'min') {
    this.heap = [];
    this.order = order; // 'min' or 'max'
    
    // Default compare function
    if (!compareFn) {
      this.compareFn = order === 'min' 
        ? (a, b) => a - b
        : (a, b) => b - a;
    } else {
      this.compareFn = compareFn;
    }
  }

  /**
   * Insert element into priority queue
   * Time Complexity: O(log n)
   * @param {*} item 
   * @param {number} priority - Priority value (optional if item is comparable)
   */
  enqueue(item, priority = null) {
    const element = priority !== null ? { item, priority } : item;
    this.heap.push(element);
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove and return highest priority element
   * Time Complexity: O(log n)
   * @returns {*} Element or null if empty
   */
  dequeue() {
    if (this.isEmpty()) return null;

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }

    return top.item !== undefined ? top.item : top;
  }

  /**
   * Peek at highest priority element without removing
   * Time Complexity: O(1)
   * @returns {*} Element or null
   */
  peek() {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    return top.item !== undefined ? top.item : top;
  }

  /**
   * Check if queue is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Get size of queue
   * @returns {number}
   */
  size() {
    return this.heap.length;
  }

  /**
   * Bubble up element to maintain heap property
   */
  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this._compare(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }

      [this.heap[index], this.heap[parentIndex]] = 
        [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  /**
   * Bubble down element to maintain heap property
   */
  _bubbleDown(index) {
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < this.heap.length && 
          this._compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length && 
          this._compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  /**
   * Compare two elements
   */
  _compare(a, b) {
    if (a.priority !== undefined && b.priority !== undefined) {
      return this.compareFn(a.priority, b.priority);
    }
    return this.compareFn(a, b);
  }

  /**
   * Convert heap to sorted array (destroys heap)
   * Time Complexity: O(n log n)
   * @returns {Array}
   */
  toArray() {
    const result = [];
    while (!this.isEmpty()) {
      result.push(this.dequeue());
    }
    return result;
  }

  /**
   * Get top-k elements without removing them
   * Time Complexity: O(k log n)
   * @param {number} k 
   * @returns {Array}
   */
  topK(k) {
    const result = [];
    const temp = [];

    for (let i = 0; i < k && !this.isEmpty(); i++) {
      const item = this.dequeue();
      result.push(item);
      temp.push(item);
    }

    // Restore items
    temp.forEach(item => {
      const priority = this._getPriority(item);
      this.enqueue(item, priority);
    });

    return result;
  }

  _getPriority(item) {
    return item.priority !== undefined ? item.priority : item;
  }
}

/**
 * Min Priority Queue (smallest priority first)
 */
export class MinPriorityQueue extends PriorityQueue {
  constructor(compareFn = null) {
    super(compareFn || ((a, b) => a - b), 'min');
  }
}

/**
 * Max Priority Queue (largest priority first)
 */
export class MaxPriorityQueue extends PriorityQueue {
  constructor(compareFn = null) {
    super(compareFn || ((a, b) => b - a), 'max');
  }
}

// Example usage:
// const pq = new PriorityQueue((a, b) => b.rating - a.rating); // Max heap by rating
// equipment.forEach(eq => pq.enqueue(eq));
// const topRated = pq.topK(5);
// const best = pq.dequeue();

