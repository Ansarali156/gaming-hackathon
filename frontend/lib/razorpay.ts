import Razorpay from 'razorpay';

let _razorpay: Razorpay | null = null;

function getRazorpay(): Razorpay | null {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn('⚠️ Razorpay credentials not configured. Using mock Razorpay implementation for local development.');
      return null;
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

export async function createRazorpayOrder(amount: number) {
  try {
    const rzp = getRazorpay();
    
    // MOCK IMPLEMENTATION IF NO KEYS
    if (!rzp) {
      return {
        id: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        status: 'created'
      };
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rzp.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
}

export async function verifyRazorpayPayment(
  paymentId: string,
  orderId: string,
  signature: string
) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // MOCK VERIFICATION
      return paymentId.startsWith('mock_') || signature.startsWith('mock_') || true;
    }

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    return false;
  }
}

