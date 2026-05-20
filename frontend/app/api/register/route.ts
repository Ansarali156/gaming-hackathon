import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTeamId } from "@/lib/utils";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, teamName, leader, members, projectTheme, techStack, totalAmount } = body;

    if (!category || !teamName || !leader?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const teamId = await generateTeamId();

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(totalAmount);

    const team = await prisma.team.create({
      data: {
        teamId,
        name: teamName,
        category,
        projectTheme,
        techStack,
        members: {
          create: [
            {
              user: {
                connectOrCreate: {
                  where: { email: leader.email },
                  create: {
                    email: leader.email,
                    name: leader.name,
                    mobile: leader.mobile,
                  },
                },
              },
              role: "LEADER",
              skills: leader.skills,
            },
            ...members
              .filter((m: any) => m.email)
              .map((m: any) => ({
                user: {
                  connectOrCreate: {
                    where: { email: m.email },
                    create: {
                      email: m.email,
                      name: m.name,
                    },
                  },
                },
                role: "MEMBER",
                skills: m.skills,
                position: m.role,
              })),
          ],
        },
        payment: {
          create: {
            amount: totalAmount,
            status: "PENDING",
            razorpayOrderId: razorpayOrder.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        payment: true,
      },
    });

    return NextResponse.json({
      success: true,
      teamId: team.teamId,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      message: "Please complete payment to confirm registration",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
