import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all submissions for admin view
export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        team: {
          select: {
            teamId: true,
            name: true,
            category: true,
            status: true,
            members: {
              where: { role: "LEADER" },
              include: { user: { select: { name: true, email: true } } },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

