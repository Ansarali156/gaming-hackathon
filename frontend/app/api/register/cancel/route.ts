import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
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

    if (user) {
      const teamMember = user.teamMembers[0];
      if (teamMember) {
        const team = teamMember.team;
        
        // Only rollback if the payment status is still PENDING!
        if (team.payment?.status === "PENDING") {
          await prisma.$transaction([
            prisma.payment.deleteMany({ where: { teamId: team.id } }),
            prisma.teamMember.deleteMany({ where: { teamId: team.id } }),
            prisma.team.delete({ where: { id: team.id } }),
            prisma.user.delete({ where: { id: user.id } })
          ]);
          console.log(`🧹 Rolled back pending registration for ${email}`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cancel registration failed:", err);
    return NextResponse.json({ error: "Failed to cancel registration" }, { status: 500 });
  }
}
