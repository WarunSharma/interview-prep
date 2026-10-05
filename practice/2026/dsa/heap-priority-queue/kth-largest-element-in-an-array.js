
// https://leetcode.com/problems/kth-largest-element-in-an-array/

// Brute force solution
var findKthLargest = function(nums, k) {
    nums.sort((a, b) => a - b);
    return nums[nums.length - k];
};

// Better solution
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

    size() {
        return this.data.length;
    }

    peak() {
        return this.data[0];
    }

    push(value) {
        this.data.push(value);
        this.bubbleUp(this.data.length - 1);
    }

    pop() {
        let min = this.data[0];
        let last = this.data.pop();

        if (this.data.length > 0) {
            this.data[0] = last;
            this.bubbleDown(0);
        }

        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            let parent = Math.floor((index - 1) / 2);

            if (this.data[parent] <= this.data[index])
                break;

            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            index = parent;    
        }
    }

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