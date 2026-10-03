/*
 * JavaScript data types and coercion
 *
 * Interview essentials:
 * - JavaScript has seven primitive types: string, number, boolean, undefined,
 *   null, symbol, and bigint.
 * - Everything else is an object. Functions are callable objects.
 * - Primitives are immutable and compared by value. Objects are mutable and
 *   compared by reference (identity).
 */

// typeof: know its two important quirks.
console.log(typeof 42); // "number"
console.log(typeof "hi"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof 10n); // "bigint"
console.log(typeof Symbol("s")); // "symbol"
console.log(typeof {}); // "object"
console.log(typeof []); // "object" -- use Array.isArray for arrays
console.log(typeof null); // "object" -- a legacy language bug
console.log(typeof function () {}); // "function" -- a callable object subtype

/*
 * typeof null has returned "object" since the first JavaScript implementation:
 * null's original tagged representation collided with the object tag. It cannot
 * be fixed without breaking the web. Test null with `value === null`.
 *
 * A robust "plain object-like value" guard excludes null and arrays:
 * typeof value === "object" && value !== null && !Array.isArray(value)
 */

const candidate = {};
console.log(
  typeof candidate === "object" &&
    candidate !== null &&
    !Array.isArray(candidate),
); // true

// Primitives are copied by value.
let primitiveA = 10;
let primitiveB = primitiveA;
primitiveB = 20;
console.log(primitiveA); // 10

// Objects are copied by reference: both variables refer to the same object.
const object = { x: 1 };
const reference = object;
reference.x = 2;
console.log(object.x); // 2

/*
 * Passing an object to a function permits mutation of that object. Reassigning
 * the parameter only changes the local parameter binding, not the caller's one.
 */
function updateObject(value) {
  value.x = 3;
  value = { x: 4 };
  return value;
}

updateObject(object);
console.log(object.x); // 3

// Object equality checks identity, not contents.
console.log({} === {}); // false
console.log([1, 2] === [1, 2]); // false
console.log(object === reference); // true
console.log([1, 2].join() === [1, 2].join()); // true: strings are compared

/*
 * Strict equality (===) compares without conversion. Different types are false.
 * Loose equality (==) uses Abstract Equality Comparison:
 *
 * 1. Same type: compare similarly to === (with NaN and signed-zero exceptions).
 * 2. null == undefined is true; neither loosely equals anything else.
 * 3. Number vs string: convert the string to a number.
 * 4. Boolean vs anything: convert the boolean to a number, then compare again.
 * 5. Object vs number/string/bigint/symbol: convert the object to a primitive,
 *    using valueOf/toString, then compare again.
 * 6. BigInt vs number/string: compare mathematical values when conversion works.
 * 7. All other type combinations are false.
 *
 * Prefer ===. The intentional exception is `value == null`, a concise nullish
 * test that matches null and undefined, but not 0, "", or false.
 */
console.log(0 == ""); // true: "" becomes 0
console.log(0 == "0"); // true: "0" becomes 0
console.log("" == "0"); // false: same-type string comparison
console.log(false == ""); // true: both become 0
console.log(false == "0"); // true: both become 0
console.log(null == 0); // false
console.log([] == ""); // true: [] becomes ""
console.log([] == 0); // true: [] becomes "", then 0
console.log([0] == false); // true: both become 0
console.log(null == undefined); // true
console.log(null === undefined); // false

function greet(name) {
  if (name == null) {
    name = "friend";
  }

  return `hi ${name}`;
}

console.log(greet(undefined)); // "hi friend"
console.log(greet(null)); // "hi friend"
console.log(greet("")); // "hi "

/*
 * The three abstract conversion operations drive most coercion:
 *
 * ToNumber:
 * - Empty or whitespace-only strings become 0.
 * - null becomes 0; undefined becomes NaN.
 * - true becomes 1; false becomes 0.
 * - Arrays are first stringified: [] -> 0, [5] -> 5, [1, 2] -> NaN.
 * - Plain objects become NaN.
 */
console.log(Number("")); // 0
console.log(Number("  ")); // 0
console.log(Number("12px")); // NaN
console.log(Number("0x10")); // 16
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
console.log(Number([])); // 0
console.log(Number([5])); // 5
console.log(Number([1, 2])); // NaN
console.log(Number({})); // NaN

/*
 * ToString:
 * - null -> "null", undefined -> "undefined".
 * - Arrays join their elements with commas.
 * - Plain objects usually become "[object Object]".
 */
