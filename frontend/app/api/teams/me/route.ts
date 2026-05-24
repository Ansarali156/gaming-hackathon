import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teamMembers: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true, mobile: true, college: true, linkedin: true },
                    },
                  },
                },
                payment: true,
                submission: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get first team (leader or member)
    const teamMember = user.teamMembers[0];
    const team = teamMember?.team || null;

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Get my team error:", error);
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
  }
}
