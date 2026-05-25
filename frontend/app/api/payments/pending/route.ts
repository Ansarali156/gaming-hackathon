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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teamMembers: {
          include: {
            team: {
              include: { payment: true }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.teamMembers.length === 0) {
      return NextResponse.json({ error: "No team registered for this user." }, { status: 400 });
    }

    const team = user.teamMembers[0].team;
    const payment = team.payment;
    
    if (!payment) {
      return NextResponse.json({ error: "No payment record found for this team." }, { status: 404 });
    }

    // Construct secure payload for SUN redirection
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      category: team.category,
      baseAmount: payment.amount,
      amount: payment.amount,
      gst: payment.gst || 0,
      finalAmount: payment.finalAmount || (payment.amount * 1.02),
      teamId: team.teamId,
      teamName: team.name,
      callbackBase: process.env.NEXTAUTH_URL || "http://localhost:3000",
    };

    const sunRedirectUrl = makeSunRedirectUrl(payload as any);

    return NextResponse.json({
      teamName: team.name,
      teamId: team.teamId,
      amount: payment.finalAmount || (payment.amount * 1.02),
      category: team.category,
      userName: user.name || "Participant",
      userEmail: user.email,
      userMobile: user.mobile || "",
      sunRedirectUrl
    });
  } catch (error) {
    console.error("Pending payment API error:", error);
    return NextResponse.json({ error: "Failed to load payment details." }, { status: 500 });
  }
}
