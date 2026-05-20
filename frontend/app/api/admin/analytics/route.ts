import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalRegistrations, totalRevenue, discordJoins, categoryDistribution, dailyRegistrations] = await Promise.all([
      prisma.team.count(),
      prisma.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { discordJoined: true } }),
      prisma.team.groupBy({
        by: ["category"],
        _count: true,
      }),
      prisma.team.groupBy({
        by: ["createdAt"],
        _count: true,
        orderBy: { createdAt: "desc" },
        take: 7,
      }),
    ]);

    return NextResponse.json({
      totalRegistrations,
      totalRevenue: totalRevenue._sum.amount || 0,
      discordJoins,
      categoryDistribution,
      dailyRegistrations,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
