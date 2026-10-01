
// https://leetcode.com/problems/longest-substring-without-repeating-characters/

// Brute force solution
var lengthOfLongestSubstring = function(s) {
    let maxLength = 0;
    for (let i = 0; i < s.length; i++) {
        let set = new Set();
        for (let j = i; j < s.length; j++) {
            if (set.has(s[j])) {
                break;
            }
            set.add(s[j]);
            maxLength = Math.max(maxLength, set.size);
        }
    }
    return maxLength;
}

// Optimal solution using sliding window
var lengthOfLongestSubstring = function(s) {
    let set = new Set();
    let right = 0, left = 0;
    let maxLength = 0;

    while (right < s.length) {
        let rightChar = s[right];
        while(set.has(rightChar)) {
            let leftChar = s[left];
            set.delete(leftChar)
            ++left;
        }
        set.add(rightChar);
        maxLength = Math.max(maxLength, set.size)
        ++right;
    }

    return maxLength;
};