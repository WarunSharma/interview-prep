
// https://leetcode.com/problems/permutations

var permute = function(nums) {
    if (nums.length === 1) {
        return [nums];
    }

    const result = [];

    for (let i = 0; i < nums.length; ++i) {
        const newArray = [...nums.slice(0, i), ...nums.slice(i + 1)];
        const permutations = permute(newArray);
        for (let permutation of permutations) {
            result.push([nums[i], ...permutation])
        }
    }

    return result;
};