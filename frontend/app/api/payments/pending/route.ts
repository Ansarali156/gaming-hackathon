import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const amount = team.payment?.amount || 999;

    return NextResponse.json({
      teamName: team.name,
      teamId: team.teamId,
      amount,
      category: team.category,
      userName: user.name || "Participant",
      userEmail: user.email,
      userMobile: user.mobile || ""
    });
  } catch (error) {
    console.error("Pending payment API error:", error);
    return NextResponse.json({ error: "Failed to fetch payment details." }, { status: 500 });
  }
}
