// Refer this: https://www.youtube.com/watch?v=oUWRxJ19gfE&list=PLKhlp2qtUcSaCVJEt4ogEFs6I41pNnMU5

/*
Scope:
✔️ Scope defines where variables are accessible.

Function Scope:
function greet() {
    var message = "Hello";
    console.log(message); // Accessible here
}    
console.log(message); // ❌ Not accessible

Block Scope:
if (true){
    let name = "Warun";
    const age = 30;
    console.log(name, age); // ✅
}
for (let i = 0; i < 3; i++) {
    console.log(i); // ✅
}   
console.log(name); // ❌ ReferenceError

✔️ var => function-scoped
✔️ let, const => block-scoped

Mutability:
✔️ var, let => can be reassigned
✔️ const => cannot be reassigned (but objects/arrays can mutate)

let count = 1;
count = 2; // ✅

const name = "Warun";
name = "Sharma"; // ❌ Error

const user = { name: "A" };
user.name = "B"; // ✅ Allowed

Hoisting:
✔️ var => hoisted & initialized as undefined
✔️ let/const => hoisted but in Temporal Dead Zone (TDZ)

console.log(a); // undefined
var a = 5;

console.log(b); // ❌ ReferenceError
let b = 10;

Temporal Dead Zone (TDZ):
✔️ The phase between hoisting and declaration where access throws an error

function demo() {
    console.log(x); // ❌ ReferenceError
    let x = 10;
}

Shadowing:
✔️ Inner variable with same name hides the outer one

function test() {
    let a = 'Hi';
    if (true) {
        let a = 'Hello'; // shadows outer 'a'
        console.log(a);  // Hello
    }
    console.log(a);      // Hi
}

✔️ let can shadow var, but var cannot shadow let

function example() {
    var x = 10;
    {
        let x = 20; // ✅ shadows outer x
        console.log(x); // 20
    }
    console.log(x); // 10
}

Declaration Rules:
✔️ var => can be redeclared
✔️ let, const => cannot be redeclared in the same scope

var x = 1;
var x = 2; // ✅

let y = 1;
let y = 2; // ❌ SyntaxError

const z = 5;
const z = 10; // ❌ SyntaxError
*/

// var i = 1
function main() {
  for (var i = 0; i < 3; i++) {
    setTimeout((i) => {
      console.log(i); // 0, 1, 2
    }, 1000, i);
  }
  console.log(i); // 3
}
main();

// Declaration
// var a = undefined; // Hoisted
// var a = 1; // Reassigned

// Definition
// var a = 1;