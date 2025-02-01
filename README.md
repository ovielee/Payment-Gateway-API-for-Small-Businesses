**Building a Payment Gateway API for Small Businesses with CI/CD Deployment**

In this blog post, we will walk through the development and deployment of a Payment Gateway API tailored for small businesses. From architecture to implementation and deployment using Vercel, we’ll cover everything step by step. This guide assumes a basic understanding of Node.js and API development.

---

### **Project Overview**

The Payment Gateway API allows small businesses to initiate and track payments. It includes endpoints for:

- Creating a payment
- Retrieving payment status

Additionally, we implemented a CI/CD pipeline for automated testing and deployment to Vercel.

---

### **Architecture**

#### **Backend**

- **Framework**: Express.js
- **Database**: In-memory storage for simplicity (extendable to PostgreSQL or MongoDB)
- **Endpoints**:
  - `POST /api/v1/payments`: Create a new payment.
  - `GET /api/v1/payments/:id`: Retrieve payment status by ID.

#### **CI/CD Pipeline**

- **Platform**: GitHub Actions
- **Steps**:
  1. Test using Jest.
  2. Build the application.
  3. Deploy to Vercel.

#### **Deployment**

- **Platform**: Vercel
- **Build Output Directory**: `public`

---

### **Implementation**

#### **Step 1: Setting Up the Project**

1. **Initialize the Project**:

   ```bash
   mkdir payment-api
   cd payment-api
   npm init -y
   npm install express jest supertest dotenv
   ```

2. **Project Structure**:

   ```plaintext
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
   ```

#### **Step 2: Creating the API**

**server.js**

```javascript
const express = require('express');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**routes/paymentRoutes.js**

```javascript
const express = require('express');
const { createPayment, getPayment } = require('../controllers/paymentController');

const router = express.Router();
router.post('/', createPayment);
router.get('/:id', getPayment);

module.exports = router;
```

**controllers/paymentController.js**

```javascript
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
```

#### **Step 3: Writing Tests**

**tests/payment.test.js**

```javascript
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
```

#### **Step 4: Configuring CI/CD**

**.github/workflows/node.js.yml**

```yaml
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
    - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

#### **Step 5: Integrating Paystack API**

Paystack offers seamless payment integration. To integrate:

1. **Install Axios for HTTP Requests**:

   ```bash
   npm install axios
   ```

2. **Update Payment Controller**:

   **controllers/paymentController.js**

   ```javascript
   const axios = require('axios');

   exports.createPayment = async (req, res) => {
     const { amount, email } = req.body;

     try {
       const response = await axios.post('https://api.paystack.co/transaction/initialize',
         { amount, email },
         { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
       );

       const payment = response.data.data;
       res.status(201).json({ status: 'success', payment });
     } catch (error) {
       res.status(500).json({ status: 'error', message: error.message });
     }
   };
   ```

#### **Step 6: Using Postman for API Testing**

1. **Install Postman**:
   Download and install Postman from [postman.com](https://www.postman.com/).

2. **Test Endpoints**:
   - `POST /api/v1/payments`: Use a body with `amount` and `email` fields.
   - `GET /api/v1/payments/:id`: Test retrieval by providing a valid ID.

---

### **Deployment to Vercel**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create a Public Directory**:
   Add an `index.html` file in the `public` directory:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Payment Gateway API</title>
   </head>
   <body>
       <h1>Welcome to the Payment Gateway API</h1>
   </body>
   </html>
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

---

### **Architecture Summary**

- **API**: RESTful with Express.js.
- **Endpoints**: Payment initiation and retrieval.
- **Testing**: Automated tests with Jest and Supertest.
- **CI/CD**: Automated build, test, and deploy with GitHub Actions.
- **Hosting**: Vercel with a `public` directory for the frontend placeholder.

---

### **Final Thoughts**

By following this guide, you’ve built a simple yet functional Payment Gateway API with a robust CI/CD pipeline and integrated Paystack for real-world payment processing. This architecture can be extended to include authentication, a real database, and more advanced payment integrations. Happy coding!

