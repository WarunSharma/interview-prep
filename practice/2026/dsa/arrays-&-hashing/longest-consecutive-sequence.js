
// https://leetcode.com/problems/longest-consecutive-sequence/

// Brute force solution
var longestConsecutive = function(nums) {
    if (nums.length === 0) return 0;
    nums.sort((a, b) => a - b);
    let maxCount = 1;
    let count = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) continue;
        if (nums[i] === nums[i - 1] + 1) {
            count++;
        } else {
            maxCount = Math.max(maxCount, count);
            count = 1;
        }
    }
    return Math.max(maxCount, count);
};

// Optimal solution
var longestConsecutive = function(nums) {
    const set = new Set(nums);
    let maxCount = 0;
    for (const num of set) {
        if (!set.has(num - 1)) {
            let currentNum = num;
            let count = 1;
            while (set.has(currentNum + 1)) {
                currentNum++;
                count++;
            }
            maxCount = Math.max(maxCount, count);
        }
    }
    return maxCount;
};