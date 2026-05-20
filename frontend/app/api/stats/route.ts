import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalTeams = await prisma.team.count();
    return NextResponse.json({ totalTeams });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ totalTeams: 0 });
  }
}
