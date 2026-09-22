// https://leetcode.com/problems/word-break/

// Brute force: recursive solution (for understanding)
var wordBreak = function(s, wordDict) {
    var wordBreakHelper = function(s, wordDict, idx) {
        if (idx === s.length)
            return 1;

        const n = s.length;
        let prefix = ""
        for (let j = idx; j < s.length; ++j){
            prefix += s[j];

            if (wordDict.find((pre) => pre == prefix) && wordBreakHelper(s, wordDict, j + 1)) {
                return 1;
            }
        }
        return 0; 
    };

    return wordBreakHelper(s, wordDict, 0) ? true : false;
};

// Optimal solution (top-down DP + memoization)
/*
Intuition:
- At position idx, ask: "Can s[idx..end] be segmented?"
- Try every growing prefix from idx.
- If prefix is a word, recurse for the remaining suffix.
- Many calls repeat for same idx => cache by idx.

Remembrance:
1) Try all cuts from current idx
2) If prefix valid, solve rest
3) Memoize idx result (true/false)
*/
var wordBreak = function (s, wordDict) {
    const dict = new Set(wordDict); // O(1) average lookup
    let memo = new Array(s.length).fill(undefined); // memo[idx] = true/false once known

    var wordBreakHelper = function (s, idx) {
        if (idx === s.length)
            return true;

        if (memo[idx] !== undefined) {
            return memo[idx]; // reuse precomputed answer
        }

        let prefix = "";
        for (let j = idx; j < s.length; ++j) {
            prefix += s[j];

            if (dict.has(prefix) && wordBreakHelper(s, j + 1)) {
                memo[idx] = true;
                return true;
            }
        }

        memo[idx] = false;
        return false;
    };

    return wordBreakHelper(s, 0);
};