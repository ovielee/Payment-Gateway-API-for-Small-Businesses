const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  paystackApiKey: process.env.PAYSTACK_API_KEY,
};
