"use strict";

/*
 * Higher-Order Functions and Functional Patterns
 *
 * Functions are values in JavaScript: they can be stored, passed, and
 * returned. A higher-order function (HOF) takes a function, returns one, or
 * does both. This idea powers array methods, event handlers, Promise.then,
 * middleware, currying, memoization, and composition.
 */

/*
 * First-class functions and callbacks
 *
 * A callback is a function supplied for another function to invoke. It may
 * run immediately (as with map) or later (as with setTimeout or Promise.then).
 */
const twice = (fn, value) => fn(fn(value));

console.log(twice((number) => number + 3, 10)); // 16

/*
 * Returning a function creates a closure: the returned function retains
 * access to variables from the outer call. `once` is a useful example:
 * regardless of later arguments, it calls its source function only once.
 */
function once(fn) {
  let called = false;
  let result;

  return function callOnce(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }

    return result;
  };
}

const initialize = once(() => {
  console.log("initializing");
  return 42;
});

console.log(initialize(), initialize()); // logs "initializing" once, then 42 42

/*
 * map, filter, and reduce
 *
 * - map transforms every present element and returns an array of the same
 *   length (including holes).
 * - filter keeps elements whose callback result is truthy.
 * - reduce combines elements into one accumulator, which may be any type.
 *
 * None mutates its source array. The native callbacks receive:
 * (element, index, array). Both map and filter skip holes in sparse arrays.
 */

/*
 * A practical map polyfill. Defining a method on Array.prototype is for
 * interview practice only; production code should not modify built-ins.
 */
Array.prototype.myMap = function myMap(callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }

  const source = Object(this);
  const output = new Array(source.length);

  for (let index = 0; index < source.length; index += 1) {
    if (index in source) {
      output[index] = callback.call(thisArg, source[index], index, source);
    }
  }

  return output;
};

console.log([1, 2, 3].myMap((number) => number * 2)); // [2, 4, 6]

Array.prototype.myFilter = function myFilter(callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }

  const source = Object(this);
  const output = [];

  for (let index = 0; index < source.length; index += 1) {
    if (
      index in source &&
      callback.call(thisArg, source[index], index, source)
    ) {
      output.push(source[index]);
    }
  }

  return output;
};

console.log([1, 2, 3, 4].myFilter((number) => number % 2 === 0)); // [2, 4]

/*
 * `reduce` is the one with an important edge case. With an initial value,
 * processing starts at index 0. Without one, the first present element is
 * the accumulator and processing starts after it. An empty (or all-hole)
 * array with no initial value must throw.
 */
Array.prototype.myReduce = function myReduce(callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }

  const source = Object(this);
  let index = 0;
  let accumulator;

  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    while (index < source.length && !(index in source)) {
      index += 1;
    }

    if (index >= source.length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = source[index];
    index += 1;
  }

  for (; index < source.length; index += 1) {
    if (index in source) {
      accumulator = callback(accumulator, source[index], index, source);
    }
  }

  return accumulator;
};

console.log([1, 2, 3, 4].myReduce((sum, number) => sum + number, 0)); // 10
console.log([1, 2, 3, 4].myReduce((sum, number) => sum + number)); // 10

/*
 * `reduce` is the general fold: map and filter can both be expressed using
 * it, alongside aggregates, flattening, and grouping.
 */
const numbers = [1, 2, 3, 4];
console.log(numbers.reduce((sum, number) => sum + number, 0)); // 10

const flattened = [[1, 2], [3, 4], [5]].reduce(
  (result, group) => result.concat(group),
  [],
);
console.log(flattened); // [1, 2, 3, 4, 5]

const people = [
  { name: "Ann", department: "engineering" },
  { name: "Bob", department: "sales" },
  { name: "Cy", department: "engineering" },
];

const namesByDepartment = people.reduce((groups, person) => {
  (groups[person.department] ||= []).push(person.name);
  return groups;
}, {});
console.log(namesByDepartment);
// { engineering: ["Ann", "Cy"], sales: ["Bob"] }

const doubled = [1, 2, 3].reduce((result, number) => {
  result.push(number * 2);
  return result;
}, []);
const evens = [1, 2, 3, 4].reduce((result, number) => {
  if (number % 2 === 0) result.push(number);
  return result;
}, []);
console.log(doubled, evens); // [2, 4, 6] [2, 4]

/*
 * Pure functions, side effects, and immutability
 *
 * A pure function always returns the same result for the same arguments and
 * does not affect anything outside its return value. It does not mutate
 * external state, perform I/O, write to the DOM, or depend on Date.now() or
 * Math.random(). Pure functions are easier to test, cache, and compose.
 */
function addItemImpure(cart, item) {
  cart.push(item);
  return cart;
}

const mutableCart = ["book"];
const sameCart = addItemImpure(mutableCart, "pen");
console.log(mutableCart, mutableCart === sameCart); // ["book", "pen"] true

