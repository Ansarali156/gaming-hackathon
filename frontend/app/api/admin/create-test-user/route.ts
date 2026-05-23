import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const email = 'testplayer@incuxai.com';
    const password = await bcrypt.hash('password123', 10);

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: { password }
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: 'Test Player',
          password,
          role: 'PARTICIPANT',
          mobile: '1234567890'
        }
      });
    }

    // Create team if not exists
    const teamId = 'TEAM-TEST-123';
    let team = await prisma.team.findUnique({ where: { teamId } });
    
    if (!team) {
      team = await prisma.team.create({
        data: {
          teamId,
          name: 'Test Squad',
          category: 'STUDENT',
          status: 'APPROVED',
        }
      });
    }

    // Add user to team
    const memberExists = await prisma.teamMember.findFirst({ where: { userId: user.id } });
    if (!memberExists) {
      await prisma.teamMember.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: 'LEADER'
        }
      });
    }

    // Add successful payment
    const paymentExists = await prisma.payment.findUnique({ where: { teamId: team.id } });
    if (!paymentExists) {
      await prisma.payment.create({
        data: {
          teamId: team.id,
          amount: 500,
          status: 'SUCCESS'
        }
      });
    }

    return NextResponse.json({ success: true, message: "Test user created on this database!" });
  } catch (error: any) {
    console.error("Failed to create test user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
