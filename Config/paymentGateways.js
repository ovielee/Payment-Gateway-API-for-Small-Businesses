const axios = require('axios');
const { paystackApiKey } = require('./env');

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${paystackApiKey}`,
  },
});

module.exports = { paystack };
