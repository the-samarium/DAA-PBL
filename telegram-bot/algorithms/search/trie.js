/**
 * Trie (Prefix Tree) Implementation for Autocomplete
 * 
 * DAA Concept: Tree Data Structure - Trie
 * Time Complexity:
 *   - Insert: O(m) where m is length of string
 *   - Search: O(m)
 *   - Prefix Search: O(m + k) where k is number of results
 * Space Complexity: O(ALPHABET_SIZE × N × M)
 * 
 * Use Case: Autocomplete for equipment names, fast prefix matching
 */

export class Trie {
  constructor() {
    this.root = new TrieNode();
    this.size = 0;
  }

  /**
   * Insert a string into Trie
   * Time Complexity: O(m) where m is length of word
   * @param {string} word 
   * @param {*} data - Optional associated data
   */
  insert(word, data = null) {
    if (!word || word.length === 0) return;

    let node = this.root;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      
      node = node.children[char];
    }

    // Mark end of word and store data
    if (!node.isEndOfWord) {
      this.size++;
    }
    
    node.isEndOfWord = true;
    node.data = data || word;
  }

  /**
   * Search for exact word
   * Time Complexity: O(m)
   * @param {string} word 
   * @returns {boolean} True if word exists
   */
  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  /**
   * Check if prefix exists
   * Time Complexity: O(m)
   * @param {string} prefix 
   * @returns {boolean} True if prefix exists
   */
  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }

  /**
   * Find node for given prefix/word
   * @param {string} word 
   * @returns {TrieNode|null}
   */
  findNode(word) {
    if (!word || word.length === 0) return this.root;

    let node = this.root;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      
      if (!node.children[char]) {
        return null;
      }
      
      node = node.children[char];
    }

    return node;
  }

  /**
   * Get all words with given prefix (autocomplete)
   * Time Complexity: O(m + k) where k is number of results
   * @param {string} prefix 
   * @param {number} maxResults 
   * @returns {Array} Array of words/data
   */
  getWordsWithPrefix(prefix, maxResults = 10) {
    const node = this.findNode(prefix);
    if (!node) return [];

    const results = [];
    this._collectWords(node, prefix, results, maxResults);
    return results;
  }

  /**
   * Recursively collect words from node
   */
  _collectWords(node, prefix, results, maxResults) {
    if (results.length >= maxResults) return;

    if (node.isEndOfWord) {
      results.push({
        word: prefix,
        data: node.data
      });
    }

    // DFS to collect all words
    for (const [char, childNode] of Object.entries(node.children)) {
      this._collectWords(childNode, prefix + char, results, maxResults);
    }
  }

  /**
   * Delete word from Trie
   * Time Complexity: O(m)
   * @param {string} word 
   * @returns {boolean} Success
   */
  delete(word) {
    return this._delete(this.root, word, 0);
  }

  _delete(node, word, index) {
    if (index === word.length) {
      if (!node.isEndOfWord) return false;
      
      node.isEndOfWord = false;
      node.data = null;
      this.size--;
      
      // Return true if node has no children (can be deleted)
      return Object.keys(node.children).length === 0;
    }

    const char = word[index].toLowerCase();
    const childNode = node.children[char];
    
    if (!childNode) return false;

    const shouldDeleteChild = this._delete(childNode, word, index + 1);

    if (shouldDeleteChild) {
      delete node.children[char];
      
      // Return true if current node can also be deleted
      return Object.keys(node.children).length === 0 && !node.isEndOfWord;
    }

    return false;
  }

  /**
   * Get all words in Trie
   * Time Complexity: O(n × m) where n is number of words
   * @returns {Array} All words
   */
  getAllWords() {
    const results = [];
    this._collectWords(this.root, '', results, Infinity);
    return results.map(r => r.word);
  }

  /**
   * Get count of words with prefix
   * Time Complexity: O(m + k)
   * @param {string} prefix 
   * @returns {number} Count
   */
  countWordsWithPrefix(prefix) {
    const node = this.findNode(prefix);
    if (!node) return 0;

    let count = 0;
    this._countWords(node, count);
    return count;
  }

  _countWords(node) {
    if (node.isEndOfWord) {
      return 1;
    }

    let count = 0;
    for (const childNode of Object.values(node.children)) {
      count += this._countWords(childNode);
    }

    return count;
  }

  /**
   * Fuzzy search with edit distance (approximate matching)
   * Uses Levenshtein distance concept
   * @param {string} word 
   * @param {number} maxDistance 
   * @returns {Array} Matches within distance
   */
  fuzzySearch(word, maxDistance = 2) {
    const results = [];
    this._fuzzySearch(this.root, word, '', 0, maxDistance, results);
    return results;
  }

  _fuzzySearch(node, word, prefix, distance, maxDistance, results) {
    if (distance > maxDistance) return;

    if (node.isEndOfWord && distance <= maxDistance) {
      results.push({
        word: prefix,
        data: node.data,
        distance
      });
    }

    // Exact match
    for (const [char, childNode] of Object.entries(node.children)) {
      if (prefix.length < word.length && char === word[prefix.length].toLowerCase()) {
        this._fuzzySearch(childNode, word, prefix + char, distance, maxDistance, results);
      } else {
        // Try with edit distance
        this._fuzzySearch(childNode, word, prefix + char, distance + 1, maxDistance, results);
      }
    }
  }
}

/**
 * Trie Node class
 */
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.data = null;
  }
}

// Example usage:
// const trie = new Trie();
// equipment.forEach(eq => trie.insert(eq.name.toLowerCase(), eq));
// const suggestions = trie.getWordsWithPrefix('combine', 5);
// const fuzzy = trie.fuzzySearch('combien', 2); // Finds "combine" with typo

