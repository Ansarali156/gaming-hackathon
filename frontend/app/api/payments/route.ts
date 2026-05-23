import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, teamId, category, memberCount } = body;

    if (action === "create-order") {
      let amount = 999;

      if (teamId) {
        // Find the team
        const team = await prisma.team.findUnique({
          where: { teamId },
          include: { payment: true },
        });

        if (!team) {
          return NextResponse.json({ error: "Team not found." }, { status: 404 });
        }

        // Check if already paid
        const existingSuccess = team.payment?.status === "SUCCESS";
        if (existingSuccess) {
          return NextResponse.json({ error: "Payment already completed." }, { status: 400 });
        }

        amount = team.payment?.amount || 999;
      } else {
        // Creating order without a teamId (pre-registration flow)
        if (!category || typeof memberCount !== "number") {
          return NextResponse.json({ error: "Category and memberCount are required to create order." }, { status: 400 });
        }

        const PRICING: Record<string, number> = { STUDENT: 300, IT_PROFESSIONAL: 1000, STARTUP: 1000 };
        const pricePerPerson = PRICING[category] ?? 300;
        amount = pricePerPerson * (memberCount + 1);
      }

      // Initialize Razorpay Order securely
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SDJLxYQuOsRKMU",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
      });

      const orderOptions = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`.substring(0, 40),
      };

      const order = await razorpay.orders.create(orderOptions);

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

      if (!paymentId || !orderId || !signature || !teamId) {
        return NextResponse.json({ error: "Missing required verification parameters." }, { status: 400 });
      }
      
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

      // Send payment confirmation email directly
      const teamWithMembers = await prisma.team.findUnique({
        where: { id: team.id },
        include: { members: { include: { user: true } } },
      });

      if (teamWithMembers && teamWithMembers.members.length > 0) {
        const leaderEmail = teamWithMembers.members[0].user.email;
        const leaderName = teamWithMembers.members[0].user.name || "Participant";
        if (leaderEmail) {
          try {
            await sendEmail({
              to: leaderEmail,
              subject: "Payment Success - IncuXai Gaming Hackathon! 🚀",
              html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #22c55e;">Payment Verified Successfully! 🎉</h2>
                  <p>Hi <strong>${leaderName}</strong>,</p>
                  <p>We are excited to confirm that your payment for team <strong>${teamWithMembers.name}</strong> has been successfully received.</p>
                  <p><strong>Team ID:</strong> ${teamWithMembers.teamId}</p>
                  <p><strong>Amount Paid:</strong> ₹${team.payment?.amount || 999}</p>
                  <p><strong>Razorpay Payment ID:</strong> ${paymentId}</p>
                  <p>Your team's registration status has been upgraded to <strong>APPROVED</strong>. You now have full access to the participant dashboard.</p>
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                  </div>
                </div>
              `
            });
          } catch (emailErr) {
            console.error("Failed to send payment verification email:", emailErr);
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: `Payment operation failed: ${error.message}` }, { status: 500 });
  }
}