import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // 1. Verify Razorpay Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // 2. Process only captured payments or paid orders
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      // 3. Update DB atomically
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findFirst({
          where: { razorpayOrderId: orderId },
          include: { team: true }
        });

        if (!payment) {
          console.warn(`Webhook: Payment order ${orderId} not found in DB`);
          return;
        }

        // If already successful, ignore
        if (payment.status === 'SUCCESS') {
          return;
        }

        // Update payment to SUCCESS
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId: paymentId,
            razorpaySignature: signature
          },
        });

        // Update team status to APPROVED
        await tx.team.update({
          where: { id: payment.teamId },
          data: { status: 'APPROVED' },
        });

        // Fetch team members to send email
        const team = await tx.team.findUnique({
          where: { id: payment.teamId },
          include: { members: { include: { user: true } } },
        });

        // Queue confirmation email
        if (team && team.members.length > 0) {
          const leaderEmail = team.members[0].user.email;
          const leaderName = team.members[0].user.name || "Participant";
          if (leaderEmail) {
            try {
              await sendEmail({
                to: leaderEmail,
                subject: "Payment Success - IncuXai Gaming Hackathon! 🚀",
                html: `
                  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #22c55e;">Payment Verified Successfully! 🎉</h2>
                    <p>Hi <strong>${leaderName}</strong>,</p>
                    <p>We are excited to confirm that your payment for team <strong>${team.name}</strong> has been successfully received and verified via webhook.</p>
                    <p><strong>Team ID:</strong> ${team.teamId}</p>
                    <p><strong>Amount Paid:</strong> ₹${payment.amount}</p>
                    <p><strong>Razorpay Payment ID:</strong> ${paymentId}</p>
                    <p>Your team's registration status has been upgraded to <strong>APPROVED</strong>. You now have full access to the participant dashboard.</p>
                    <div style="margin-top: 30px; text-align: center;">
                      <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                    </div>
                  </div>
                `
              });
            } catch (emailErr) {
              console.error("Failed to send webhook confirmation email:", emailErr);
            }
          }
        }
      });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
