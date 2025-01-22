const request = require('supertest');
const app = require('../app');

describe('Payment API Tests', () => {
  it('should create a new payment', async () => {
    const response = await request(app)
      .post('/api/v1/payments')
      .send({
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        amount: 50.0,
      });

    console.log('POST response:', response.body);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.payment).toHaveProperty('id');
  });

  it('should retrieve a payment by ID', async () => {
    // Create a payment
    const createResponse = await request(app)
      .post('/api/v1/payments')
      .send({
        customer_name: 'Jane Doe',
        customer_email: 'jane.doe@example.com',
        amount: 100.0,
      });

    console.log('POST response for GET test:', createResponse.body);

    const paymentId = createResponse.body.payment.id;

    // Retrieve the payment
    const getResponse = await request(app).get(`/api/v1/payments/${paymentId}`);

    console.log('GET response:', getResponse.body);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.status).toBe('success');
    expect(getResponse.body.payment.id).toBe(paymentId);
  });
});
