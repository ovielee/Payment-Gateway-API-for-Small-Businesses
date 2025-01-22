const express = require('express');
const { createPayment, getPaymentById } = require('../controllers/paymentController');

const router = express.Router();

// POST endpoint to create a payment
router.post('/api/v1/payments', createPayment);

// GET endpoint to retrieve a payment by ID
router.get('/api/v1/payments/:id', getPaymentById);

module.exports = router;
