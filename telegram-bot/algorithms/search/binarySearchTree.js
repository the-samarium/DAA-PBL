/**
 * Binary Search Tree (BST) Implementation for Equipment Search
 * 
 * DAA Concept: Tree Data Structure - Binary Search Tree
 * Time Complexity: 
 *   - Average: O(log n) for search, insert, delete
 *   - Worst: O(n) for unbalanced tree (degenerate case)
 * Space Complexity: O(n)
 * 
 * Use Case: Fast search, insertion, and deletion of equipment
 */

export class BinarySearchTree {
  constructor(compareFn = null) {
    this.root = null;
    this.size = 0;
    
    // Default compare function
    this.compareFn = compareFn || ((a, b) => {
      const keyA = a.id || a;
      const keyB = b.id || b;
      if (keyA === keyB) return 0;
      return keyA > keyB ? 1 : -1;
    });
  }

  /**
   * Node class for BST
   */
  static Node = class {
    constructor(data) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  }

  /**
   * Insert element into BST
   * Time Complexity: O(log n) average, O(n) worst
   * @param {*} data 
   * @returns {boolean} Success
   */
  insert(data) {
    this.root = this._insert(this.root, data);
    this.size++;
    return true;
  }

  _insert(node, data) {
    if (node === null) {
      return new BinarySearchTree.Node(data);
    }

    const comparison = this.compareFn(data, node.data);
    
    if (comparison < 0) {
      node.left = this._insert(node.left, data);
    } else if (comparison > 0) {
      node.right = this._insert(node.right, data);
    } else {
      // Duplicate - update data or ignore
      node.data = data;
      this.size--; // Adjust size
    }

    return node;
  }

  /**
   * Search for element in BST
   * Time Complexity: O(log n) average, O(n) worst
   * @param {*} target 
   * @returns {*} Found data or null
   */
  search(target) {
    return this._search(this.root, target);
  }

  _search(node, target) {
    if (node === null) return null;

    const comparison = this.compareFn(target, node.data);
    
    if (comparison === 0) {
      return node.data;
    } else if (comparison < 0) {
      return this._search(node.left, target);
    } else {
      return this._search(node.right, target);
    }
  }

  /**
   * Delete element from BST
   * Time Complexity: O(log n) average, O(n) worst
   * @param {*} target 
   * @returns {boolean} Success
   */
  delete(target) {
    const initialSize = this.size;
    this.root = this._delete(this.root, target);
    return this.size < initialSize;
  }

  _delete(node, target) {
    if (node === null) return null;

    const comparison = this.compareFn(target, node.data);
    
    if (comparison < 0) {
      node.left = this._delete(node.left, target);
    } else if (comparison > 0) {
      node.right = this._delete(node.right, target);
    } else {
      // Node to delete found
      this.size--;
      
      // Case 1: No child
      if (node.left === null && node.right === null) {
        return null;
      }
      // Case 2: One child
      else if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }
      // Case 3: Two children - find inorder successor
      else {
        const successor = this._findMin(node.right);
        node.data = successor.data;
        node.right = this._delete(node.right, successor.data);
        this.size++; // Adjust since we didn't actually delete
      }
    }

    return node;
  }

  /**
   * Find minimum node in subtree
   */
  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  /**
   * In-order traversal (sorted order)
   * Time Complexity: O(n)
   * @returns {Array} Sorted array
   */
  inOrder() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  _inOrder(node, result) {
    if (node !== null) {
      this._inOrder(node.left, result);
      result.push(node.data);
      this._inOrder(node.right, result);
    }
  }

  /**
   * Pre-order traversal
   */
  preOrder() {
    const result = [];
    this._preOrder(this.root, result);
    return result;
  }

  _preOrder(node, result) {
    if (node !== null) {
      result.push(node.data);
      this._preOrder(node.left, result);
      this._preOrder(node.right, result);
    }
  }

  /**
   * Post-order traversal
   */
  postOrder() {
    const result = [];
    this._postOrder(this.root, result);
    return result;
  }

  _postOrder(node, result) {
    if (node !== null) {
      this._postOrder(node.left, result);
      this._postOrder(node.right, result);
      result.push(node.data);
    }
  }

  /**
   * Find range of values
   * @param {*} min 
   * @param {*} max 
   * @returns {Array} Values in range
   */
  rangeSearch(min, max) {
    const result = [];
    this._rangeSearch(this.root, min, max, result);
    return result;
  }

  _rangeSearch(node, min, max, result) {
    if (node === null) return;

    const comparisonMin = this.compareFn(node.data, min);
    const comparisonMax = this.compareFn(node.data, max);

    if (comparisonMin > 0) {
      this._rangeSearch(node.left, min, max, result);
    }

    if (comparisonMin >= 0 && comparisonMax <= 0) {
      result.push(node.data);
    }

    if (comparisonMax < 0) {
      this._rangeSearch(node.right, min, max, result);
    }
  }

  /**
   * Get height of tree
   * Time Complexity: O(n)
   */
  height() {
    return this._height(this.root);
  }

  _height(node) {
    if (node === null) return -1;
    return 1 + Math.max(this._height(node.left), this._height(node.right));
  }

  /**
   * Check if tree is balanced
   */
  isBalanced() {
    return this._isBalanced(this.root) !== -1;
  }

  _isBalanced(node) {
    if (node === null) return 0;

    const leftHeight = this._isBalanced(node.left);
    if (leftHeight === -1) return -1;

    const rightHeight = this._isBalanced(node.right);
    if (rightHeight === -1) return -1;

    if (Math.abs(leftHeight - rightHeight) > 1) return -1;

    return 1 + Math.max(leftHeight, rightHeight);
  }
}

// Example usage:
// const bst = new BinarySearchTree((a, b) => a.price_per_day - b.price_per_day);
// equipment.forEach(eq => bst.insert(eq));
// const found = bst.search(targetPrice);
// const inRange = bst.rangeSearch(minPrice, maxPrice);

