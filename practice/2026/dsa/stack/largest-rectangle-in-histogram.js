
// https://leetcode.com/problems/largest-rectangle-in-histogram/

// Brute force solution
var largestRectangleArea = function(heights) {
    let maxArea = 0;
    for (let i = 0; i < heights.length; i++) {
        let minHeight = heights[i];
        for (let j = i; j < heights.length; j++) {
            minHeight = Math.min(minHeight, heights[j]);
            maxArea = Math.max(maxArea, minHeight * (j - i + 1));
        }
    }
    return maxArea;
}

// Better solution
var largestRectangleArea = function(heights) {
    let maxArea = 0;
    for (let i = 0; i < heights.length; ++i) {
        let localMaxArea = 0;
        let height = heights[i];
        let j = i;
        let k = i;
        while(j >= 0) {
            if (heights[j] < height) {
                break;
            }
            --j;
        }

        while(k < heights.length) {
            if (height > heights[k]) {
                break;
            }
             ++k;
        }
        width = k - j - 1;
        localMaxArea = Number(height * width);
        maxArea = Math.max(maxArea, localMaxArea);
    }

    return maxArea;
};

// Optimal solution using stack
var largestRectangleArea = function (heights) {
    let stack = [];
    let maxArea = 0;

    for (let i = 0; i < heights.length; ++i) {
        while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
            const nse = i;
            const top = heights[stack.pop()];
            const pse = stack.length > 0 ? stack[stack.length - 1] : -1;
            const width = nse - pse - 1;
            const height = top;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }

    while (stack.length > 0) {
        const nse = heights.length;
        const top = heights[stack.pop()];
        const pse = stack.length > 0 ? stack[stack.length - 1] : -1;
        const width = nse - pse - 1;
        const height = top;
        maxArea = Math.max(maxArea, height * width);
    }

    return maxArea;
};