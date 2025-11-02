/**
 * Hash Table Implementation for Fast Lookups
 * 
 * DAA Concept: Hash Table - Direct Addressing
 * Time Complexity: O(1) average, O(n) worst (collisions)
 * Space Complexity: O(n)
 * 
 * Use Case: Fast equipment lookup by ID, user data caching
 */

export class HashTable {
  constructor(size = 16) {
    this.size = size;
    this.buckets = Array(size).fill(null).map(() => []);
    this.count = 0;
    this.loadFactor = 0.75; // Resize when 75% full
  }

  /**
   * Hash function (djb2 algorithm)
   * @param {string} key 
   * @returns {number} Hash index
   */
  hash(key) {
    if (typeof key === 'number') {
      return key % this.size;
    }

    let hash = 5381;
    const str = String(key);
    
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }

    return Math.abs(hash) % this.size;
  }

  /**
   * Insert key-value pair
   * Time Complexity: O(1) average
   * @param {*} key 
   * @param {*} value 
   */
  set(key, value) {
    if (this.count / this.size >= this.loadFactor) {
      this._resize();
    }

    const index = this.hash(key);
    const bucket = this.buckets[index];

    // Check if key exists and update
    const existing = bucket.find(item => item.key === key);
    if (existing) {
      existing.value = value;
      return;
    }

    // Add new entry
    bucket.push({ key, value });
    this.count++;
  }

  /**
   * Get value by key
   * Time Complexity: O(1) average
   * @param {*} key 
   * @returns {*} Value or undefined
   */
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    const item = bucket.find(item => item.key === key);
    return item ? item.value : undefined;
  }

  /**
   * Check if key exists
   * @param {*} key 
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Delete key-value pair
   * @param {*} key 
   * @returns {boolean} Success
   */
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    const itemIndex = bucket.findIndex(item => item.key === key);
    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
      this.count--;
      return true;
    }

    return false;
  }

  /**
   * Get all keys
   * @returns {Array}
   */
  keys() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        result.push(item.key);
      }
    }
    return result;
  }

  /**
   * Get all values
   * @returns {Array}
   */
  values() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        result.push(item.value);
      }
    }
    return result;
  }

  /**
   * Get all entries
   * @returns {Array} Array of [key, value] pairs
   */
  entries() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        result.push([item.key, item.value]);
      }
    }
    return result;
  }

  /**
   * Clear hash table
   */
  clear() {
    this.buckets = Array(this.size).fill(null).map(() => []);
    this.count = 0;
  }

  /**
   * Resize hash table (rehash all entries)
   */
  _resize() {
    const oldBuckets = this.buckets;
    this.size *= 2;
    this.buckets = Array(this.size).fill(null).map(() => []);
    this.count = 0;

    for (const bucket of oldBuckets) {
      for (const item of bucket) {
        this.set(item.key, item.value);
      }
    }
  }

  /**
   * Get statistics
   * @returns {Object}
   */
  getStats() {
    const bucketLengths = this.buckets.map(b => b.length);
    const maxLength = Math.max(...bucketLengths);
    const avgLength = bucketLengths.reduce((a, b) => a + b, 0) / this.buckets.length;

    return {
      size: this.size,
      count: this.count,
      loadFactor: this.count / this.size,
      maxBucketSize: maxLength,
      avgBucketSize: avgLength
    };
  }
}

