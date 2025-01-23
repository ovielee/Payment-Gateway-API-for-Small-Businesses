const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Payment API!' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
