// https://leetcode.com/problems/longest-common-subsequence/description/

// Brute force: recursive solution (for understanding)
var longestCommonSubsequenceBruteForce = function(text1, text2) {
    var helper = function(idx1, idx2) {
        if (idx1 >= text1.length || idx2 >= text2.length) return 0;

        if (text1[idx1] === text2[idx2]) {
            return 1 + helper(idx1 + 1, idx2 + 1);
        }

        return Math.max(helper(idx1 + 1, idx2), helper(idx1, idx2 + 1));
    };

    return helper(0, 0);
};

// Optimal solution (tabulation DP)
var longestCommonSubsequence = function(text1, text2) {
    let m = text1.length;
    let n = text2.length;

    let dp = new Array(m + 1).fill(0);
    for (let i = 0; i <= m; ++i) dp[i] = new Array(n + 1).fill(0);

    for (let i = 1; i <= m; ++i) {
        for (let j = 1; j <= n; ++j) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
};

/*
Revision points:
1) Brute force explores both choices -> exponential time.
2) DP state: dp[i][j] = LCS length for text1[0..i-1], text2[0..j-1].
3) Transition:
   - match: dp[i][j] = 1 + dp[i-1][j-1]
   - no match: max(top, left)
4) Complexity:
   - Time: O(m*n)
   - Space: O(m*n) (can be optimized to O(min(m, n)) with 1D DP)
*/