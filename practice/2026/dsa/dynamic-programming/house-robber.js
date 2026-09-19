
// https://leetcode.com/problems/house-robber/

/*
    Brute-force intuition:
    - For the last house, either rob it and skip its neighbor, or skip it.
    - Recursively try both choices and keep the larger amount.
    - Recomputing the same smaller house ranges makes this slow.

    Revision:
    - Choice: take current + answer two houses back, or skip current.
    - Time: exponential because overlapping subproblems are solved repeatedly.
*/
var rob = function(nums) {
    let n = nums.length;
    if (n === 1)
        return nums[0];
    if (n === 2)
        return Math.max(nums[0], nums[1]);

    return Math.max(nums[n - 1] + rob([...nums.slice(0, n - 2)]), rob([...nums.slice(0, n - 1)]));
};

/*
    DP intuition:
    - `dp[i]` is the most money possible after considering houses 0 through i.
    - At each house: rob it and add `dp[i - 2]`, or skip it and keep `dp[i - 1]`.
    - Recurrence: dp[i] = max(nums[i] + dp[i - 2], dp[i - 1]).

    Revision:
    - The constraint "cannot rob adjacent houses" means taking one item
      removes the immediately previous item from consideration.
    - Time: O(n). Space: O(n); this can be optimized to O(1) with two values.
*/
var rob = function(nums) {
    let n = nums.length;
    if (n === 1)
        return nums[0];
    if (n === 2)
        return Math.max(nums[0], nums[1]);

    let dp = new Array(n).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < n; ++i) {
        dp[i] = Math.max(nums[i] + dp[i - 2], dp[i - 1]);
    }

    return dp[n - 1];
};