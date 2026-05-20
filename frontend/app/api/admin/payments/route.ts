import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as PaymentStatus;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        team: {
          select: {
            teamId: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, status } = body;

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: status as PaymentStatus },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
