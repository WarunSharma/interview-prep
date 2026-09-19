
// https://leetcode.com/problems/climbing-stairs/description/

/*
    Intuition:
    - To reach stair n, the final move must come from n - 1 (one step)
      or n - 2 (two steps).
    - These two choices do not overlap, so add their number of ways:
      ways(n) = ways(n - 1) + ways(n - 2).
    - This is Fibonacci-like, but the starting values matter:
      ways(0) = 1 and ways(1) = 1.

    Revision:
    - Identify the "last choice" to derive a DP recurrence.
    - Store the whole DP array first; then optimize to two previous values.
    - Time: O(n). Space: O(n) with DP, O(1) when space optimized.
*/
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
    console.log(stairs);
    return stairs[n];
};

/*
    Space optimization intuition:
    - Each state needs only the previous two states, not the full array.
    - `first` and `second` represent the two most recent answers.
    - Calculate the next answer, then shift both values forward.

    Revision:
    - Use this when a DP transition depends on a fixed number of prior states.
    - The recurrence stays the same; only storage changes from O(n) to O(1).
*/
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