function addItemPure(cart, item) {
  return [...cart, item];
}

const originalCart = ["book"];
const nextCart = addItemPure(originalCart, "pen");
console.log(originalCart, nextCart, originalCart === nextCart);
// ["book"] ["book", "pen"] false

/*
 * Spread creates a shallow copy. Copy each nested level that changes, while
 * untouched branches may safely retain their existing references. That
 * structural sharing makes immutable updates efficient and supports React's
 * reference comparison (`previous !== next`).
 */
const state = {
  user: { name: "Ann", age: 30 },
  tags: ["javascript"],
};
const nextState = {
  ...state,
  user: { ...state.user, age: 31 },
};

console.log(state.user.age, nextState.user.age); // 30 31
console.log(state.user === nextState.user); // false: changed branch copied
console.log(state.tags === nextState.tags); // true: unchanged branch shared

/*
 * A new array alone does not make an update immutable. Its object elements
 * remain shared unless each changed object is copied too.
 */
const items = [{ count: 1 }, { count: 2 }];
const mutatedItems = items.map((item) => {
  item.count *= 10;
  return item;
});
console.log(items[0].count, mutatedItems[0] === items[0]); // 10 true

const freshItems = [{ count: 1 }, { count: 2 }];
const updatedItems = freshItems.map((item) => ({
  ...item,
  count: item.count * 10,
}));
console.log(freshItems[0].count, updatedItems[0].count);
console.log(updatedItems[0] === freshItems[0]); // false

/*
 * Composition
 *
 * Compose functions that each accept and return one value. `compose` reads
 * right-to-left: compose(f, g)(x) is f(g(x)). `pipe` reads in execution
 * order, so it is often more natural for application code.
 */
const compose = (...functions) => (value) =>
  functions.reduceRight((result, fn) => fn(result), value);
const pipe = (...functions) => (value) =>
  functions.reduce((result, fn) => fn(result), value);

const increment = (number) => number + 1;
const double = (number) => number * 2;

console.log(compose(increment, double)(5)); // 11: increment(double(5))
console.log(pipe(increment, double)(5)); // 12: double(increment(5))

const trim = (value) => value.trim();
const lowercase = (value) => value.toLowerCase();
const cleanInput = pipe(trim, lowercase);
console.log(cleanInput("  JAVASCRIPT  ")); // "javascript"

/*
 * Point-free style avoids naming an argument when an existing function can be
 * passed directly. Prefer it only when it improves clarity.
 */
const words = ["1", "22", "333"];
console.log(words.map((word) => word.length)); // pointful: [1, 2, 3]

const lengthOf = (word) => word.length;
console.log(words.map(lengthOf)); // point-free: [1, 2, 3]

/*
 * Common interview answers
 *
 * - A HOF takes and/or returns functions. Examples: map, filter, reduce,
 *   addEventListener, setTimeout, Promise.then, and `once`.
 * - map transforms and returns a new array; forEach returns undefined and is
 *   intended for side effects. Do not use map if its returned array is unused.
 * - React needs immutable updates because state-change detection relies on
 *   new references. Mutating in place preserves a reference and can hide a
 *   change from reference-based comparisons.
 * - For map/filter/reduce polyfills, use a `for` loop, pass callback
 *   arguments as (element, index, array), skip holes, and handle reduce's
 *   no-initial-value case.
 */

/*
 * Gotchas
 */

// An empty array without a seed throws.
try {
  [].reduce((left, right) => left + right);
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
  // TypeError: Reduce of empty array with no initial value
}

// With no seed, a one-element array never invokes the callback.
let callbackCalls = 0;
const onlyValue = [42].reduce((left, right) => {
  callbackCalls += 1;
  return left + right;
});
console.log(onlyValue, `calls=${callbackCalls}`); // 42 calls=0

/*
 * Choose the seed's type deliberately. `+` concatenates when either operand
 * is a string, so a numeric seed alone does not convert string elements.
 */
console.log(["1", "2", "3"].reduce((left, right) => left + right)); // "123"
console.log(["1", "2", "3"].reduce((sum, value) => sum + Number(value), 0)); // 6

/*
 * map supplies (value, index, array), but parseInt's second parameter is
 * radix. Passing parseInt directly therefore uses indexes as radixes.
 */
console.log(["1", "2", "3"].map(parseInt)); // [1, NaN, NaN]
console.log(["1", "2", "3"].map((value) => parseInt(value, 10))); // [1, 2, 3]
console.log(["1", "2", "3"].map(Number)); // [1, 2, 3]

/*
 * Quick check
 *
 * 1. ["1", "2", "3"].map(parseInt) -> [1, NaN, NaN]
 * 2. compose(increment, double)(5) -> 11
 * 3. ["1", "2", "3"].reduce((a, b) => a + b, 0) -> "0123"
 *
 * The third answer is a string because the first callback combines numeric
 * 0 with string "1". Convert each value before adding when a numeric sum is
 * required.
 */