import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { verifyRazorpayPayment } from '../../lib/razorpay';
import { sendEmail, getPaymentSuccessEmailHtml, getPaymentFailureEmailHtml } from '../services/email';

export const paymentController = {
  async verifyPayment(req: Request, res: Response) {
    try {
      const { paymentId, orderId, signature, teamId } = req.body;

      if (!paymentId || !orderId || !signature || !teamId) {
        return res.status(400).json({ error: 'Missing required payment verification fields' });
      }

      // Verify Razorpay payment
      const isValid = await verifyRazorpayPayment(paymentId, orderId, signature);

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      // Update payment status
      const payment = await prisma.payment.updateMany({
        where: {
          razorpayOrderId: orderId,
          team: { teamId: teamId },
        },
        data: {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: 'SUCCESS',
        },
      });

      // Get team info for email
      const team = await prisma.team.findUnique({
        where: { teamId: teamId },
        include: { members: { include: { user: true } }, payment: true },
      });

      // Send success email
      if (team) {
        const leader = team.members.find(m => m.role === 'LEADER');
        if (leader?.user.email) {
          await sendEmail(
            leader.user.email,
            'Payment Successful - IncuXAI Gaming Hackathon',
            getPaymentSuccessEmailHtml(team.name, team.payment?.amount || 0)
          );
        }
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  },

  async handleWebhook(req: Request, res: Response) {
    try {
      const event = req.body;

      switch (event.event) {
        case 'payment.captured':
          await prisma.payment.updateMany({
            where: { razorpayPaymentId: event.payload.payment.entity.id },
            data: { status: 'SUCCESS' },
          });
          break;
        case 'payment.failed':
          await prisma.payment.updateMany({
            where: { razorpayOrderId: event.payload.payment.entity.order_id },
            data: { status: 'FAILED' },
          });
          break;
      }

      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },

  async getPaymentStatus(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { teamId },
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json({ success: true, payment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payment status' });
    }
  },
};