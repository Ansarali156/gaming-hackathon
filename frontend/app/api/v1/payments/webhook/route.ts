import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';


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

      // 3. Pessimistic locking to prevent race conditions via Prisma $transaction
      await prisma.$transaction(async (tx) => {
        // Fetch transaction and lock the row
        const transactions = await tx.$queryRaw<any[]>`
          SELECT * FROM payment_transactions 
          WHERE "razorpayOrderId" = ${orderId} 
          FOR UPDATE
        `;

        if (transactions.length === 0) {
          console.warn(`Webhook: Order ${orderId} not found in DB`);
          return;
        }

        const transaction = transactions[0];

        // 5. If already successful, ignore
        if (transaction.paymentStatus === 'SUCCESSFUL') {
          return;
        }

        // 6. Update to SUCCESSFUL
        await tx.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            paymentStatus: 'SUCCESSFUL',
            razorpayPaymentId: paymentId,
            verifiedAt: new Date(),
          },
        });

        // 7. Activate Team Registration (Optional: depend on schema)
        // Here we ensure the team status is APPROVED if it was PENDING
        await tx.team.updateMany({
          where: { id: transaction.teamId, status: 'PENDING' },
          data: { status: 'APPROVED' },
        });

        // Fetch team members to send email
        const team = await tx.team.findUnique({
          where: { id: transaction.teamId },
          include: { members: { include: { user: true } } },
        });

        // 8. Queue confirmation email
        if (team && team.members.length > 0) {
          const leaderEmail = team.members[0].user.email;
          if (leaderEmail) {
            await tx.emailOutbox.create({
              data: {
                recipientEmail: leaderEmail,
                emailType: 'PAYMENT_SUCCESS',
                contextPayload: {
                  teamName: team.name,
                  amount: transaction.amount,
                  transactionId: paymentId,
                },
                deliveryStatus: 'QUEUED',
              },
            });
          }
        }

        // Removed sync to Sun Backend because we are using direct razorpay integration now
      });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
