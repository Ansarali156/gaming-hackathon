import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeSunRedirectUrl } from "@/lib/sunForwarder";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Find pending registration draft by email
    const pendingReg = await prisma.pendingRegistration.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!pendingReg) {
      return NextResponse.json({ error: "No pending registration found for this email." }, { status: 404 });
    }

    const payload = pendingReg.payload as any;
    const teamName = payload.teamName;
    const teamId = payload.teamId;
    const amount = payload.finalAmount;
    const category = payload.category;
    const userName = payload.leader.name;
    const userEmail = payload.leader.email;
    const userMobile = payload.leader.mobile || "";

    // Construct secure payload for SUN redirection
    const redirectPayload = {
      id: pendingReg.id,
      email: userEmail,
      name: userName,
      mobile: userMobile,
      category,
      baseAmount: payload.baseAmount,
      amount: payload.baseAmount,
      gst: payload.gst || 0,
      finalAmount: amount,
      teamId,
      teamName,
      callbackBase: process.env.NEXTAUTH_URL || "http://localhost:3000",
    };

    const sunRedirectUrl = makeSunRedirectUrl(redirectPayload as any);

    return NextResponse.json({
      teamName,
      teamId,
      amount,
      category,
      userName,
      userEmail,
      userMobile,
      sunRedirectUrl
    });
  } catch (error) {
    console.error("Pending payment API error:", error);
    return NextResponse.json({ error: "Failed to load payment details." }, { status: 500 });
  }
}
