/*

A closure is a function that remembers the variables from its outer lexical 
scope even after the outer function has finished executing.
When a function is defined inside another function, it closes over the 
variables from the outer function — meaning it retains access to them even
 if the outer function has already returned.
Closures are heavily used in data privacy, encapsulation, function factories,
 and even in frameworks like React (e.g., hooks).
*/

function outer() {
  let counter = 0;

  return function inner() {
    counter++;
    console.log(counter);
  };
}

const increment = outer();
increment(); // 1
increment(); // 2

// 1) Data privacy / encapsulation
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private variable

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50));   // 150
console.log(account.withdraw(70));  // 80
console.log(account.getBalance());  // 80

// 2) Function factory using closure
function multiplier(factor) {
  return function (num) {
    return num * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3) Common pitfall: closures in loops
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log("var:", i), 0); // 4,4,4
}

for (let j = 1; j <= 3; j++) {
  setTimeout(() => console.log("let:", j), 0); // 1,2,3
}

// 4) Memoization (real-world optimization)
function memoizeSquare() {
  const cache = {};

  return function (n) {
    if (n in cache) {
      console.log("From cache");
      return cache[n];
    }
    console.log("Computed");
    cache[n] = n * n;
    return cache[n];
  };
}

const square = memoizeSquare();
console.log(square(4)); // Computed -> 16
console.log(square(4)); // From cache -> 16