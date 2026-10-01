
/*
Builder Pattern: It is a creational design pattern used to construct complex objects step by step.
 Instead of using a giant constructor function with dozens of arguments (known as the "telescoping
 constructor" anti-pattern), the Builder pattern separates the construction logic from the object
 itself and uses method chaining (a fluent interface) to make object creation clear and readable.
*/

class Car {
    constructor() {
        this.make = '';
        this.model = '';
        this.year = 0;
        this.color = '';
    }
}

class CarBuilder {
    constructor() {
        this.car = new Car();
    }

    setMake(make) {
        this.car.make = make;
        return this; // Enable method chaining
    }

    setModel(model) {
        this.car.model = model;
        return this; // Enable method chaining
    }

    setYear(year) {
        this.car.year = year;
        return this; // Enable method chaining
    }

    setColor(color) {
        this.car.color = color;
        return this; // Enable method chaining
    }

    build() {
        return this.car;
    }
}

// Usage
const carBuilder = new CarBuilder();
const myCar = carBuilder
    .setMake('Toyota')
    .setModel('Camry')
    .setYear(2021)
    .setColor('Blue')
    .build();

console.log(myCar); // Output: Car { make: 'Toyota', model: 'Camry', year: 2021, color: 'Blue' }