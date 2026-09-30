
// Brute force

var minWindow = function(s, t) {
    let minLength = Infinity;
    let result = "";

    for (let i = 0; i < s.length; ++i) {
        for (let j = i; j < s.length; ++j) {
            let subs = s.substring(i, j + 1);

            if (containsSubs(subs, t)) {
                if (minLength > j - i + 1) {
                    result = subs;
                    minLength = j - i + 1;
                }
            }
        }
    }

    return result;
};

function containsSubs(subs, t) {
    let tMap = new Map();

    for (let ch of t) {
        tMap.set(ch, (tMap.get(ch) || 0) + 1);
    }

    for (let ch of subs) {
        if (tMap.has(ch)) {
            tMap.set(ch, tMap.get(ch) - 1);

            if (tMap.get(ch) === 0)
                tMap.delete(ch);
        }
    }

    return tMap.size === 0;
}

// Optimal Solution: Sliding window

var minWindow = function(s, t) {
    if (!s || !t || s.length < t.length)
        return "";

    const need = new Map();
    for (let ch of t) {
        need.set(ch, (need.get(ch) || 0) + 1);
    }
    const required = need.size;
    const window = new Map();
    let left = 0;
    let leftMostIdx = 0;
    let formed = 0;
    let minLength = Infinity;

    for (let right = 0; right < s.length; ++right) {
        const rightChar = s[right];
        window.set(rightChar, (window.get(rightChar) || 0) + 1);

        if(need.has(rightChar) && window.get(rightChar) === need.get(rightChar))
            formed++;

        while (formed === required) {
            const windowLength = right - left + 1
            if (windowLength < minLength) {
                minLength = windowLength;
                leftMostIdx = left
            }

            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar) - 1)
            
            if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
                formed--;
            }

            left++;
        }
    }

    return minLength === Infinity ? "" : s.substring(leftMostIdx, leftMostIdx + minLength);
};