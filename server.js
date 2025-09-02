const express = require('express');
const app = express();
app.use(express.json());

let payments = [];
let paymentIdCounter = 1;

app.post('/process', (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;
  
  // Mock payment processing
  const success = Math.random() > 0.1; // 90% success rate
  
  const payment = {
    id: paymentIdCounter++,
    orderId,
    amount,
    paymentMethod,
    status: success ? 'completed' : 'failed',
    transactionId: success ? `txn_${Date.now()}` : null,
    createdAt: new Date()
  };
  
  payments.push(payment);
  
  if (success) {
    res.json(payment);
  } else {
    res.status(400).json({ error: 'Payment failed', payment });
  }
});

app.get('/:id', (req, res) => {
  const payment = payments.find(p => p.id === parseInt(req.params.id));
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json(payment);
});

app.get('/order/:orderId', (req, res) => {
  const orderPayments = payments.filter(p => p.orderId === parseInt(req.params.orderId));
  res.json(orderPayments);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'payment-service' });
});

app.listen(3004, () => console.log('Payment Service running on port 3004'));