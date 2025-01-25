# Payment-Gateway-API-for-Small-Businesses
Project Overview
The Payment Gateway API allows small businesses to initiate and track payments. It includes endpoints for:

Creating a payment
Retrieving payment status
Additionally, we implemented a CI/CD pipeline for automated testing and deployment to Vercel.

Architecture
Backend
Framework: Express.js
Database: In-memory storage for simplicity (extendable to PostgreSQL or MongoDB)
Endpoints:
POST /api/v1/payments: Create a new payment.
GET /api/v1/payments/:id: Retrieve payment status by ID.
Postman (API testing tool): Download from postman.com.
CI/CD Pipeline
Platform: GitHub Actions
Steps:
Test using Jest.
Build the application.
Deploy to Vercel.
Deployment
Platform: Vercel
Build Output Directory: public
Implementation
Step 1: Setting Up the Project
Initialize the Project:
mkdir payment-api
cd payment-api
npm init -y
npm install express jest supertest dotenv
2. Project Structure:

payment-api/
|-- server.js
|-- routes/
|   |-- paymentRoutes.js
|-- controllers/
|   |-- paymentController.js
|-- tests/
|   |-- payment.test.js
|-- public/
|   |-- index.html
|-- package.json
Install Dependencies
Install the libraries we need:
npm install express uuid axios
Express: Helps us build the API.
UUID: Creates unique payment IDs.
Axios: Makes HTTP requests (to talk to payment gateways).
Step 2: Creating the API
server.js

const express = require('express');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
routes/paymentRoutes.js

const express = require('express');
const { createPayment, getPayment } = require('../controllers/paymentController');

const router = express.Router();
router.post('/', createPayment);
router.get('/:id', getPayment);

module.exports = router;
controllers/paymentController.js

const payments = {};

exports.createPayment = (req, res) => {
  const id = `PAY-${Date.now()}`;
  payments[id] = { id, status: 'Pending' };
  res.status(201).json({ status: 'success', payment: payments[id] });
};

exports.getPayment = (req, res) => {
  const { id } = req.params;
  if (payments[id]) {
    res.status(200).json({ status: 'success', payment: payments[id] });
  } else {
    res.status(404).json({ status: 'error', message: 'Payment not found' });
  }
};
Step 3: Writing Tests
tests/payment.test.js

const request = require('supertest');
const app = require('../server');

describe('Payment API Tests', () => {
  it('should create a new payment', async () => {
    const response = await request(app).post('/api/v1/payments').send();
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.payment).toHaveProperty('id');
  });

  it('should retrieve a payment by ID', async () => {
    const createResponse = await request(app).post('/api/v1/payments').send();
    const paymentId = createResponse.body.payment.id;

    const getResponse = await request(app).get(`/api/v1/payments/${paymentId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.payment).toHaveProperty('id', paymentId);
  });
});
Step 4: Run the Server
Start the server:

node server.js
You should see:

Server running on http://localhost:3000
Testing API
Set Up Your API in Postman
Set Up Your API in Postman

Create a New Request:

Open Postman and click on “New” > “Request”.
Give your request a name (e.g., “Initiate Payment”) and save it in a collection (e.g., “Payment API”).
Set the API Endpoint:

In the URL bar, enter the endpoint for your API. For example:
http://localhost:3000/api/v1/payments for the POST request.
http://localhost:3000/api/v1/payments/{id} for the GET request (replace {id} with an actual payment ID).
Test the POST /api/v1/payments Endpoint
Set the Method:

From the dropdown next to the URL bar, select POST.
Set the Headers:

Go to the Headers tab.
Add the following header:
Content-Type: application/json
Set the Body:

Go to the Body tab.
Select raw and set the type to JSON.
Enter the request body in JSON format. For example:
{
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "amount": 50.00
}
Send the Request:

Click Send.
If the API is working correctly, you should see a response like this:
{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "PAY-123456",
    "authorizationUrl": "https://paystack.com/authorization_url"
  }
}
Check the Payment Gateway Link:

Copy the authorizationUrl from the response and open it in your browser to see the payment interface.
Step 5: Configuring CI/CD
.github/workflows/node.js.yml

name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js 16
      uses: actions/setup-node@v2
      with:
        node-version: 16
    - run: npm install
    - run: npm test
    - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}on:
  push:
    branches: [main]
  pull_request:
    branches: [main]




