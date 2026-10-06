
// https://leetcode.com/problems/kth-largest-element-in-an-array/

// Brute force solution
// Time complexity: O(n log n), Space complexity: O(1)
var findKthLargest = function(nums, k) {
    nums.sort((a, b) => a - b);
    return nums[nums.length - k];
};

// Better solution
// Time complexity: O(n log k), Space complexity: O(k)
var findKthLargest = function(nums, k) {
    const minHeap = new MminHeap();

    for (let num of nums) {
        minHeap.push(num);

        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }

    return minHeap.peak();
};

class MminHeap {
    constructor() {
        this.data = [];
    }

    // Time complexity: O(1), Space complexity: O(1)
    size() {
        return this.data.length;
    }

    // Time complexity: O(1), Space complexity: O(1)
    peak() {
        return this.data[0];
    }

    // Time complexity: O(log k), Space complexity: O(1); k is the size of the heap
    push(value) {
        this.data.push(value);
        this.bubbleUp(this.data.length - 1);
    }

    // Time complexity: O(log k), Space complexity: O(1); k is the size of the heap
    pop() {
        let min = this.data[0];
        let last = this.data.pop();

        if (this.data.length > 0) {
            this.data[0] = last;
            this.bubbleDown(0);
        }

        return min;
    }

    // Time complexity: O(log k), Space complexity: O(1); k is the size of the heap
    bubbleUp(index) {
        while (index > 0) {
            let parent = Math.floor((index - 1) / 2);

            if (this.data[parent] <= this.data[index])
                break;

            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            index = parent;    
        }
    }

    // Time complexity: O(log k), Space complexity: O(1); k is the size of the heap
    bubbleDown(index) {
        let length = this.data.length;

        while (true) {
            let smallest = index;
            let left = (2 * index) + 1;
            let right = (2 * index) + 2;

            if (left < length && this.data[left] < this.data[smallest]) {
                smallest = left;
            }

            if (right < length && this.data[right] < this.data[smallest]) {
                smallest = right;
            }

            if (smallest === index)
                break;

            [this.data[smallest], this.data[index]] = [this.data[index], this.data[smallest]];

            index = smallest;    
        }
    }
}

// Optimal solution
// Time complexity: O(n log k), Space complexity: O(k)
var findKthLargest = function(nums, k) {
    const minHeap = new MinPriorityQueue();
    for (const num of nums) {
        minHeap.enqueue(num);
        if (minHeap.size() > k) {
            minHeap.dequeue();
        }
    }
    return minHeap.front().element;
};
