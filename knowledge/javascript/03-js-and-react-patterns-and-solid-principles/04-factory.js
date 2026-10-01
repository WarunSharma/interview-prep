
/*
Factory Pattern: It is a creational design pattern. It defines an interface for creating objects, 
but subclasses decide which class to instantiate. It is used when the exact type of objects to 
create is not known until runtime and multiple related objects need to be created.

Example:
Creating different types of vehicles in a manufacturing system.
*/

class Vehicle {
    constructor(type) {
        this.type = type;
    }

    printType() {
        console.log(`Vehicle type: ${this.type}`);
    }
}

class VehicleFactory {
    createVehicle(type) {
        return new Vehicle(type);
    }
}

// Usage
const factory = new VehicleFactory();

const car = factory.createVehicle('Car');
car.printType(); // Output: Vehicle type: Car

const bike = factory.createVehicle('Bike');
bike.printType(); // Output: Vehicle type: Bike

