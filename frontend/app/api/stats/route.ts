import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalTeams = await prisma.team.count();

    const totalParticipants = await prisma.teamMember.count();

    return NextResponse.json({ totalTeams, totalParticipants });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ totalTeams: 0, totalParticipants: 0 });
  }
}
