// https://leetcode.com/problems/coin-change

// Brute force: Recursive solution
// Time: O(n^m). Space: O(m).
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
// Time: O(n*m). Space: O(m).
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