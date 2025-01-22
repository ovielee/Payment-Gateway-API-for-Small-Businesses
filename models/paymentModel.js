let payments = []; // Temporary in-memory database

class Payment {
  constructor(id, customerName, customerEmail, amount, status) {
    this.id = id;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.amount = amount;
    this.status = status;
  }

  static create(payment) {
    payments.push(payment);
    return payment;
  }

  static findById(id) {
    return payments.find(payment => payment.id === id);
  }
}

module.exports = Payment;