import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: any = {
      payment: { status: "SUCCESS" }
    };
    if (status) {
      where.status = status;
    }
    if (category) where.category = category;

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  mobile: true,
                  college: true,
                  linkedin: true,
                },
              },
            },
          },
          payment: true,
          submission: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.team.count({ where }),
    ]);

    return NextResponse.json({
      teams,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Fetch participants error:", error);
    return NextResponse.json({ error: "Failed to fetch participants", details: error?.message || String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
    const loginUrl = `${baseUrl}/login`;

    const body = await request.json();
    const { teamId, status } = body;

    const team = await prisma.team.update({
      where: { teamId },
      data: { status },
      include: {
        members: {
          include: { user: true }
        }
      }
    });

    if (status === "APPROVED") {
      const leader = team.members.find(m => m.role === "LEADER");
      if (leader?.user?.email) {
        await sendEmail({
          to: leader.user.email,
          subject: "🎉 Congratulations! Your team is selected for IncuXai Hackathon!",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-w-lg mx-auto">
              <h2>Congratulations, ${leader.user.name}!</h2>
              <p>Your team <strong>${team.name}</strong> has been <strong>SELECTED</strong> for the next round of the IncuXai Gaming Hackathon.</p>
              <p>Please log in to your dashboard to view the latest timeline and prepare for the next phase!</p>
              <a href="${loginUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Dashboard</a>
            </div>
          `
        });
      }
    }

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Update team error:", error);
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}

