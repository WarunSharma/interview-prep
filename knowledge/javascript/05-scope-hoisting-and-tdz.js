/*
 * Scope, hoisting, and the Temporal Dead Zone (TDZ)
 *
 * Scope decides where a name is visible. Hoisting describes bindings created
 * before a scope executes. The TDZ is the period where a let/const/class
 * binding exists but cannot yet be read.
 *
 * JavaScript has lexical (static) scope: the variables a function can access
 * are determined by where it is written, not by where it is called. This is
 * why closures retain access to variables from their enclosing scopes.
 */

// Scope kinds: global, function, and block.
const globalValue = "global";

function outer() {
  const outerValue = "outer";

  function inner() {
    // Lookup starts locally and walks outward through lexical parent scopes.
    console.log(globalValue, outerValue); // "global outer"
  }

  inner();
}

outer();

/*
 * var is function-scoped: it ignores block boundaries and belongs to the
 * nearest enclosing function (or the global scope). let and const are
 * block-scoped, so they exist only inside their containing `{ ... }`.
 */
{
  var functionScoped = 1;
  let blockScoped = 2;
  const alsoBlockScoped = 3;

  console.log(functionScoped, blockScoped, alsoBlockScoped); // 1 2 3
}

console.log(functionScoped); // 1
try {
  console.log(blockScoped);
} catch (error) {
  console.log(error.name + ": " + error.message); // ReferenceError: blockScoped is not defined
}

/*
 * Hoisting is the setup work done before execution of a scope:
 * - var declarations are created and initialized to undefined.
 * - Function declarations are created with their function values.
 * - let, const, and class declarations are created but remain uninitialized
 *   until execution reaches their declaration.
 *
 * Initializers and assignments always execute in source order; they are not
 * moved upward.
 */
console.log(hoistedVar); // undefined
var hoistedVar = 5;
console.log(hoistedVar); // 5

console.log(add(2, 3)); // 5
function add(left, right) {
  return left + right;
}

try {
  subtract(5, 2);
} catch (error) {
  console.log(error.name + ": " + error.message); // TypeError: subtract is not a function
}

var subtract = function (left, right) {
  return left - right;
};

/*
 * A function declaration wins over a var declaration with the same name
 * during setup. The later var assignment still replaces the function value
 * during execution.
 */
console.log(typeof sharedName); // "function"
var sharedName = "string value";
function sharedName() {}
console.log(typeof sharedName); // "string"

/*
 * TDZ: from entering a block until the let/const declaration executes, an
 * access to that binding throws ReferenceError. The TDZ is temporal: it ends
 * when execution reaches the declaration, not at a fixed source position.
 */
try {
  console.log(tdzValue);
  let tdzValue = 10;
} catch (error) {
  console.log(error.name + ": " + error.message); // ReferenceError: Cannot access 'tdzValue' before initialization
}

// typeof is safe for names never declared, but not for a name in its TDZ.
console.log(typeof neverDeclared); // "undefined"
try {
  console.log(typeof anotherTdzValue);
  let anotherTdzValue = 1;
} catch (error) {
  console.log(error.name); // "ReferenceError"
}

// const/let function expressions and arrow functions are TDZ-guarded too.
try {
  greet();
} catch (error) {
  console.log(error.name + ": " + error.message); // ReferenceError: Cannot access 'greet' before initialization
}

const greet = () => "hi";
console.log(greet()); // "hi"

/*
 * Closures capture bindings, not snapshot values.
 *
 * With var, every iteration shares one function-scoped i. Once the loop ends,
 * i is 3, which is what every stored function observes.
 */
var varFunctions = [];
for (var i = 0; i < 3; i++) {
  varFunctions.push(function () {
    return i;
  });
}
console.log(varFunctions[0](), varFunctions[1](), varFunctions[2]()); // 3 3 3

/*
 * A for loop with let creates a fresh binding for each iteration, so each
 * closure sees its iteration's i.
 */
const letFunctions = [];
for (let index = 0; index < 3; index++) {
  letFunctions.push(function () {
    return index;
  });
}
console.log(letFunctions[0](), letFunctions[1](), letFunctions[2]()); // 0 1 2

/*
 * Before ES2015, an IIFE supplied a per-iteration function parameter binding.
 * Blocks with let/const or ES modules are the modern ways to create private
 * scope.
 */
var iifeFunctions = [];
for (var current = 0; current < 3; current++) {
  (function (iteration) {
    iifeFunctions.push(function () {
      return iteration;
    });
  })(current);
}
console.log(iifeFunctions[0](), iifeFunctions[1](), iifeFunctions[2]()); // 0 1 2

/*
 * const prevents rebinding a variable; it does not make the referenced value
 * immutable. Object.freeze is a separate, shallow immutability operation.
 */
const user = { name: "Ada" };
user.name = "Grace";
user.age = 40;
console.log(user); // { name: "Grace", age: 40 }

try {
  user = {};
} catch (error) {
  console.log(error.name + ": " + error.message); // TypeError: Assignment to constant variable.
}

/*
 *                 var              let              const
 * Scope           function/global  block            block
 * Reassign         yes              yes              no
 * Redeclare        yes              no               no
 * Use before line  undefined        ReferenceError   ReferenceError
 * Object mutation  yes              yes              yes
 *
 * Redeclaring let/const in the same scope is a parse-time SyntaxError. Keep
 * this invalid code commented so the rest of this educational file can run.
 */
// let duplicate = 1;
// let duplicate = 2; // SyntaxError: Identifier 'duplicate' has already been declared

/*
 * Shadowing: an inner declaration with the same name hides the outer binding
 * for the inner scope. The outer value itself is not changed.
 */
let label = "outer";
function demonstrateShadowing() {
  let label = "inner";
  console.log(label); // "inner"
}

demonstrateShadowing();
console.log(label); // "outer"

/*
 * var leaks from if/for blocks, while let does not. A const loop counter fails
 * in a traditional for loop because `counter++` tries to reassign it. const
 * is appropriate in for...of / for...in headers because each iteration gets
 * a new binding.
 */
if (true) {
  var leakedFromBlock = "visible outside";
}
console.log(leakedFromBlock); // "visible outside"

for (const value of ["a", "b"]) {
  console.log(value); // "a", then "b"
}

/*
 * Interview recap:
 * - Lexical scope is based on source nesting, never the call stack.
 * - var is function-scoped and initialized to undefined during setup.
 * - Function declarations are callable before their source line.
 * - let/const are block-scoped and throw when accessed in their TDZ.
 * - Prefer const, use let for reassignment, and avoid var in new code.
 * - const locks a binding, not an object or array's contents.
 */