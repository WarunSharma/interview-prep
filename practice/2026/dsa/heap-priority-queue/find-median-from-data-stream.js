
// https://leetcode.com/problems/find-median-from-data-stream

// Brute force solution
// Time complexity: O(n log n), Space complexity: O(n)
var MedianFinder = function() {
    this.stream = [];
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
    this.stream.push(num);
    this.stream.sort((a,b) => a - b);
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
    if (this.stream.length % 2 === 1) {
        const mid = Math.floor(this.stream.length / 2);
        return this.stream[mid];
    }
    else {
        const second = Math.floor(this.stream.length / 2);
        const first = second - 1;

        return (this.stream[first] + this.stream[second]) / 2;
    }
};




// Optimal solution
// Time complexity: O(log n), Space complexity: O(n)
var MedianFinder = function() {
    this.small = new MaxPriorityQueue();
    this.large = new MinPriorityQueue();
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
    if (this.small.isEmpty() || num <= this.small.front()) {
        this.small.enqueue(num)
    }
    else {
        this.large.enqueue(num);
    }

    let moved;
    if ((this.small.size() - this.large.size()) > 1) {
        moved = this.small.dequeue();
        this.large.enqueue(moved);
    }
    else if ((this.large.size() - this.small.size()) > 1) {
        moved = this.large.dequeue();
        this.small.enqueue(moved);
    }
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
    if ((this.small.size() + this.large.size()) % 2 === 1) {
        if (this.small.size() > this.large.size()) {
            return this.small.front();
        }
        else {
            return this.large.front();
        }
    }
    else {
        return (this.small.front() + this.large.front()) / 2
    }
};
