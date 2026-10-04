
// https://leetcode.com/problems/daily-temperatures/

// Time Complexity: O(n), Space Complexity: O(n)
var dailyTemperatures = function(T) {
    const result = new Array(T.length).fill(0);
    const stack = [];

    for (let i = 0; i < T.length; i++) {
        while (stack.length && T[i] > T[stack[stack.length - 1]]) {
            const idx = stack.pop();
            result[idx] = i - idx;
        }
        stack.push(i);
    }

    return result;
};