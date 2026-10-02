
/*
Strategy Pattern is a behavioral design pattern that lets you choose one of several ways to perform a task at runtime.

Think of traveling from home to office:

• You can go by car
• Bike
• Metro

The destination is the same, but the way of traveling changes. Each travel method is a strategy.
*/

class PaymentStrategy {
  pay(amount) {
    throw new Error("This method should be overridden!");
  }
}

class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using Credit Card.`);
  }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using PayPal.`);
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item) {
    this.items.push(item);
  }

  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  checkout() {
    const totalAmount = this.items.reduce((total, item) => total + item.price, 0);
    if (this.paymentStrategy) {
      this.paymentStrategy.pay(totalAmount);
    } else {
      console.log("No payment strategy set.");
    }
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem({ name: "Laptop", price: 1000 });
cart.addItem({ name: "Mouse", price: 50 });

cart.setPaymentStrategy(new CreditCardPayment());
cart.checkout(); // Paid $1050 using Credit Card.

cart.setPaymentStrategy(new PayPalPayment());
cart.checkout(); // Paid $1050 using PayPal.