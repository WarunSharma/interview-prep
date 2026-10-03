/*
 * Execution context and the call stack
 *
 * Every line of JavaScript runs inside an execution context (EC): the
 * engine's internal environment for tracking bindings, `this`, and outer
 * lexical scope.
 *
 * EC kinds:
 * - Global execution context (GEC): created once when a script begins.
 * - Function execution context (FEC): created for every function invocation.
 * - Eval execution context: created by eval(), which should generally be
 *   avoided.
 *
 * Each context conceptually contains:
 * - A Variable Environment for var and function declarations.
 * - A Lexical Environment for let/const and a link to the outer environment.
 * - A `this` binding.
 */

/*
 * Entering a context has two conceptual phases:
 *
 * 1. Creation/setup: var is initialized to undefined; function declarations
 *    receive their function values; let/const are registered but remain
 *    uninitialized in the TDZ; the outer lexical link and `this` are set up.
 * 2. Execution: statements run top to bottom, so assignments and calls happen
 *    at their source positions.
 */
console.log(createdVar); // undefined
console.log(fullyCreatedFunction()); // "function declaration"

var createdVar = 10;
function fullyCreatedFunction() {
  return "function declaration";
}

console.log(createdVar); // 10

try {
  console.log(tdzBinding);
  let tdzBinding = 1;
} catch (error) {
  console.log(error.name); // "ReferenceError"
}

/*
 * The call stack is a LIFO stack of execution contexts:
 * 1. The GEC is pushed when the script starts.
 * 2. Calling a function pushes a new FEC.
 * 3. Returning or throwing pops that FEC.
 *
 * Only the context on top of the single JavaScript call stack executes.
 */
function first() {
  console.log("first: start");
  second();
  console.log("first: end");
}

function second() {
  console.log("second: start");
  third();
  console.log("second: end");
}

function third() {
  console.log("third");
}

first();
/*
 * Stack trace:
 * GEC -> first -> second -> third
 *
 * Output:
 * first: start
 * second: start
 * third
 * second: end
 * first: end
 */

/*
 * Each invocation gets a fresh FEC and fresh local bindings. Recursion grows
 * the stack while callers wait for their recursive calls to return. A base
 * case lets those frames pop again.
 */
function depth(remaining) {
  if (remaining === 0) {
    return 0;
  }

  return 1 + depth(remaining - 1);
}

console.log(depth(1000)); // 1000

// No reachable base case continually pushes frames until the finite stack fills.
function runaway() {
  return runaway();
}

try {
  runaway();
} catch (error) {
  console.log(error.name + ": " + error.message);
  // RangeError: Maximum call stack size exceeded (message is engine-dependent)
}

/*
 * Scope chain and call stack answer different questions:
 * - The call stack is dynamic: it records runtime call order.
 * - The scope chain is lexical: it follows where code was defined.
 *
 * Variables resolve through a function's definition-site outer environment,
 * not through the locals of the function that called it.
 */
const x = "global";

function a() {
  const x = "a";
  b();
}

function b() {
  console.log(x);
}

a(); // "global", not "a"

/*
 * `this` is bound while an FEC is created, but ordinary functions determine
 * that value from their call site, not their definition site. In strict mode,
 * a plain function call receives undefined; a method call receives its object.
 * Arrow functions are different: they capture surrounding `this`.
 */
function strictThis() {
  "use strict";
  return this;
}

const receiver = { strictThis };
console.log(strictThis()); // undefined
console.log(receiver.strictThis() === receiver); // true

const detachedMethod = receiver.strictThis;
console.log(detachedMethod()); // undefined

/*
 * JavaScript executes synchronous code to completion on one call stack.
 * Timers, I/O, and events are handled by the runtime; their callbacks are
 * queued and can only push a new frame after the current stack has drained.
 * A zero-delay timer is therefore deferred, not immediate.
 */
console.log("A");
setTimeout(() => {
  console.log("B (timeout)");
}, 0);
console.log("C");
// Synchronous output is A, C. The timer logs B afterward.

/*
 * Interview recap:
 * - var is initialized to undefined during context setup; let/const are in
 *   the TDZ until their declarations execute.
 * - Function declarations are fully available during setup; function
 *   expressions only become callable when their assignment executes.
 * - Calls push FECs; returns and thrown errors pop them.
 * - Stack overflow requires unbounded recursion (or equivalent nested calls);
 *   its exact limit varies by engine and frame size.
 * - The stack tracks callers at runtime, while lexical scope tracks the
 *   definition site and powers closures.
 */