// https://leetcode.com/problems/coin-change

// Brute force: Recursive solution
var coinChange = function(coins, amount) {
    function solve(amount) {
        if (amount === 0) return 0;
        if (amount < 0) return Infinity;

        let minCoins = Infinity;

        for (let coin of coins) {
            minCoins = Math.min(
                minCoins,
                solve(amount - coin) + 1
            );
        }

        return minCoins;
    }

    const result = solve(amount);

    return result === Infinity ? -1 : result;
};

// Optimal solution
var coinChange = function(coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let idx = 1; idx < amount + 1; ++idx) {
        for (let coin of coins) {
            if (idx - coin < 0)
                continue;
            else {
                dp[idx] = Math.min(dp[idx], dp[idx - coin] + 1)
            }    
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
};

// ================= REVISION NOTES =================
// Pattern: Unbounded Knapsack (Min coins)
// State: dp[x] = minimum coins needed to make amount x
// Base: dp[0] = 0
// Transition: dp[x] = min(dp[x], dp[x - coin] + 1) if x >= coin
// Sentinel: Infinity => unreachable amount
// Final: dp[amount] === Infinity ? -1 : dp[amount]
//
// Complexity:
// Time: O(amount * coins.length)
// Space: O(amount)
//
// Edge cases:
// - amount = 0 => 0
// - coins = [] and amount > 0 => -1
// - no valid combination => -1
//
// Interview note:
// Brute force recursion is exponential (overlapping subproblems).
// DP avoids recomputation and is accepted for large constraints.
// ================================================