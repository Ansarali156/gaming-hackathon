import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "PARTICIPANT" },
    });

    const emailsSent = [];

    // Note: In a production app, we would batch this or use a queue.
    for (const user of users) {
      if (!user.email) continue;
      
      const certificateHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-w: 800px; margin: 0 auto; border: 20px solid #1a1a2e; padding: 40px; text-align: center; background-color: #f8f9fa;">
          <div style="border: 2px solid #00f0ff; padding: 40px; background: white;">
            <h1 style="color: #1a1a2e; font-size: 3rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">Certificate of Participation</h1>
            <p style="color: #666; font-size: 1.2rem; margin-bottom: 30px;">This is proudly presented to</p>
            <h2 style="color: #e94560; font-size: 2.5rem; border-bottom: 2px solid #00f0ff; display: inline-block; padding-bottom: 10px; margin-bottom: 30px;">${user.name}</h2>
            <p style="color: #333; font-size: 1.1rem; line-height: 1.6; max-width: 600px; margin: 0 auto 40px;">
              For successfully participating in Round 1 of the <strong>IncuXai Gaming Hackathon</strong>.<br/>
              Your innovative spirit and dedication to building the future of gaming are deeply appreciated.
            </p>
            <div style="display: flex; justify-content: space-around; margin-top: 50px;">
              <div>
                <p style="border-top: 1px solid #333; padding-top: 10px; font-weight: bold;">IncuXai Team</p>
                <p style="color: #666; font-size: 0.9rem;">Organizers</p>
              </div>
            </div>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: "Your IncuXai Hackathon Participation Certificate 🏆",
        html: `
          <p>Hi ${user.name},</p>
          <p>Thank you for participating in Round 1 of the IncuXai Gaming Hackathon!</p>
          <p>Please find your digital certificate of participation below:</p>
          <br/>
          ${certificateHTML}
          <br/>
          <p>Best regards,<br/>The IncuXai Team</p>
        `,
      });
      emailsSent.push(user.email);
    }

    return NextResponse.json({ success: true, count: emailsSent.length });
  } catch (error) {
    console.error("Certificate send error:", error);
    return NextResponse.json({ error: "Failed to send certificates" }, { status: 500 });
  }
}

