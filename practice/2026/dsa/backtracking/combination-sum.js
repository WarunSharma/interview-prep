// https://leetcode.com/problems/combination-sum/

// Brute force
var combinationSum = function (candidates, target) {
  const result = [];

  function search(index, remaining, combination) {
    if (remaining === 0) {
      result.push([...combination]);
      return;
    }

    if (remaining < 0 || index === candidates.length) {
      return;
    }

    // Include candidates[index]; reuse is allowed, so keep the same index.
    combination.push(candidates[index]);
    search(index, remaining - candidates[index], combination);
    combination.pop();

    // Exclude candidates[index] and consider later candidates only.
    search(index + 1, remaining, combination);
  }

  search(0, target, []);
  return result;
};
