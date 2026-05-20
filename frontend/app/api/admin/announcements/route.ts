import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, visibility, isPinned, channels } = body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        visibility: visibility || "ALL",
        isPinned: isPinned || false,
      },
    });

    // Simulate sending multi-channel announcements
    const logs: string[] = ["Created announcement on platform dashboard."];

    if (channels?.email) {
      // Simulation of Resend trigger
      logs.push(`Simulated sending email announcement to all registered users via Resend API.`);
    }

    if (channels?.discord) {
      // Simulation of Discord webhook message
      logs.push(`Simulated posting announcement to Discord channel #announcements via webhook.`);
    }

    return NextResponse.json({ success: true, announcement, logs });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
