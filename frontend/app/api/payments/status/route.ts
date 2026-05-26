import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const email = searchParams.get("email");

    if (!teamId && !email) {
      return NextResponse.json({ error: "teamId or email is required." }, { status: 400 });
    }

    let teamExists = false;
    let emailExists = false;

    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { teamId },
      });
      teamExists = !!team;
    }

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      emailExists = !!user;
    }

    return NextResponse.json({
      success: true,
      teamExists,
      emailExists,
    });
  } catch (error) {
    console.error("Status check API error:", error);
    return NextResponse.json({ error: "Failed to verify database status." }, { status: 500 });
  }
}
