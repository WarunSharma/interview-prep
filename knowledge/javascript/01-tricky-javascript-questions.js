const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runExample(number, callback) {
    console.log(`--- Example ${number} ---`);
    await callback();
}

// 1. Object.freeze() vs Object.seal()
function example1() {
    let person1 = {
        name: "John",
        age: 30
    };

    let person2 = {
        name: "Jane",
        age: 25
    };

    // Object.freeze() makes the object immutable
    Object.freeze(person1);
    person1.age = 31; // ❌ This will not change the age
    console.log(person1.age); // 30

    // Object.seal() allows modification of existing properties but prevents adding/removing properties
    Object.seal(person2);
    person2.age = 26; // ✅ This will change the age
    console.log(person2.age); // 26

    person1.gender = "female"; // ❌ This will not add a new property
    console.log(person1.gender); // undefined

    person2.gender = "female"; // ❌ This will not add a new property
    console.log(person2.gender); // undefined
}

// 2. Functions are objects in JavaScript
function example2() {
    function greet() {
        console.log("Hello!");
    }

    greet.language = "English"; // ✅ Adding a property to the function object
    console.log(greet.language); // English
    greet(); // Hello!
}

// 3. Strict mode & global variables
function example3() {
    function getAge() {
        "use strict"; // Enabling strict mode
        // age = 30; // ❌ This will throw a ReferenceError because 'age' is not declared
        const age = 30; // ✅ Declaring 'age' with const
        console.log(age);
    }

    getAge(); // ReferenceError: age is not defined for the first case, and 30 for the second case.
}

// 4. Variable leakage
function example4() {
    function leakVariable() {
        var a = (b = 10); // ❌ 'b' is not declared, so it becomes a global variable
    }

    leakVariable(); // must actually call it for the leak to happen
    console.log(typeof b === "undefined"); // false, because 'b' is now a global variable
    console.log(typeof a === "undefined"); // true, because 'a' is function-scoped and not accessible outside
}

// 5. setTimeout with var vs let
async function example5() {
    await new Promise((resolve) => {
        let completedCallbacks = 0;

        for (var i = 0; i < 3; i++) {
            setTimeout(function() {
                // One i shared across all iterations due to var's function scope
                console.log("var:", i); // ❌ This will log "var: 3" three times
                completedCallbacks += 1;

                if (completedCallbacks === 3) {
                    resolve();
                }
            }, 1000);
        }
    });

    await new Promise((resolve) => {
        let completedCallbacks = 0;

        for (let j = 0; j < 3; j++) {
            setTimeout(function() {
                // Each j has its own block scope due to let
                console.log("let:", j); // ✅ This will log "let: 0", "let: 1", "let: 2"
                completedCallbacks += 1;

                if (completedCallbacks === 3) {
                    resolve();
                }
            }, 1000);
        }
    });
}

// 6. Event Loop Order
async function example6() {
    const foo = () => console.log("foo");
    const bar = () => setTimeout(() => console.log("bar"), 0);
    const baz = () => console.log("baz");

    bar();
    foo();
    baz();

    await delay(0);

    // Explanation: The output will be:
    // foo
    // baz
    // bar

    // This is because the setTimeout callback is placed in the task queue and will only be executed after the current call stack is empty, even if the delay is 0.
}

// 7. Microtasks vs Macrotasks
async function example7() {
    console.log("one");

    const timer = new Promise((resolve) => {
        setTimeout(() => {
            console.log("two");
            resolve();
        }, 0);
    });

    Promise.resolve().then(() => {
        console.log("three");
    });

    console.log("four");
    await timer;

    // Explanation: The output will be:
    // one; synchronous code runs first
    // four; synchronous code runs second
    // three; microtask runs after the current stack
    // two; macrotask runs last
}

// 8. Hoisting
/*
creation phase
var x -> hoisted, undefined
let/const x -> hoisted, uninitialized Temporal Dead Zone

Execution phase
x = 5 -> assignment
code runs top to bottom
TDZ ends at the first assignment to x

Note: Declarations are set up first; assignments happen when the line actually runs. That gap explains most hoisting puzzles.
Function declarations are hoisted to the top of their scope, so they can be called before they are defined. However, function expressions (including arrow functions) are not hoisted, so they cannot be called before they are defined.
*/
function example8() {
    console.log(a); // undefined: the declaration is hoisted, not its assignment
    var a = 1;

    if (true) {
        var a = 2; // Redeclares and assigns the same function-scoped variable
        console.log(a); // 2
    }

    console.log(a); // 2
}

// 9. Function vs variable hoisting
// Function declarations are hoisted before variables.
function example9() {
    console.log(typeof foo); // function, because 'foo' is hoisted as a function declaration
    function foo() {
        console.log("foo function");
    }
    var foo = 1;
    console.log(typeof foo); // number, because 'foo' is now a variable with value 1
}

// 10. Variable hoisting in Functions
function example10() {
    var name = "Global";

    function foo() {
        console.log(name); // undefined, because 'name' is hoisted as a variable declaration within the function scope
        var name = "Local";
        console.log(name); // Local
    }

    foo();
}

