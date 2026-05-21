import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay";

// Create a Razorpay order for a team
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, teamId, paymentId, orderId, signature } = body;

    if (action === "create-order") {
      if (!teamId) {
        return NextResponse.json({ error: "teamId is required." }, { status: 400 });
      }

      const payment = await prisma.payment.findFirst({
        where: { team: { teamId } },
      });

      if (!payment) {
        return NextResponse.json({ error: "No payment record found for this team." }, { status: 404 });
      }

      if (payment.status === "SUCCESS") {
        return NextResponse.json({ error: "Payment already completed." }, { status: 400 });
      }

      const order = await createRazorpayOrder(payment.amount);

      // Update the payment record with the new order ID
      await prisma.payment.update({
        where: { id: payment.id },
        data: { razorpayOrderId: order.id },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    if (action === "verify") {
      if (!paymentId || !orderId || !signature || !teamId) {
        return NextResponse.json({ error: "Missing verification fields." }, { status: 400 });
      }

      const isValid = await verifyRazorpayPayment(paymentId, orderId, signature);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
      }

      await prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: "SUCCESS",
        },
      });

      return NextResponse.json({ success: true, message: "Payment verified successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Payment operation failed." }, { status: 500 });
  }
}