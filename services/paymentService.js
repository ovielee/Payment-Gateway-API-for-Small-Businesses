const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/paymentModel');

const initiatePayment = async (customerName, customerEmail, amount) => {
  const paymentId = `PAY-${uuidv4()}`;

  const newPayment = new Payment(paymentId, customerName, customerEmail, amount, 'pending');
  Payment.create(newPayment);

  // Simulate payment gateway initialization
  return {
    paymentId,
    authorizationUrl: `https://paystack.com/authorize/${paymentId}`
  };
};

const getPaymentStatus = (paymentId) => {
  const payment = Payment.findById(paymentId);
  if (!payment) throw new Error('Payment not found');
  return payment;
};

module.exports = { initiatePayment, getPaymentStatus };