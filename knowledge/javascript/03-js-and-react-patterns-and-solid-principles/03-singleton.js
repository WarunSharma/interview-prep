
/*
Singleton Pattern: It is a creational design pattern. Every request for the object returns the
 same cached instance — used for things like a config store or a DB connection.
*/

class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }

    // Example method
    sayHello() {
        console.log("Hello from Singleton!");
    }
}

// Usage
const singleton1 = new Singleton();
const singleton2 = new Singleton();

console.log(singleton1 === singleton2); // Output: true
singleton1.sayHello(); // Output: Hello from Singleton!