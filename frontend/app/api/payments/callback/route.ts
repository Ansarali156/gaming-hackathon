import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptSunPayload } from "@/lib/sunForwarder";
import { sendEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

function getConfirmationEmailHtml(teamName: string, teamId: string, amount: number, gst: number, finalAmount: number, paymentId: string) {
  return `
    <div style="font-family: 'Inter', sans-serif; background-color: #03000a; color: #f3f4f6; padding: 40px 20px; min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; padding: 4px 10px; border-radius: 50px;">Registration Confirmed</span>
          <h1 style="font-size: 28px; font-weight: 700; color: #ffffff; margin: 15px 0 5px 0; background: linear-gradient(to right, #ffffff, #a855f7); -webkit-background-clip: text;">IncuXai Gaming Hackathon</h1>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">India's Ultimate AI Gaming Hackathon</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">Hi Leader,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">Congratulations! Your registration payment is successfully verified and processed. Your team is now officially **APPROVED & ACTIVE** for the upcoming hackathon!</p>
        
        <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin: 30px 0;">
          <h3 style="font-size: 16px; font-weight: 600; color: #ffffff; margin-top: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 10px;">Registration Details</h3>
          <table style="width: 100%; font-size: 14px; color: #d1d5db; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Registered Team:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #ffffff;">${teamName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Assigned Team ID:</td>
              <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: 700; color: #a855f7;">${teamId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Base Amount (INR):</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #ffffff;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">GST (2%):</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #a855f7;">₹${gst}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Total Paid (INR):</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 750; font-size: 16px; color: #10b981;">₹${finalAmount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Transaction ID:</td>
              <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px; color: #e5e7eb;">${paymentId}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 30px;">You can now log in to your participant dashboard using your registered email and password to submit your project repositories, track statistics, and join the official Discord channel.</p>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="http://localhost:3000/login" style="display: inline-block; background: linear-gradient(90deg, #a855f7, #0ea5e9); color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 30px; border-radius: 10px; box-shadow: 0 0 20px -5px rgba(168, 85, 247, 0.4);">Access Your Dashboard</a>
        </div>
        
        <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; font-size: 11px; color: #6b7280;">
          Secured Connection • IncuXai Team
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, iv, tag, mac, timestamp, sender } = body;

    if (!data || !iv || !tag || !mac || !timestamp || !sender) {
      return NextResponse.json({ error: "Missing required callback parameters." }, { status: 400 });
    }

    // 1. Verify freshness (within 5 minutes / 300 seconds)
    const ts = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - ts) > 300) {
      return NextResponse.json({ error: "Timestamp is outside the allowed window." }, { status: 400 });
    }

    // 2. Verify sender is 'sun'
    if (sender !== "sun") {
      return NextResponse.json({ error: "Invalid sender source." }, { status: 400 });
    }

    // 3. Decrypt and verify HMAC GCM payload
    let decrypted: any;
    try {
      decrypted = decryptSunPayload({ data, iv, tag, mac, timestamp, sender });
    } catch (decryptErr: any) {
      console.error("Callback signature decryption failed:", decryptErr);
      return NextResponse.json({ error: "MAC signature verification failed." }, { status: 401 });
    }

    const { email, payment_id, order_id, status } = decrypted;
    if (!email || !payment_id || status !== "SUCCESS") {
      return NextResponse.json({ error: "Invalid payload details." }, { status: 400 });
    }

    // 4. Find user by email and fetch their team & payment records
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        teamMembers: {
          include: {
            team: {
              include: { payment: true }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Leader account not found." }, { status: 404 });
    }

    if (user.teamMembers.length === 0) {
      return NextResponse.json({ error: "No registered team found for this account." }, { status: 400 });
    }

    const team = user.teamMembers[0].team;
    const payment = team.payment;

    if (!payment) {
      return NextResponse.json({ error: "No payment record associated with this team." }, { status: 404 });
    }

    // 5. Update Payment and Team status in the database atomically
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: payment_id,
          razorpayOrderId: order_id || payment.razorpayOrderId,
        }
      }),
      prisma.team.update({
        where: { id: team.id },
        data: {
          status: "APPROVED"
        }
      })
    ]);

    console.log(`🎉 Payment successfully updated to SUCCESS for team "${team.name}" (ID: ${team.teamId}). Payment ID: ${payment_id}`);

    // 6. Attempt to send confirmation email
    let emailStatus = "sent";
    try {
      const emailHtml = getConfirmationEmailHtml(team.name, team.teamId, payment.amount, payment.gst, payment.finalAmount, payment_id);
      const emailRes = await sendEmail({
        to: email.toLowerCase(),
        subject: "🎉 Registration Confirmed - India's Ultimate AI Gaming Hackathon",
        html: emailHtml,
      });

      if (!emailRes.success) {
        emailStatus = "queued";
        await prisma.emailQueue.create({
          data: {
            to: email.toLowerCase(),
            subject: "🎉 Registration Confirmed - India's Ultimate AI Gaming Hackathon",
            html: emailHtml,
            attempts: 1,
            lastError: String(emailRes.error || "Email delivery failed on SMTP transmission"),
            status: "PENDING",
          }
        });
        console.warn(`📥 Confirmation email failed to send, queued for retry: ${email}`);
      }
    } catch (mailErr: any) {
      emailStatus = "queued";
      try {
        const emailHtml = getConfirmationEmailHtml(team.name, team.teamId, payment.amount, payment.gst, payment.finalAmount, payment_id);
        await prisma.emailQueue.create({
          data: {
            to: email.toLowerCase(),
            subject: "🎉 Registration Confirmed - India's Ultimate AI Gaming Hackathon",
            html: emailHtml,
            attempts: 1,
            lastError: mailErr.message || String(mailErr),
            status: "PENDING",
          }
        });
      } catch (dbErr) {
        console.error("Critical: Failed to even insert failed email into queue:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully recorded and team approved.",
      teamName: team.name,
      teamId: team.teamId,
      emailStatus,
    });

  } catch (error: any) {
    console.error("Payment callback API error:", error);
    return NextResponse.json({ error: "Internal server error during callback processing." }, { status: 500 });
  }
}
