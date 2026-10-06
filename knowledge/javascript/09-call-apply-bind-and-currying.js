"use strict";

/*
 * call, apply, bind, currying, and composition
 *
 * `call`, `apply`, and `bind` are inherited from `Function.prototype`. They
 * set `this` explicitly rather than leaving it to the call site:
 *
 * - call(thisArg, arg1, arg2) invokes immediately with comma-separated args.
 * - apply(thisArg, [arg1, arg2]) invokes immediately with one array of args.
 * - bind(thisArg, arg1) returns a new function for later invocation.
 *
 * Memory hook: apply -> array; call -> comma list; bind bakes values in.
 */

const person = {
  fullName(city, country) {
    return `${this.first} ${this.last} from ${city}, ${country}`;
  },
};

const ada = { first: "Ada", last: "Lovelace" };

console.log(person.fullName.call(ada, "London", "UK"));
// "Ada Lovelace from London, UK"
console.log(person.fullName.apply(ada, ["London", "UK"]));
// "Ada Lovelace from London, UK"

const adaInLondon = person.fullName.bind(ada, "London");
console.log(adaInLondon("UK")); // "Ada Lovelace from London, UK"

/*
 * Method borrowing
 *
 * An array-like object has indexed properties and `length`, but it does not
 * inherit Array methods. `call` lets it borrow `Array.prototype.slice`.
 */
function argumentsAsArray() {
  return Array.prototype.slice.call(arguments);
}

console.log(argumentsAsArray(1, 2, 3)); // [1, 2, 3]

const numbers = [5, 6, 2, 9, 1];
console.log(Math.max.apply(null, numbers)); // 9

/*
 * Modern JavaScript usually prefers rest parameters and spread:
 *
 * function argumentsAsArray(...args) { return args; }
 * Math.max(...numbers);
 *
 * `apply` remains important for understanding explicit `this` and for code
 * that must work with a dynamically assembled argument array.
 */

/*
 * `bind` has two common uses:
 * 1. Partial application: leading arguments are pre-filled.
 * 2. Preserving a method's receiver after it is passed as a callback.
 */
function multiply(left, right) {
  return left * right;
}

const double = multiply.bind(null, 2);
console.log(double(8)); // 16

const counter = {
  count: 0,
  increment() {
    this.count += 1;
  },
};

const incrementCounter = counter.increment.bind(counter);
incrementCounter();
incrementCounter();
console.log(counter.count); // 2

/*
 * A bound receiver is permanent. Later `bind`, `call`, and `apply` calls
 * cannot replace it.
 */
function nameFromThis() {
  return this.name;
}

const boundToA = nameFromThis.bind({ name: "A" });
const stillBoundToA = boundToA.bind({ name: "B" });
console.log(stillBoundToA()); // "A"

/*
 * A `bind` polyfill:
 *
 * The basic implementation captures the source function and leading args,
 * then applies both the bound and call-time values later. The `new.target`
 * branch additionally matches native bind's constructor behavior: `new`
 * discards the bound receiver but keeps the pre-bound arguments.
 */
Function.prototype.myBind = function myBind(thisArg, ...boundArgs) {
  const target = this;

  function boundFunction(...callArgs) {
    const args = [...boundArgs, ...callArgs];

    if (new.target) {
      return Reflect.construct(
        target,
        args,
        new.target === boundFunction ? target : new.target,
      );
    }

    return target.apply(thisArg, args);
  }

  return boundFunction;
};

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const greetGrace = greet.myBind({ name: "Grace" }, "Hello");
console.log(greetGrace("!")); // "Hello, Grace!"

function Point(x, y) {
  this.x = x;
  this.y = y;
}

const PointAtX10 = Point.myBind({ ignored: true }, 10);
const point = new PointAtX10(20);
console.log(point.x, point.y); // 10 20
console.log(point instanceof Point); // true

/*
 * Currying transforms f(a, b, c) into f(a)(b)(c). This helper also accepts
 * groups of arguments, so all of these forms work:
 * curried(1)(2)(3), curried(1, 2)(3), curried(1)(2, 3), curried(1, 2, 3).
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function collectMore(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

function sum3(first, second, third) {
  return first + second + third;
}

const curriedSum3 = curry(sum3);
console.log(curriedSum3(1)(2)(3)); // 6
console.log(curriedSum3(1, 2)(3)); // 6
console.log(curriedSum3(1)(2, 3)); // 6
console.log(curriedSum3(1, 2, 3)); // 6

/*
 * Partial application and currying are related but distinct:
 *
 * - Partial application pre-fills some values and receives all remaining
 *   arguments in a later call: multiply.bind(null, 2)(8).
 * - Strict currying returns unary functions until it receives every argument:
 *   sum3(1)(2)(3).
 *
 * This flexible helper deliberately blurs the latter rule by accepting
 * argument groups. Also, `fn.length` is not always total parameter count:
 * default and rest parameters are excluded, so an arity-based curry can
 * invoke too early for `function example(a, b = 1, ...rest) {}`.
 */

/*
 * Composition chains unary functions. `compose` reads right-to-left; `pipe`
 * reads left-to-right.
 */
const compose = (...functions) => (value) =>
  functions.reduceRight((result, fn) => fn(result), value);
const pipe = (...functions) => (value) =>
  functions.reduce((result, fn) => fn(result), value);

const increment = (value) => value + 1;
const doubleValue = (value) => value * 2;

console.log(compose(increment, doubleValue)(5)); // 11: (5 * 2) + 1
console.log(pipe(increment, doubleValue)(5)); // 12: (5 + 1) * 2

/*
 * Gotchas
 *
 * Detaching a regular method loses its implicit receiver. In strict mode
 * (including modules and class methods), `this` is undefined for the
 * standalone call and accessing `this.name` throws. In a sloppy script,
 * `this` becomes the global object instead.
 */
const widget = {
  name: "widget",
  greet() {
    return `hi ${this.name}`;
  },
};

const detachedGreet = widget.greet;
try {
  detachedGreet();
} catch (error) {
  console.log(error.name); // "TypeError"
}

/*
 * Arrow functions capture lexical `this`; `call`, `apply`, and `bind` cannot
 * change it. This comparison is true regardless of the enclosing lexical
 * receiver, because both calls use the same captured value.
 */
const arrowThis = () => this;
console.log(arrowThis.call({ value: 1 }) === arrowThis()); // true

/*
 * `call(null)` and `apply(null)` keep `this` as null only in strict
 * functions. Sloppy functions substitute the global object. Passing null to
 * Math.max is safe because Math.max ignores its receiver.
 *
 * Quick checks:
 * - person.fullName.apply(ada, ["Paris", "France"])
 *   -> "Ada Lovelace from Paris, France"
 * - multiply.bind(null, 3)(5) -> 15
 * - curry(sum3)(1)(2, 3) -> 6
 */