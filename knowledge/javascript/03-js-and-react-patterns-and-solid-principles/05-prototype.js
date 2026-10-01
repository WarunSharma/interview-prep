
/*
Prototype Pattern: It is a creational design pattern that allows you to create new objects by cloning existing ones.
*/

function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
}

const person1 = new Person('Alice', 30);
// Clone person1 to create person2
const person2 = Object.create(person1);
person2.name = 'Bob';
person2.age = 25;

console.log(person1); // Output: Person { name: 'Alice', age: 30 }
console.log(person2); // Output: Person { name: 'Bob', age: 25 }