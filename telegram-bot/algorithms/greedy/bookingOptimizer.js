/**
 * Greedy Algorithm for Booking Optimization
 * 
 * DAA Concept: Greedy Algorithm - Activity Selection Problem
 * Time Complexity: O(n log n) for sorting + O(n) for selection
 * Space Complexity: O(n)
 * 
 * Use Case: Optimal booking scheduling, conflict resolution
 */

export class BookingOptimizer {
  /**
   * Greedy activity selection (maximize non-overlapping bookings)
   * Assumes activities sorted by end time
   * @param {Array} bookings - Array of {start, end, value, data}
   * @returns {Array} Selected non-overlapping bookings
   */
  selectOptimalBookings(bookings) {
    if (bookings.length === 0) return [];

    // Sort by end time (greedy choice: always pick earliest ending)
    const sorted = [...bookings].sort((a, b) => {
      if (a.end !== b.end) return a.end - b.end;
      return a.start - b.start;
    });

    const selected = [sorted[0]];
    let lastEnd = sorted[0].end;

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      
      // Greedy choice: select if doesn't conflict
      if (current.start >= lastEnd) {
        selected.push(current);
        lastEnd = current.end;
      }
    }

    return selected;
  }

  /**
   * Weighted activity selection (maximize total value)
   * Uses Dynamic Programming approach for weighted case
   * Time Complexity: O(n²) or O(n log n) with binary search
   * @param {Array} bookings 
   * @returns {Array}
   */
  selectWeightedBookings(bookings) {
    if (bookings.length === 0) return [];

    // Sort by end time
    const sorted = [...bookings].sort((a, b) => a.end - b.end);
    const n = sorted.length;

    // DP[i] = max value using bookings[0..i]
    const dp = Array(n).fill(0);
    const parent = Array(n).fill(-1);

    dp[0] = sorted[0].value || 1;

    for (let i = 1; i < n; i++) {
      const current = sorted[i];
      
      // Option 1: Don't include current
      dp[i] = dp[i - 1];
      parent[i] = i - 1;

      // Option 2: Include current + best compatible previous
      const compatibleIndex = this._findLastCompatible(sorted, i);
      const valueWithCurrent = current.value + (compatibleIndex >= 0 ? dp[compatibleIndex] : 0);

      if (valueWithCurrent > dp[i]) {
        dp[i] = valueWithCurrent;
        parent[i] = compatibleIndex;
      }
    }

    // Reconstruct solution
    const selected = [];
    let i = n - 1;
    
    while (i >= 0) {
      if (parent[i] !== i - 1) {
        selected.unshift(sorted[i]);
      }
      i = parent[i] === -1 ? -1 : parent[i];
    }

    return selected;
  }

  /**
   * Find last booking compatible with current (ending before current starts)
   * Uses binary search for O(log n)
   */
  _findLastCompatible(bookings, currentIndex) {
    const current = bookings[currentIndex];
    let left = 0;
    let right = currentIndex - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (bookings[mid].end <= current.start) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Detect conflicts in bookings
   * Time Complexity: O(n log n)
   * @param {Array} bookings 
   * @returns {Array} Array of conflict groups
   */
  detectConflicts(bookings) {
    if (bookings.length === 0) return [];

    // Sort by start time
    const sorted = [...bookings].sort((a, b) => a.start - b.start);
    const conflicts = [];
    const conflictGroups = [];

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      let addedToGroup = false;

      // Check if conflicts with existing groups
      for (let j = 0; j < conflictGroups.length; j++) {
        const group = conflictGroups[j];
        const lastInGroup = group[group.length - 1];
        
        if (current.start < lastInGroup.end) {
          group.push(current);
          addedToGroup = true;
          break;
        }
      }

      // Create new conflict group if needed
      if (!addedToGroup) {
        conflictGroups.push([current]);
      }
    }

    // Filter to only groups with conflicts (size > 1)
    return conflictGroups.filter(group => group.length > 1);
  }

  /**
   * Resolve conflicts using greedy approach
   * Keep booking with highest value/priority
   * @param {Array} conflictGroup 
   * @returns {Object} {kept, removed}
   */
  resolveConflicts(conflictGroup) {
    // Sort by value descending
    const sorted = [...conflictGroup].sort((a, b) => {
      const valueA = a.value || a.priority || 1;
      const valueB = b.value || b.priority || 1;
      return valueB - valueA;
    });

    const kept = [sorted[0]];
    const removed = sorted.slice(1);

    return { kept, removed };
  }

  /**
   * Schedule equipment rentals optimally
   * @param {Array} rentalRequests - Rental requests
   * @param {string} equipmentId - Equipment ID
   * @returns {Object} Optimal schedule
   */
  optimizeRentalSchedule(rentalRequests, equipmentId) {
    // Filter requests for this equipment
    const equipmentRequests = rentalRequests
      .filter(req => req.equipment_id === equipmentId)
      .map(req => ({
        start: new Date(req.start_date).getTime(),
        end: new Date(req.end_date).getTime(),
        value: req.total_price || 0,
        data: req
      }));

    // Select optimal non-overlapping bookings
    const optimal = this.selectOptimalBookings(equipmentRequests);
    
    // Detect any remaining conflicts
    const conflicts = this.detectConflicts(equipmentRequests);

    return {
      optimalSchedule: optimal,
      conflicts,
      utilization: optimal.reduce((sum, b) => sum + (b.end - b.start), 0),
      totalRevenue: optimal.reduce((sum, b) => sum + b.value, 0)
    };
  }

  /**
   * Find best time slot for new booking
   * @param {Array} existingBookings 
   * @param {number} duration - Duration in milliseconds
   * @returns {Object} {start, end, score}
   */
  findBestTimeSlot(existingBookings, duration) {
    if (existingBookings.length === 0) {
      return {
        start: Date.now(),
        end: Date.now() + duration,
        score: 100
      };
    }

    const sorted = [...existingBookings].sort((a, b) => a.end - b.end);
    const gaps = [];
    const now = Date.now();

    // Check gap before first booking
    if (sorted[0].start > now) {
      const gap = sorted[0].start - now;
      if (gap >= duration) {
        gaps.push({
          start: now,
          end: sorted[0].start,
          size: gap,
          score: gap / duration * 100
        });
      }
    }

    // Check gaps between bookings
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].start - sorted[i].end;
      if (gap >= duration) {
        gaps.push({
          start: sorted[i].end,
          end: sorted[i + 1].start,
          size: gap,
          score: gap / duration * 100
        });
      }
    }

    // Check gap after last booking (can extend indefinitely)
    const lastEnd = sorted[sorted.length - 1].end;
    gaps.push({
      start: lastEnd,
      end: lastEnd + duration,
      size: Infinity,
      score: 80 // Lower score for future bookings
    });

    // Sort by score descending
    gaps.sort((a, b) => b.score - a.score);

    return gaps[0] || null;
  }
}

// Example usage:
// const optimizer = new BookingOptimizer();
// const schedule = optimizer.optimizeRentalSchedule(rentalRequests, equipmentId);
// const conflicts = optimizer.detectConflicts(bookings);
// const bestSlot = optimizer.findBestTimeSlot(existingBookings, duration);

