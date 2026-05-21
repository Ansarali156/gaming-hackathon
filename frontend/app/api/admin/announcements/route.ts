import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

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
      const users = await prisma.user.findMany({
        where: { role: "PARTICIPANT" },
        select: { email: true }
      });
      const emails = users.map(u => u.email).filter(Boolean);
      
      if (emails.length > 0) {
        // Send email in background so it doesn't block request
        sendEmail({
          to: emails,
          subject: title,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-w-lg mx-auto">
              <h2>IncuXai Hackathon Update</h2>
              <p><strong>${title}</strong></p>
              <p>${message.replace(/\n/g, '<br/>')}</p>
              <br/>
              <p>Best regards,<br/>The IncuXai Team</p>
            </div>
          `
        }).catch(err => console.error("Broadcast email error:", err));
        logs.push(`Sent email broadcast to ${emails.length} participants.`);
      }
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
