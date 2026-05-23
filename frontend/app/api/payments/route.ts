import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, teamId } = body;

    if (action === "create-order") {
      if (!teamId) {
        return NextResponse.json({ error: "teamId is required." }, { status: 400 });
      }

      // Find the team
      const team = await prisma.team.findUnique({
        where: { teamId },
        include: { payment: true, paymentTransactions: true, members: { include: { user: true } } },
      });

      if (!team) {
        return NextResponse.json({ error: "Team not found." }, { status: 404 });
      }

      // Check if already paid
      const existingSuccess = team.paymentTransactions.find(t => t.paymentStatus === "SUCCESSFUL");
      if (existingSuccess) {
        return NextResponse.json({ error: "Payment already completed." }, { status: 400 });
      }

      const amount = team.payment?.amount || 999;
      const user = team.members[0]?.user;

      // 1. Create PENDING internal transaction
      const transaction = await prisma.paymentTransaction.create({
        data: {
          teamId: team.id,
          amount,
          currency: "INR",
          paymentStatus: "PENDING",
        },
      });

      // 2. Initialize Razorpay Order securely directly from this serverless function
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "test_key",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
      });

      const orderOptions = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `rcpt_${transaction.id}`.substring(0, 40),
      };

      const order = await razorpay.orders.create(orderOptions);

      // 3. Update internal transaction with Razorpay Order ID
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { razorpayOrderId: order.id },
      });

      // Return order to frontend for checkout
      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    if (action === "verify") {
      const { paymentId, orderId, signature, teamId } = body;
      
      const crypto = require("crypto");
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "test_secret")
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (generated_signature !== signature) {
        return NextResponse.json({ error: "Verification failed. Invalid signature." }, { status: 400 });
      }

      // Find the team
      const team = await prisma.team.findUnique({
        where: { teamId },
        include: { payment: true }
      });

      if (!team) {
        return NextResponse.json({ error: "Team not found." }, { status: 404 });
      }

      // Update team status to APPROVED
      await prisma.team.update({
        where: { id: team.id },
        data: { status: "APPROVED" }
      });

      // Update payment status to SUCCESS
      if (team.payment) {
        await prisma.payment.update({
          where: { id: team.payment.id },
          data: {
            status: "SUCCESS",
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature
          }
        });
      }

      // Create successful payment transaction
      await prisma.paymentTransaction.create({
        data: {
          teamId: team.id,
          paymentStatus: "SUCCESSFUL",
          amount: team.payment?.amount || 999,
          currency: "INR",
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          verifiedAt: new Date()
        }
      });

      // Queue confirmation email to the Team Lead
      const teamWithMembers = await prisma.team.findUnique({
        where: { id: team.id },
        include: { members: { include: { user: true } } },
      });

      if (teamWithMembers && teamWithMembers.members.length > 0) {
        const leaderEmail = teamWithMembers.members[0].user.email;
        if (leaderEmail) {
          await prisma.emailOutbox.create({
            data: {
              recipientEmail: leaderEmail,
              emailType: 'PAYMENT_SUCCESS',
              contextPayload: {
                teamName: teamWithMembers.name,
                amount: team.payment?.amount || 999,
                transactionId: paymentId,
              },
              deliveryStatus: 'QUEUED',
            }
          });
        }
      }

      // Removed sync to sun backend as we are using direct razorpay integration

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: `Payment operation failed: ${error.message}` }, { status: 500 });
  }
}