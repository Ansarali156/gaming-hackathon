import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";

const submissionSchema = z.object({
  pptLink: z.string().url("PPT link must be a valid URL").optional().or(z.literal("")),
  demoVideo: z.string().url("Demo video link must be a valid URL").optional().or(z.literal("")),
  githubLink: z.string().url("GitHub link must be a valid URL").optional().or(z.literal("")),
  apkLink: z.string().url("APK link must be a valid URL").optional().or(z.literal("")),
  documentLink: z.string().url("Document link must be a valid URL").optional().or(z.literal("")),
}).refine(data => data.pptLink || data.demoVideo || data.githubLink || data.apkLink || data.documentLink, {
  message: "At least one submission link is required.",
});

// Submit or update project links — payment must be SUCCESS first
export async function POST(request: Request, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = await params;

    // Verify user belongs to this team (or is an ADMIN)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { teamMembers: { include: { team: true } } }
    });

    const isMember = user?.teamMembers.some((tm: any) => tm.team.teamId === teamId);
    if (!isMember && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You are not part of this team." }, { status: 403 });
    }

    const body = await request.json();
    const parseResult = submissionSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0].message;
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { pptLink, demoVideo, githubLink, apkLink, documentLink } = parseResult.data;

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
        documentLink: documentLink || null,
      },
      update: {
        pptLink: pptLink || null,
        demoVideo: demoVideo || null,
        githubLink: githubLink || null,
        apkLink: apkLink || null,
        documentLink: documentLink || null,
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { teamMembers: { include: { team: true } } }
    });

    const isMember = user?.teamMembers.some((tm: any) => tm.team.teamId === teamId);
    if (!isMember && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
