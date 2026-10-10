
// https://leetcode.com/problems/top-k-frequent-elements

// Brute force solution
// Time complexity: O(n log n), Space complexity: O(n)
var topKFrequent = function(nums, k) {
    let map = new Map();

    for (let num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }

    let sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    let result = [];
    for (let i = 0; i < k && i < sorted.length; i++) {
        result.push(sorted[i][0]);
    }

    return result;
};

// Optimal solution
// Time complexity: O(n log k), Space complexity: O(n)
var topKFrequent = function(nums, k) {
    let map = new Map();

    for (let num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }

    // Pass comparator directly in constructor (v6+ API)
    let minHeap = new MinPriorityQueue({
        compare: (a, b) => a.freq - b.freq
    });

    for (let [num, freq] of map.entries()) {
        minHeap.enqueue({ num, freq });
        if (minHeap.size() > k) {
            minHeap.dequeue();
        }
    }

    let result = [];
    while (minHeap.size() > 0) {
        result.push(minHeap.dequeue().num);
    }

    return result;
};