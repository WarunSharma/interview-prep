
// https://leetcode.com/problems/longest-repeating-character-replacement/

// Brute force solution
var characterReplacement = function(s, k) {
    let maxLength = 0;
    for (let i = 0; i < s.length; i++) {
        let count = {};
        let maxCount = 0;
        for (let j = i; j < s.length; j++) {
            count[s[j]] = (count[s[j]] || 0) + 1;
            maxCount = Math.max(maxCount, count[s[j]]);
            if (j - i + 1 - maxCount > k) {
                break;
            }
            maxLength = Math.max(maxLength, j - i + 1);
        }
    }
    return maxLength;
};

// Sliding window solution
var characterReplacement = function(s, k) {
    let count = {};
    let maxCount = 0;
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        count[s[right]] = (count[s[right]] || 0) + 1;
        maxCount = Math.max(maxCount, count[s[right]]);

        while (right - left + 1 - maxCount > k) {
            count[s[left]]--;
            left++;
        }

        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
};