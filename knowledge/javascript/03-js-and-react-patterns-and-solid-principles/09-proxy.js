
/*
Proxy pattern: It is a structural design pattern that provides an object representing another object. It 
is used to add an additional layer of control over the original object, such as access control, caching, 
or logging.
*/

class BankAccount {
  constructor(amount = 0) {
    this.amount = amount;
  }  
  pay(amount) {
    if (this.amount >= amount) {
      this.amount -= amount;
      console.log(`Bank paid $${amount}`);
    } else {
      console.log("Insufficient funds");
    }
  }
}

class CreditCard {
  constructor(bankAccount) {
    this.bankAccount = bankAccount;
  }

  pay(amount) {
    console.log("Card checking with bank...");
    this.bankAccount.pay(amount);
  }
}

const bank = new BankAccount(100);
const card = new CreditCard(bank);

card.pay(50);
card.pay(100);

// Card checking with bank...
// Bank paid $50
// Insufficient funds