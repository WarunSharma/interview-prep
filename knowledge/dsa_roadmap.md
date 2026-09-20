# Top DSA Interview Questions — Pattern-wise (Revised)

Pattern-first beats topic-first. This list is organized by the recurring patterns that
actually show up in interviews: sliding window, two pointers, binary search, BFS/DFS,
heaps, backtracking, and DP.

**What changed from the original 50:** the core list below is unchanged. Items marked
🆕 are additions that closed real gaps — most importantly Intervals (missing entirely),
Kadane's Algorithm (a fundamental omission), LRU Cache (very common), Trie, Matrix, and
Bit Manipulation. If you want to stay strictly at 50, treat 🆕 items as swap candidates
for lower-yield entries like *Continuous Subarray Sum*.

---

## 1. Arrays & Hashing
| # | Problem | LeetCode |
|---|---------|----------|
| 1 | Two Sum | #1 |
| 2 | Contains Duplicate | #217 |
| 3 | Valid Anagram | #242 |
| 4 | Group Anagrams | #49 |
| 5 | Product of Array Except Self | #238 |
| 6 | Longest Consecutive Sequence | #128 |

**Pattern to learn:** HashMap/HashSet, frequency counting, lookup optimization.

## 2. Two Pointers
| # | Problem | LeetCode |
|---|---------|----------|
| 7 | Valid Palindrome | #125 |
| 8 | 3Sum | #15 |
| 9 | Container With Most Water | #11 |
| 10 | Trapping Rain Water | #42 |

**Pattern to learn:** Left/right pointers, sorted-array reasoning, shrinking search space.

## 3. Sliding Window
| # | Problem | LeetCode |
|---|---------|----------|
| 11 | Best Time to Buy and Sell Stock | #121 |
| 12 | Longest Substring Without Repeating Characters | #3 |
| 13 | Longest Repeating Character Replacement | #424 |
| 14 | Minimum Window Substring | #76 |

**Pattern to learn:** Fixed vs variable window, frequency map, maintaining window invariants.

## 4. Prefix Sum
| # | Problem | LeetCode |
|---|---------|----------|
| 15 | Range Sum Query - Immutable | #303 |
| 16 | Subarray Sum Equals K | #560 |
| 17 | Continuous Subarray Sum | #523 |

**Pattern to learn:** Prefix information + HashMap.

## 5. Binary Search
| # | Problem | LeetCode |
|---|---------|----------|
| 18 | Binary Search | #704 |
| 19 | Search in Rotated Sorted Array | #33 |
| 20 | Find Minimum in Rotated Sorted Array | #153 |
| 21 | Koko Eating Bananas | #875 |

**Pattern to learn:** Classic binary search, modified binary search, binary search on answer.

## 6. Linked List
| # | Problem | LeetCode |
|---|---------|----------|
| 22 | Reverse Linked List | #206 |
| 23 | Merge Two Sorted Lists | #21 |
| 24 | Linked List Cycle | #141 |
| 25 | Remove Nth Node From End of List | #19 |
| 26 | Reorder List | #143 |

**Pattern to learn:** Pointer manipulation, dummy node, fast/slow pointers, in-place operations.

## 7. Stack / Monotonic Stack
| # | Problem | LeetCode |
|---|---------|----------|
| 27 | Valid Parentheses | #20 |
| 28 | Min Stack | #155 |
| 29 | Daily Temperatures | #739 |
| 30 | Largest Rectangle in Histogram | #84 |

**Pattern to learn:** Stack state, matching, monotonic increasing/decreasing stack.

## 8. Trees / BST
| # | Problem | LeetCode |
|---|---------|----------|
| 🆕 | Invert Binary Tree | #226 |
| 31 | Maximum Depth of Binary Tree | #104 |
| 32 | Binary Tree Level Order Traversal | #102 |
| 33 | Validate Binary Search Tree | #98 |
| 34 | Lowest Common Ancestor of a Binary Tree | #236 |
| 35 | Binary Tree Maximum Path Sum | #124 |

**Pattern to learn:** DFS, BFS, recursion, tree invariants, post-order reasoning.

## 9. Heap / Priority Queue
| # | Problem | LeetCode |
|---|---------|----------|
| 36 | Kth Largest Element in an Array | #215 |
| 37 | Top K Frequent Elements | #347 |
| 38 | Find Median from Data Stream | #295 |
| 🆕 | K Closest Points to Origin | #973 |

**Pattern to learn:** Top-K, min/max heap, two-heap technique.

## 10. Graphs
| # | Problem | LeetCode |
|---|---------|----------|
| 39 | Number of Islands | #200 |
| 40 | Clone Graph | #133 |
| 41 | Course Schedule | #207 |
| 42 | Rotting Oranges | #994 |
| 🆕 | Redundant Connection | #684 |

**Pattern to learn:** DFS, BFS, visited set, connected components, topological sort, union-find.

## 11. Backtracking
| # | Problem | LeetCode |
|---|---------|----------|
| 43 | Subsets | #78 |
| 44 | Permutations | #46 |
| 45 | Combination Sum | #39 |
| 🆕 | Word Search | #79 |
| 🆕 | Palindrome Partitioning | #131 |

**Pattern to learn:** Decision tree, choose → recurse → undo.

## 12. Dynamic Programming
| # | Problem | LeetCode |
|---|---------|----------|
| 🆕 | Maximum Subarray (Kadane's Algorithm) | #53 |
| 46 | Climbing Stairs | #70 |
| 47 | House Robber | #198 |
| 48 | Coin Change | #322 |
| 49 | Longest Common Subsequence | #1143 |
| 50 | Word Break | #139 |
| 🆕 | Longest Increasing Subsequence | #300 |

**Pattern to learn:** State definition, recurrence, memoization, tabulation, 1D vs 2D DP.

---

## 🆕 13. Intervals
| Problem | LeetCode |
|---------|----------|
| Insert Interval | #57 |
| Merge Intervals | #56 |
| Non-overlapping Intervals | #435 |

**Pattern to learn:** Sort by start/end, greedy merging, overlap detection.

## 🆕 14. Matrix / Grid
| Problem | LeetCode |
|---------|----------|
| Rotate Image | #48 |
| Spiral Matrix | #54 |

**Pattern to learn:** In-place transformation, boundary tracking, layer-by-layer traversal.

## 🆕 15. Trie
| Problem | LeetCode |
|---------|----------|
| Implement Trie (Prefix Tree) | #208 |

**Pattern to learn:** Prefix-based lookup, tree-of-characters structure.

## 🆕 16. Bit Manipulation
| Problem | LeetCode |
|---------|----------|
| Number of 1 Bits | #191 |
| Counting Bits | #338 |

**Pattern to learn:** Bit shifting, AND/OR/XOR tricks, DP-on-bits.

## 🆕 17. Design
| Problem | LeetCode |
|---------|----------|
| LRU Cache | #146 |

**Pattern to learn:** Combining data structures (HashMap + Doubly Linked List) to hit O(1) operations.

---

## Suggested study order
1. Arrays & Hashing → Two Pointers → Sliding Window → Prefix Sum (build array intuition)
2. Binary Search → Linked List → Stack (core mechanics)
3. Trees → Graphs → Trie (traversal-based thinking)
4. Heap → Intervals → Matrix (structured problem shapes)
5. Backtracking → DP → Bit Manipulation (hardest reasoning last)
6. Design (LRU Cache) as a capstone — it forces you to combine multiple patterns at once.