/* =========================================================================
   CALL, APPLY, BIND — Interview Notes
   =========================================================================

   DEFINITIONS
   -----------
   All three are methods available on every function (via Function.prototype)
   that let you explicitly control what `this` refers to inside that function.

   - Function.prototype.call(thisArg, arg1, arg2, ...)
       Invokes the function IMMEDIATELY, with `this` set to `thisArg`.
       Extra arguments are passed individually (comma-separated).

   - Function.prototype.apply(thisArg, [argsArray])
       Same as call, but invokes the function IMMEDIATELY, and arguments
       are passed as a single array (or array-like object).

   - Function.prototype.bind(thisArg, arg1, arg2, ...)
       Does NOT invoke the function. Instead it returns a NEW function with
       `this` permanently bound to `thisArg` (and optionally pre-filled
       "partial application" arguments). The new function can be called
       later, any number of times.

   WHY DO WE NEED THIS?
   --------------------
   In JS, `this` is determined by HOW a function is called (call-site),
   not where it's defined. Regular function references passed around as
   callbacks (setTimeout, event handlers, array methods) lose their
   original `this`. call/apply/bind let us fix or explicitly set `this`.

   QUICK COMPARISON TABLE
   -----------------------
   | Method | Invokes now? | Arguments format      | Returns            |
   |--------|--------------|------------------------|---------------------|
   | call   | Yes          | comma-separated list   | function result     |
   | apply  | Yes          | array / array-like     | function result     |
   | bind   | No           | comma-separated list   | new bound function  |

   MNEMONIC: "A" in Apply = "Array" of arguments.

   COMMON INTERVIEW TALKING POINTS
   --------------------------------
   1. Method borrowing: call/apply let you reuse a method defined on one
      object/prototype with a different object as `this` (see examples
      below with array-like `arguments` object).
   2. Function currying / partial application: bind can pre-fill leading
      arguments, returning a specialized function.
   3. Arrow functions do NOT have their own `this`, so call/apply/bind
      have NO EFFECT on arrow functions — `this` stays lexically scoped.
   4. In non-strict mode, passing `null`/`undefined` as thisArg makes
      `this` default to the global object; in strict mode it stays
      null/undefined.
   5. bind is commonly used for event handlers/callbacks in class
      components (before arrow-function class fields existed).
   6. You can polyfill all three using closures — a classic interview
      "implement this yourself" question (see bottom of file).

   ========================================================================= */

/* -------------------------------------------------------------------------
   1) CALL — Use Case: Borrowing a method from another object
   ------------------------------------------------------------------------- */
function greet(greeting, punctuation = "!") {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const users = [
  { name: "Warun Sharma", occupation: "Engineer" },
  { name: "Ankit Kapadia", occupation: "Social Activist" },
  { name: "Sunidhi Rawat", occupation: "Cricketer" },
];

console.log("--- call: borrowing greet() for each user ---");
users.forEach((user) => {
  greet.call(user, "Hello");
});

// Classic "method borrowing" example: array-like objects don't have
// array methods, but we can borrow them via call/apply.
function sumArguments() {
  // `arguments` is array-like, not a real array — no .reduce() on it directly.
  return Array.prototype.reduce.call(
    arguments,
    (total, n) => total + n,
    0
  );
}
console.log("--- call: borrowing Array.prototype.reduce for `arguments` ---");
console.log(sumArguments(1, 2, 3, 4)); // 10

/* -------------------------------------------------------------------------
   2) APPLY — Use Case: Passing an array of arguments to a function
   ------------------------------------------------------------------------- */
console.log("--- apply: finding max/min with an array of values ---");
const salaries = [120000, 200000, 70000, 160000];
console.log("max:", Math.max.apply(null, salaries)); // 200000
console.log("min:", Math.min.apply(null, salaries)); // 70000

// Note: modern JS usually replaces this with the spread operator:
console.log("max (spread):", Math.max(...salaries));

// apply is also handy for forwarding an unknown number of arguments,
// e.g. inside a logging wrapper:
function logCall(fn, context, args) {
  console.log("Calling with args:", args);
  return fn.apply(context, args);
}
logCall(greet, { name: "Warun" }, ["Hi", "?"]);

/* -------------------------------------------------------------------------
   3) BIND — Use Case: Preserving `this` for callbacks, partial application
   ------------------------------------------------------------------------- */
const person = {
  name: "Warun Sharma",
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  },
};

console.log("--- bind: preventing loss of `this` in callbacks ---");
person.sayHello(); // "Hello, my name is Warun Sharma"
setTimeout(person.sayHello, 0); // "Hello, my name is undefined" — this is lost!
setTimeout(() => person.sayHello(), 0); // works — arrow fn captures lexical `this`
setTimeout(person.sayHello.bind(person), 0); // works — this permanently bound

// bind for partial application (pre-filling arguments):
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2); // pre-fills `a = 2`
console.log("--- bind: partial application ---");
console.log(double(5)); // 10
console.log(double(10)); // 20

// bind returns a NEW function each time — useful to know for equality checks
console.log(person.sayHello.bind(person) === person.sayHello.bind(person)); // false

/* -------------------------------------------------------------------------
   4) ARROW FUNCTIONS IGNORE call/apply/bind
   ------------------------------------------------------------------------- */
const arrowGreet = (greeting) => {
  // `this` here is lexically scoped from where arrowGreet was defined,
  // NOT from how it's invoked.
  console.log(`${greeting}, ${this?.name}`);
};
console.log("--- arrow functions ignore call/apply/bind ---");
arrowGreet.call({ name: "Ignored" }, "Hey"); // this.name is undefined/module-scope

/* -------------------------------------------------------------------------
   5) POLYFILLS — classic "implement Function.prototype.myCall/myApply/myBind"
   ------------------------------------------------------------------------- */
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis;
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this; // `this` is the function myCall was invoked on
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myApply = function (context, argsArray = []) {
  context = context || globalThis;
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  const result = context[fnSymbol](...argsArray);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};

console.log("--- polyfills sanity check ---");
greet.myCall({ name: "Polyfill Call" }, "Hi");
greet.myApply({ name: "Polyfill Apply" }, ["Hi"]);
const boundGreet = greet.myBind({ name: "Polyfill Bind" });
boundGreet("Hi");