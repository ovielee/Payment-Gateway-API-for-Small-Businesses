const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Use payment routes
app.use(paymentRoutes);

module.exports = app;