// 11. Prototype Inheritance
function example11() {
    const a = {
        foo: 123
    };
    const b = Object.create(a);

    console.log(b.foo); // 123, because 'b' inherits from 'a' through the prototype chain

    b.foo = 456; // This creates a new property 'foo' on 'b', shadowing the inherited property
    console.log(b.foo); // 456, because the new property on 'b' takes precedence over the inherited property

    delete b.foo;
    console.log(b.foo); // 123, because the inherited property is now visible again
}

// 12. Function Hoisting with Duplicate Names
// Function declarations are hoisted.
// The last declaration overrides previous ones.
function example12() {
    function x() {
        a(); // ✅ This will call the inner function 'a' and log 'a2'
        function a() {
            console.log("a1");
        }

        a(); // ✅ This will call the inner function 'a' and log 'a2'
        function a() {
            console.log("a2");
        }

        a(); // ✅ This will call the inner function 'a' and log 'a2'
    }

    x();
}

// 13. Async Await Execution
async function example13() {
    async function async1() {
        console.log("3");

        await delay(1000);
        console.log("4");
    }

    console.log("1");
    const asyncWork = async1();
    console.log("2");
    await asyncWork;

    // Explanation: The output will be:
    // 1
    // 3
    // 2
    // 4

    // This is because the async function starts executing immediately, but the code after the await is deferred until the promise resolves, allowing synchronous code to run in the meantime.
}

// 14. Promise + setTimeout
async function example14() {
    console.log("1");

    const firstTimer = new Promise((resolve) => {
        setTimeout(() => {
            console.log("3");
            resolve();
        }, 0);
    });

    const secondTimer = Promise.resolve("4").then(() => new Promise((resolve) => {
        setTimeout(() => {
            console.log("4");
            resolve();
        }, 0);
    }));

    Promise.resolve("5").then(() => console.log("5"));

    console.log("2");
    await Promise.all([firstTimer, secondTimer]);

    // Explanation: The output will be:
    // 1
    // 2
    // 5
    // 3
    // 4
}

// 15. Constructor Function
function example15() {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }

    const alice = new Person("Alice", 30);
    const bob = Person("Bob", 25);
    console.log(alice); // Person { name: 'Alice', age: 30 }
    console.log(bob); // undefined
}

// 16. Generator Functions: Check the behavior of generator functions in JavaScript
function example16() {
    function* generatorFunction() {
        yield 1;
        yield 2;
        return 3;
    }

    const generator = generatorFunction();

    console.log(generator.next()); // { value: 1, done: false }
    console.log(generator.next()); // { value: 2, done: false }
    console.log(generator.next()); // { value: 3, done: true }
}

// 17. Prototype Chain Lookup
function example17() {
    const animal = {
        sound: "generic"
    };

    const dog = Object.create(animal);
    dog.sound = "bark";

    console.log(dog.sound); // bark, because 'sound' is defined on 'dog'
    delete dog.sound;
    console.log(dog.sound); // generic, because 'sound' is now looked up the prototype chain to 'animal'
}

// 18. Arrow Function and this
// this: arrow vs normal function
// Arrow functions do not have their own 'this'; they inherit 'this' from the enclosing scope.
// Normal functions have their own 'this' based on how they are called.
function example18() {
    const obj = {
        name: "JS",
        show: () => {
            console.log(this.name);
        }
    };

    obj.show(); // undefined, because arrow functions do not have their own 'this' and inherit it from the enclosing scope
}

// 19. Promise Execution Order
// All sync code, THEN every queued microtask, THEN one macrotask. Memorize this order and output questions become easy.
async function example19() {
    console.log("Start");

    const firstPromise = Promise.resolve().then(() => {
        console.log("Promise 1");
    });

    const secondPromise = Promise.resolve().then(() => {
        console.log("Promise 2");
    });

    console.log("End");
    await Promise.all([firstPromise, secondPromise]);

    // Explanation: The output will be:
    // Start
    // End
    // Promise 1
    // Promise 2
}

// 20. Object Reference
function example20() {
    const obj1 = { a: 1 };
    const obj2 = obj1;

    obj2.a = 5;

    console.log(obj1.a); // 5, because obj1 and obj2 reference the same object in memory
}

// 21. Array Reference
function example21() {
    const arr1 = [1, 2, 3];
    const arr2 = arr1;

    arr2.push(4);

    console.log(arr1); // [1, 2, 3, 4], because arr1 and arr2 reference the same array in memory
}

// 22. Comparison
function example22() {
    console.log([] == []); // false, because each array is a different object in memory
    // console.log([] === []); // false, for the same reason

    console.log(NaN === NaN); // false, because NaN is not equal to itself
    console.log(Object.is(NaN, NaN)); // true, because Object.is correctly identifies NaN as the same value
}

async function main() {
    await runExample(1, example1);
    await runExample(2, example2);
    await runExample(3, example3);
    await runExample(4, example4);
    await runExample(5, example5);
    await runExample(6, example6);
    await runExample(7, example7);
    await runExample(8, example8);
    await runExample(9, example9);
    await runExample(10, example10);
    await runExample(11, example11);
    await runExample(12, example12);
    await runExample(13, example13);
    await runExample(14, example14);
    await runExample(15, example15);
    await runExample(16, example16);
    await runExample(17, example17);
    await runExample(18, example18);
    await runExample(19, example19);
    await runExample(20, example20);
    await runExample(21, example21);
    await runExample(22, example22);
}

main().catch(console.error);
