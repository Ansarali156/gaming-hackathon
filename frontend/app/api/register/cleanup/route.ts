import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { teamId } = await request.json();

    if (!teamId) {
      return NextResponse.json({ error: "teamId is required" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { teamId },
      include: {
        payment: true,
        paymentTransactions: true,
        members: true
      }
    });

    if (!team) {
      return NextResponse.json({ success: true, message: "Team not found" });
    }

    // Only delete if payment is pending
    const isPaid = team.paymentTransactions.some(t => t.paymentStatus === 'SUCCESSFUL') || team.payment?.status === 'SUCCESS';
    
    if (isPaid) {
      return NextResponse.json({ error: "Cannot delete a paid team" }, { status: 400 });
    }

    const userIdsToDelete = team.members.map(m => m.userId).filter(Boolean);

    // Clean up
    await prisma.teamMember.deleteMany({ where: { teamId: team.id } });
    await prisma.paymentTransaction.deleteMany({ where: { teamId: team.id } });
    if (team.payment) {
      await prisma.payment.delete({ where: { id: team.payment.id } });
    }
    await prisma.team.delete({ where: { id: team.id } });

    for (const userId of userIdsToDelete) {
      await prisma.user.deleteMany({
        where: { id: userId, role: "PARTICIPANT" }
      });
    }

    return NextResponse.json({ success: true, message: "Cleaned up unpaid registration" });
  } catch (error) {
    console.error("Cleanup API error:", error);
    return NextResponse.json({ error: "Failed to clean up team" }, { status: 500 });
  }
}
