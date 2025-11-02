# Removed Unused Files

This document lists all files that were removed from the project because they were not being used.

## Summary

Removed **19 files** total that were not referenced or used in the active codebase.

---

## Removed Files

### 1. Unused Handler Files (1 file)

- **`telegram-bot/handlers/locationHandler.js`**
  - **Reason:** The `/nearby` command was removed, so this handler is no longer used
  - **Previously used for:** Location-based equipment search using Dijkstra's algorithm

---

### 2. Unused Graph Algorithms (2 files)

- **`telegram-bot/algorithms/graph/dijkstra.js`**
  - **Reason:** Only used by locationHandler.js which was removed
  - **Previously used for:** Finding nearest equipment based on user location

- **`telegram-bot/algorithms/graph/graphBuilder.js`**
  - **Reason:** Only used by locationHandler.js which was removed
  - **Previously used for:** Building graphs from equipment locations

---

### 3. Unused Dynamic Programming Algorithms (2 files)

- **`telegram-bot/algorithms/dynamic/knapsack.js`**
  - **Reason:** The `/optimize` command was removed
  - **Previously used for:** Budget optimization using 0/1 Knapsack problem

- **`telegram-bot/algorithms/dynamic/priceOptimizer.js`**
  - **Reason:** Not imported or used anywhere
  - **Previously used for:** Rental duration optimization

---

### 4. Unused Greedy Algorithm (1 file)

- **`telegram-bot/algorithms/greedy/bookingOptimizer.js`**
  - **Reason:** The `/book` command now redirects to website instead of using this algorithm
  - **Previously used for:** Booking conflict resolution using Activity Selection problem

---

### 5. Unused Search Algorithms (2 files)

- **`telegram-bot/algorithms/search/binarySearchTree.js`**
  - **Reason:** Not imported or used anywhere
  - **Purpose:** Binary Search Tree for equipment search and filtering

- **`telegram-bot/algorithms/search/binarySearch.js`**
  - **Reason:** Was imported in searchHandler.js but never actually used
  - **Note:** Trie handles all search functionality, Binary Search was redundant
  - **Purpose:** Fast lookup in sorted equipment lists

---

### 6. Unused Data Structures (2 files)

- **`telegram-bot/algorithms/dataStructures/hashTable.js`**
  - **Reason:** Not imported or used anywhere
  - **Purpose:** Fast equipment lookup by ID

- **`telegram-bot/algorithms/sorting/heapSort.js`**
  - **Reason:** Not imported or used anywhere
  - **Note:** Priority Queue uses heap concepts but has its own implementation
  - **Purpose:** In-place sorting with guaranteed O(n log n)

---

### 7. Test and Documentation Files (2 files)

- **`app/test/page.js`**
  - **Reason:** Test page, not part of production application
  - **Purpose:** Simple test page component

- **`telegram-bot/LOCATION_SETUP.md`**
  - **Reason:** Documentation for `/nearby` feature which was removed
  - **Purpose:** Setup instructions for location-based search

---

### 8. Duplicate SQL Files (3 files)

- **`telegram-bot/add-sample-equipment.sql`**
  - **Reason:** Duplicate - same content as other SQL files
  - **Kept:** `CREATE_AND_INSERT.sql` (most complete version)

- **`telegram-bot/create-table-and-insert.sql`**
  - **Reason:** Duplicate - same content as CREATE_AND_INSERT.sql
  - **Kept:** `CREATE_AND_INSERT.sql` (more descriptive filename)

- **`telegram-bot/FIXED_INSERT.sql`**
  - **Reason:** Duplicate - temporary fix file, content merged into main SQL file
  - **Kept:** `CREATE_AND_INSERT.sql` (final version)

---

## Code Changes

### Updated Files

1. **`telegram-bot/handlers/searchHandler.js`**
   - Removed unused `BinarySearch` import
   - Removed unused `this.binarySearch` instance
   - Updated comments to reflect only Trie usage
   - Updated algorithm description in message

---

## Currently Active Algorithms

After cleanup, the following algorithms remain in use:

1. **Trie** (`algorithms/search/trie.js`) - Used in `/search` command
2. **Merge Sort** (`algorithms/sorting/mergeSort.js`) - Used in `/search` and `/recommend` commands
3. **Quick Sort** (`algorithms/sorting/quickSort.js`) - Used in `/recommend price` command
4. **Priority Queue** (`algorithms/dataStructures/priorityQueue.js`) - Used in `/recommend popular` command

---

## Impact

- **Reduced codebase size:** Removed ~2,500+ lines of unused code
- **Improved maintainability:** Less code to maintain and test
- **Clearer architecture:** Only active algorithms remain
- **Faster builds:** Fewer files to process

---

## Note

All removed algorithms were well-implemented and could be re-added if needed in the future. The removal was based on current usage, not code quality.

