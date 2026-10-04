
// https://leetcode.com/problems/climbing-stairs/description/

// Brute force solution
// Time: O(n). Space: O(n).
var climbStairs = function(n) {
    let stairs = new Array(n + 1).fill(0);
    stairs[0] = 1;

    for (let i = 1; i < n + 1; ++i) {
        if (i - 2 >= 0) {
            stairs[i] += stairs[i - 2];
        }
        if (i - 1 >= 0) {
            stairs[i] += stairs[i - 1];
        }
    }
    return stairs[n];
};

// Optimal solution
// Time: O(n). Space: O(1).
var climbStairs = function(n) {
    if (n === 1)
        return 1;
    let first = 1, second = 1, third = 0;

    for (let i = 2; i < n + 1; ++i) {
        third = first + second
        first = second;
        second = third;
    }

    return third;
};

console.log(climbStairs(2));
console.log(climbStairs(3));
console.log(climbStairs(4));
console.log(climbStairs(5));