
// https://leetcode.com/problems/subsets

let res = []; 
var subsets = function(nums) {
    var subsetsHelper = function(nums, idx, temp) {
        if (idx === nums.length) {
            res.push([...temp]);
            return
        }

        temp.push(nums[idx]);
        subsetsHelper(nums, idx + 1, temp)
        temp.pop();
        subsetsHelper(nums, idx + 1, temp)
    }

    res = [];
    subsetsHelper(nums, 0, [])
    return res;
};