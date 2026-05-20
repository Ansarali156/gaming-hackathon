import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPayment } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, orderId, signature, teamId } = body;

    if (!paymentId || !orderId || !signature || !teamId) {
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    // Verify Razorpay payment
    const isValid = await verifyRazorpayPayment(paymentId, orderId, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update payment status in database
    const payment = await prisma.payment.updateMany({
      where: {
        razorpayOrderId: orderId,
        teamId: teamId,
      },
      data: {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        status: "SUCCESS",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}