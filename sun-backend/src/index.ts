// Secure distributed Razorpay payment microservice integration on port 5000
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || 'super-secret-key-for-local';
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

// Security Middleware: HMAC Validation
function hmacValidation(req: express.Request, res: express.Response, next: express.NextFunction) {
  const signature = req.headers['x-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(401).json({ error: 'Missing or invalid signature' });
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', INTERNAL_SERVICE_SECRET)
    .update(payload)
    .digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
}

// Routes
app.post('/api/internal/orders', hmacValidation, async (req, res) => {
  try {
    const { transactionId, amount, currency, userDetails } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency: currency || "INR",
      receipt: `rcpt_${transactionId}`.substring(0, 40),
    };

    const order = await razorpay.orders.create(options);

    // 2. Save order metadata in payment_ledger
    await prisma.paymentLedger.create({
      data: {
        sourceTransactionId: transactionId,
        payerName: userDetails?.name,
        payerEmail: userDetails?.email,
        payerPhone: userDetails?.phone,
        razorpayOrderId: order.id,
        status: 'CREATED',
        rawPayload: order as any,
      },
    });

    // 3. Return order details
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/internal/sync', hmacValidation, async (req, res) => {
  try {
    const { transactionId, razorpayOrderId, razorpayPaymentId, status } = req.body;

    if (!transactionId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update ledger to final status
    const updatedLedger = await prisma.paymentLedger.updateMany({
      where: {
        OR: [
          { sourceTransactionId: transactionId },
          { razorpayOrderId: razorpayOrderId }
        ]
      },
      data: {
        status: status,
        razorpayPaymentId: razorpayPaymentId,
      },
    });

    if (updatedLedger.count === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error syncing ledger:', error);
    res.status(500).json({ error: 'Failed to sync ledger' });
  }
});

app.listen(port, () => {
  console.log(`Sun Backend (Payment Microservice) running on port ${port}`);
});
