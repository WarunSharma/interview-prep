
// https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

// Brute force solution
// Time complexity: O(n^2), Space complexity: O(1)
var maxProfit = function(prices) {
    let maxProfit = 0;
    for (let i = 0; i < prices.length; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            const profit = prices[j] - prices[i];
            if (profit > maxProfit) {
                maxProfit = profit;
            }
        }
    }
    return maxProfit;
};

// Optimized solution
// Time complexity: O(n), Space complexity: O(1)
var maxProfit = function(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
};