import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const [
      totalRegistrations,
      totalRevenue,
      discordJoins,
      pendingPayments,
      categoryDistribution,
      allTeams,
      allPayments,
      referralsCount,
      referralPointsAggregate
    ] = await Promise.all([
      prisma.team.count(),
      prisma.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { discordJoined: true } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.team.groupBy({
        by: ["category"],
        _count: true,
      }),
      prisma.team.findMany({
        select: { createdAt: true },
      }),
      prisma.payment.findMany({
        where: { status: "SUCCESS" },
        select: { amount: true, createdAt: true },
      }),
      prisma.referral.count(),
      prisma.referral.aggregate({
        _sum: { points: true },
      })
    ]);

    // Build 7-day registration trends
    const dailyRegistrations = past7Days.map(date => {
      const count = allTeams.filter(t => {
        const d = new Date(t.createdAt);
        return d.toDateString() === date.toDateString();
      }).length;
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        _count: count
      };
    });

    // Build 7-day revenue trends
    const revenueTrends = past7Days.map(date => {
      const amount = allPayments.filter(p => {
        const d = new Date(p.createdAt);
        return d.toDateString() === date.toDateString();
      }).reduce((sum, p) => sum + p.amount, 0);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount
      };
    });

    // Referral analytics
    const referralAnalytics = {
      totalReferrals: referralsCount,
      totalPoints: referralPointsAggregate._sum.points || 0
    };

    return NextResponse.json({
      totalRegistrations,
      totalRevenue: totalRevenue._sum.amount || 0,
      discordJoins,
      pendingPayments,
      categoryDistribution,
      dailyRegistrations,
      revenueTrends,
      referralAnalytics
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
