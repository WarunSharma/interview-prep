/*
 * Closures in depth
 *
 * A closure is a function paired with its lexical environment: the bindings
 * that were in scope where the function was defined. Lexical means definition
 * site, not call site. Every function can access its outer lexical scopes;
 * closures matter most when an inner function survives after its outer
 * function returns.
 *
 * A closure captures a binding, not a snapshot of its current value. When the
 * binding changes, a closure that reads it later observes the new value.
 */

function makeCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}

const nextCount = makeCounter();
console.log(nextCount()); // 1
console.log(nextCount()); // 2
console.log(nextCount()); // 3

/*
 * `makeCounter` has returned, but `count` remains reachable through
 * `increment`. Each factory invocation makes a fresh lexical environment.
 */
const firstCounter = makeCounter();
const secondCounter = makeCounter();
console.log(firstCounter(), firstCounter(), secondCounter()); // 1 2 1

/*
 * Scope lookup starts in the function's local scope, then walks through
 * enclosing lexical scopes, and finally reaches global scope. A caller's
 * local variables are not part of that lookup chain.
 */
const globalLabel = "global";

function createReader() {
  const enclosingLabel = "enclosing";

  return function readLabels() {
    return `${globalLabel} / ${enclosingLabel}`;
  };
}

const readLabels = createReader();
console.log(readLabels()); // "global / enclosing"

/*
 * Data privacy: `balance` is not an object property. The only code that can
 * access it is code which closes over the binding. Expose carefully chosen
 * methods to control reads and writes.
 */
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        throw new Error("Insufficient funds");
      }

      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50)); // 150
console.log(account.getBalance()); // 150
console.log(account.balance); // undefined

/*
 * Function factories configure a function once and retain the configuration
 * in a closure. Each factory call has its own `factor` binding.
 */
function multiplier(factor) {
  return function multiply(value) {
    return value * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5), triple(5)); // 10 15

/*
 * Memoization retains a private cache between calls. This one intentionally
 * supports a single primitive argument; a production memoizer needs a cache
 * key strategy appropriate to its argument types.
 */
function memoize(fn) {
  const cache = new Map();

  return function memoized(value) {
    if (cache.has(value)) {
      return cache.get(value);
    }

    const result = fn(value);
    cache.set(value, result);
    return result;
  };
}

let squareCalls = 0;
const fastSquare = memoize((value) => {
  squareCalls += 1;
  return value * value;
});

console.log(fastSquare(4)); // 16
console.log(fastSquare(4)); // 16
console.log(squareCalls); // 1

/*
 * `once` stores both whether it has run and the first result. `apply` passes
 * along the invocation's `this` and all arguments.
 */
function once(fn) {
  let called = false;
  let result;

  return function runOnce(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }

    return result;
  };
}

const initialize = once(() => {
  console.log("initialized");
  return 42;
});

console.log(initialize()); // logs "initialized", then 42
console.log(initialize()); // 42; does not log "initialized" again

/*
 * Debounce remembers a timer id between calls. Only the most recent call
 * survives long enough to invoke `fn`. An arrow is deliberately not used for
 * the returned function so callers can preserve their own `this`.
 */
function debounce(fn, delay) {
  let timer;

  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const logLatest = debounce((value) => {
  console.log("debounced:", value);
}, 10);

logLatest("first");
logLatest("second");
logLatest("last"); // After about 10ms: "debounced: last"

/*
 * The classic loop trap: `var` is function-scoped, so each callback closes
 * over the same `index` binding. The loop finishes before these functions are
 * called, and that one binding then holds 3.
 */
const varCallbacks = [];
for (var index = 0; index < 3; index += 1) {
  varCallbacks.push(() => index);
}
console.log(varCallbacks.map((callback) => callback())); // [3, 3, 3]

/*
 * `let` is block-scoped. In a for loop, JavaScript creates a separate
 * iteration binding, so every callback retains its own value.
 */
const letCallbacks = [];
for (let index = 0; index < 3; index += 1) {
  letCallbacks.push(() => index);
}
console.log(letCallbacks.map((callback) => callback())); // [0, 1, 2]

/*
 * An IIFE was the pre-ES2015 solution: its parameter creates a fresh binding
 * for each loop iteration. Prefer `let` for new code.
 */
const iifeCallbacks = [];
for (var oldIndex = 0; oldIndex < 3; oldIndex += 1) {
  (function captureIteration(iteration) {
    iifeCallbacks.push(() => iteration);
  })(oldIndex);
}
console.log(iifeCallbacks.map((callback) => callback())); // [0, 1, 2]

/*
 * Two closures returned by one factory invocation share that invocation's
 * bindings. Closures from separate factory calls do not share state.
 */
function createSharedCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const sharedCounter = createSharedCounter();
console.log(sharedCounter.increment()); // 1
console.log(sharedCounter.increment()); // 2
console.log(sharedCounter.decrement()); // 1
console.log(sharedCounter.value()); // 1

/*
 * Currying and partial application rely on the same mechanism: each returned
 * function retains the arguments collected by earlier functions.
 */
const add = (first) => (second) => (third) => first + second + third;
console.log(add(1)(2)(3)); // 6

function addThreeNumbers(first, second, third) {
  return first + second + third;
}

const addTen = addThreeNumbers.bind(null, 10);
console.log(addTen(20, 30)); // 60

/*
 * Memory lifecycle:
 * - A reachable closure keeps the environment it needs reachable.
 * - Once no code can reach the closure, it and its captured environment are
 *   eligible for garbage collection.
 * - Long-lived event listeners, intervals, and caches can unintentionally
 *   retain DOM nodes or large data structures. Remove listeners, clear timers,
 *   and avoid capturing data that the callback does not need.
 *
 * Engines may optimize environments, so do not depend on a particular unused
 * local being collected early. Design long-lived closures to capture small,
 * intentional state instead.
 */
function attachListener(element) {
  const handler = () => {
    console.log("clicked");
  };

  element.addEventListener("click", handler);

  return function detachListener() {
    element.removeEventListener("click", handler);
  };
}

/*
 * Interview recap:
 * - A closure is a function plus its definition-site lexical environment.
 * - It retains bindings, not frozen copies of values.
 * - Factory calls create independent environments; closures from the same
 *   factory call can share state.
 * - Use closures for private state, configured functions, caches, `once`,
 *   debounce, and event handlers.
 * - `var` loop callbacks share one binding; `let` creates one per iteration.
 * - Manage long-lived listeners, timers, and caches to prevent accidental
 *   retention.
 */