console.log(String(null)); // "null"
console.log(String(undefined)); // "undefined"
console.log(String([])); // ""
console.log(String([1, 2, 3])); // "1,2,3"
console.log(String({})); // "[object Object]"

/*
 * ToBoolean has exactly eight falsy values:
 * false, 0, -0, 0n, "", null, undefined, and NaN.
 * Everything else is truthy, including "0", "false", [], {}, and functions.
 */
console.log(Boolean("")); // false
console.log(Boolean("0")); // true
console.log(Boolean([])); // true
console.log(Boolean({})); // true
console.log(Boolean(NaN)); // false

/*
 * Arithmetic operators -, *, /, and % convert operands to numbers. + is special:
 * after object-to-primitive conversion, it concatenates if either operand is a
 * string; otherwise it performs numeric addition. Evaluation is left to right.
 */
console.log(1 + "1"); // "11"
console.log("5" + 2); // "52"
console.log("5" - 2); // 3
console.log("5" * "2"); // 10
console.log(1 + 2 + "3"); // "33"
console.log("1" + 2 + 3); // "123"
console.log("5" + 2 - 1); // 51: "52" is converted to 52 for subtraction

// Classic coercion outputs.
console.log([] + []); // ""
console.log([] + {}); // "[object Object]"
console.log({} + []); // "[object Object]" in expression position
console.log([] == ![]); // true
console.log("b" + "a" + +"a" + "a"); // "baNaNa"

/*
 * `{}` + [] is parse-dependent. In an expression (assignment, function call,
 * or console.log), {} is an object literal and the result is "[object Object]".
 * At the start of a browser-console statement, {} can parse as an empty block;
 * the remaining unary +[] evaluates to 0. Node's REPL wraps input and normally
 * treats it as an expression.
 */
console.log(+[]); // 0

/*
 * null and undefined are both falsy, but their intent differs:
 * - undefined: language-default absence (missing property, parameter, return).
 * - null: explicitly assigned intentional absence.
 *
 * Default parameters activate for undefined, not null. JSON.stringify omits
 * undefined-valued object properties, while null serializes as null.
 */
function withDefault(value = "default") {
  return value;
}

console.log(withDefault(undefined)); // "default"
console.log(withDefault(null)); // null
console.log(JSON.stringify({ absent: undefined, empty: null })); // {"empty":null}

/*
 * NaN is a number and the only value that is not equal to itself.
 * Global isNaN coerces before testing, so prefer Number.isNaN, which does not.
 * Object.is uses SameValue equality: it considers NaN equal to itself but
 * distinguishes -0 from 0.
 */
console.log(typeof NaN); // "number"
console.log(NaN === NaN); // false
console.log(NaN !== NaN); // true
console.log(isNaN("foo")); // true: "foo" first becomes NaN
console.log(Number.isNaN("foo")); // false
console.log(Number.isNaN(NaN)); // true
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(-0, 0)); // false
console.log(-0 === 0); // true

/*
 * JavaScript numbers are IEEE-754 double-precision floats. Decimal fractions
 * such as 0.1 and 0.2 cannot be represented exactly in binary. Compare computed
 * floating-point values with a tolerance instead of direct equality.
 */
const decimalSum = 0.1 + 0.2;
console.log(decimalSum); // 0.30000000000000004
console.log(decimalSum === 0.3); // false
console.log(Math.abs(decimalSum - 0.3) < Number.EPSILON); // true

/*
 * Number integers are only exact through Number.MAX_SAFE_INTEGER (2^53 - 1).
 * Use BigInt for larger exact integers. Do not mix BigInt and Number in
 * arithmetic without explicit conversion.
 */
console.log(9007199254740992 === 9007199254740993); // true: both round alike
console.log(9007199254740993n === 9007199254740993n); // true

// Relational comparisons coerce each intermediate boolean to a number.
console.log(1 < 2 < 3); // true: true becomes 1, then 1 < 3
console.log(3 > 2 > 1); // false: true becomes 1, then 1 > 1

// A nested typeof always ends as "string".
console.log(typeof typeof 1); // "string"

/*
 * Object-copy interview answer:
 * - `const copy = original` shares an object reference.
 * - `{ ...original }` and `[...original]` make shallow copies.
 * - `structuredClone(original)` makes a deep copy of supported data types.
 */
