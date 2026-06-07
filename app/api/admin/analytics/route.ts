import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCached(CACHE_KEYS.ANALYTICS, CACHE_TTL.ANALYTICS, async () => {
    const totalRegistrations = await prisma.team.count({
      where: {
        OR: [
          { status: { not: "PENDING" } },
          { payment: { status: "SUCCESS" } }
        ]
      }
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    });

    const discordJoins = await prisma.user.count({ where: { discordJoined: true } });

    const pendingPayments = await prisma.payment.count({ where: { status: "PENDING" } });

    const categoryDistribution = await prisma.team.groupBy({
      by: ["category"],
      where: {
        OR: [
          { status: { not: "PENDING" } },
          { payment: { status: "SUCCESS" } }
        ]
      },
      _count: true,
    });

    const allTeams = await prisma.team.findMany({
      where: {
        OR: [
          { status: { not: "PENDING" } },
          { payment: { status: "SUCCESS" } }
        ]
      },
      select: { createdAt: true },
    });

    const allPayments = await prisma.payment.findMany({
      where: { status: "SUCCESS" },
      select: { amount: true, createdAt: true },
    });

    const referralsCount = await prisma.referral.count();

    const referralPointsAggregate = await prisma.referral.aggregate({
      _sum: { points: true },
    });

    // Find earliest date
    const teamDates = allTeams.map(t => new Date(t.createdAt).getTime());
    const paymentDates = allPayments.map(p => new Date(p.createdAt).getTime());
    
    const earliestTime = Math.min(...teamDates, ...paymentDates, Date.now());
    const earliestDate = new Date(earliestTime);
    earliestDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allDays = [];
    for (let d = new Date(earliestDate); d <= today; d.setDate(d.getDate() + 1)) {
      allDays.push(new Date(d));
    }

    // Build full registration trends
    const dailyRegistrations = allDays.map(date => {
      const count = allTeams.filter(t => {
        const d = new Date(t.createdAt);
        return d.toDateString() === date.toDateString();
      }).length;
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        _count: count
      };
    });

    // Build full revenue trends
    const revenueTrends = allDays.map(date => {
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

    return {
      totalRegistrations,
      totalRevenue: totalRevenue._sum.amount || 0,
      discordJoins,
      pendingPayments,
      categoryDistribution,
      dailyRegistrations,
      revenueTrends,
      referralAnalytics
    };
    }); // end getCached

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics", details: error?.message || String(error) }, { status: 500 });
  }
}

