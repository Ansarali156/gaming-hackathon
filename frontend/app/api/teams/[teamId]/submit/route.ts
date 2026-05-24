import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Submit or update project links — payment must be SUCCESS first
export async function POST(request: Request, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;
    const body = await request.json();
    const { pptLink, demoVideo, githubLink, apkLink } = body;

    if (!pptLink && !demoVideo && !githubLink && !apkLink) {
      return NextResponse.json({ error: "At least one submission link is required." }, { status: 400 });
    }

    // Verify payment is complete before allowing submission
    const payment = await prisma.payment.findFirst({
      where: { team: { teamId } },
    });

    if (!payment || payment.status !== "SUCCESS") {
      return NextResponse.json(
        { error: "Payment must be completed before submitting project links." },
        { status: 403 }
      );
    }

    // Upsert submission
    const team = await prisma.team.findUnique({ where: { teamId } });
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    const submission = await prisma.submission.upsert({
      where: { teamId: team.id },
      create: {
        teamId: team.id,
        pptLink: pptLink || null,
        demoVideo: demoVideo || null,
        githubLink: githubLink || null,
        apkLink: apkLink || null,
      },
      update: {
        pptLink: pptLink || null,
        demoVideo: demoVideo || null,
        githubLink: githubLink || null,
        apkLink: apkLink || null,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}

// GET current submission for a team
export async function GET(request: Request, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;

    const team = await prisma.team.findUnique({
      where: { teamId },
      include: {
        submission: true,
        payment: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    return NextResponse.json({
      submission: team.submission,
      paymentStatus: team.payment?.status || "PENDING",
    });
  } catch (error) {
    console.error("Get submission error:", error);
    return NextResponse.json({ error: "Failed to fetch submission." }, { status: 500 });
  }
}
