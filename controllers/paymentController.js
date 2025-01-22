const payments = []; // In-memory database for simplicity

// Create a new payment
exports.createPayment = (req, res) => {
  const { customer_name, customer_email, amount } = req.body;

  // Validate input
  if (!customer_name || !customer_email || !amount) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields (customer_name, customer_email, amount) are required.',
    });
  }

  // Generate payment object
  const payment = {
    id: `PAY-${Date.now()}`, // Unique payment ID
    customer_name,
    customer_email,
    amount,
    status: 'pending',
  };

  payments.push(payment); // Add payment to the database

  return res.status(201).json({
    status: 'success',
    payment,
  });
};

// Retrieve a payment by ID
exports.getPaymentById = (req, res) => {
  const paymentId = req.params.id;

  const payment = payments.find((p) => p.id === paymentId);

  if (!payment) {
    return res.status(404).json({
      status: 'error',
      message: 'Payment not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    payment,
  });
};
