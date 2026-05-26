import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

function getConfirmationEmailHtml(teamName: string, teamId: string, amount: number, gst: number, finalAmount: number, paymentId: string, loginUrl: string) {
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
              <td style="padding: 8px 0; color: #9ca3af;">Platform Charges (2%):</td>
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
        
        <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 30px;">You can now log in to your participant dashboard using your registered email and password to submit your project repositories, track statistics, and reach out to support on WhatsApp (+91 7995061289).</p>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(90deg, #a855f7, #0ea5e9); color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 30px; border-radius: 10px; box-shadow: 0 0 20px -5px rgba(168, 85, 247, 0.4);">Access Your Dashboard</a>
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
    const decrypted = await request.json();

    const { email, payment_id, order_id, status } = decrypted;
    if (!email || !payment_id || status !== "SUCCESS") {
      return NextResponse.json({ error: "Invalid payload details." }, { status: 400 });
    }

    // 4. Find pending registration draft by email
    const draft = await prisma.pendingRegistration.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!draft) {
      return NextResponse.json({ error: "Pending registration details not found." }, { status: 404 });
    }

    const payload = draft.payload as any;
    const { category, teamName, leader, members, projectTheme, techStack, teamId, baseAmount, gst, finalAmount } = payload;

    // ── Direct Razorpay API Verification (Gold Standard Security Check) ──
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpayKeyId && razorpayKeySecret) {
      try {
        console.log(`🔒 Securely verifying payment ${payment_id} with Razorpay API...`);
        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
        const rzResponse = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}`, {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        });

        if (!rzResponse.ok) {
          console.error(`❌ Razorpay API returned error status ${rzResponse.status} for payment ID ${payment_id}`);
          return NextResponse.json({ error: "Razorpay payment verification failed. Payment ID invalid." }, { status: 400 });
        }

        const rzPay = await rzResponse.json();

        // 1. Check payment is authorized or captured
        if (rzPay.status !== "captured" && rzPay.status !== "authorized") {
          console.error(`❌ Razorpay payment ${payment_id} status is "${rzPay.status}". Expected captured or authorized.`);
          return NextResponse.json({ error: "Razorpay payment has not been successfully captured." }, { status: 400 });
        }

        // 2. Check amount match (Razorpay uses paise, so we multiply by 100)
        const expectedPaise = Math.round(finalAmount * 100);
        if (Number(rzPay.amount) !== expectedPaise) {
          console.error(`❌ Razorpay payment amount mismatch. Expected ${expectedPaise} paise, but received ${rzPay.amount} paise.`);
          return NextResponse.json({ error: "Razorpay payment amount does not match registration fee." }, { status: 400 });
        }

        console.log(`✅ Secure Razorpay API check passed successfully for payment ${payment_id}.`);
      } catch (err: any) {
        console.error("Critical: Error calling Razorpay API for verification:", err);
        return NextResponse.json({ error: "Failed to connect to Razorpay gateway for validation." }, { status: 500 });
      }
    } else {
      console.warn("⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Skipping server-side Razorpay verification (graceful sandbox fallback).");
    }

    // ── Generate a dynamically guaranteed unique teamId ──
    let activeTeamId = teamId;
    const conflict = await prisma.team.findUnique({ where: { teamId: activeTeamId } });
    if (conflict) {
      let isUnique = false;
      let attempt = 1;
      const prefix = "INC";
      const year = new Date().getFullYear().toString().slice(-2);
      while (!isUnique) {
        const count = await prisma.team.count();
        const number = (count + attempt).toString().padStart(4, "0");
        activeTeamId = `${prefix}${year}${number}`;
        const duplicate = await prisma.team.findUnique({ where: { teamId: activeTeamId } });
        if (!duplicate) {
          isUnique = true;
        } else {
          attempt++;
        }
      }
    }

    // 5. Create Team, User (Leader + Members), and Payment records atomically, and delete the draft
    const team = await prisma.$transaction(async (tx) => {
      const t = await tx.team.create({
        data: {
          teamId: activeTeamId,
          name: teamName,
          category,
          projectTheme,
          techStack,
          status: "APPROVED",
          members: {
            create: [
              {
                user: {
                  create: {
                    email: leader.email.toLowerCase(),
                    name: leader.name,
                    mobile: leader.mobile,
                    college: leader.college,
                    linkedin: leader.linkedin,
                    password: leader.password, // Already hashed password
                    role: "PARTICIPANT",
                  },
                },
                role: "LEADER",
                skills: leader.skills,
              },
              ...members.map((m: any) => ({
                user: {
                  connectOrCreate: {
                    where: { email: m.email.toLowerCase() },
                    create: {
                      email: m.email.toLowerCase(),
                      name: m.name,
                      role: "PARTICIPANT",
                    },
                  },
                },
                role: "MEMBER",
                skills: m.skills,
                position: m.role,
              })),
            ] as any,
          },
          payment: {
            create: {
              amount: baseAmount,
              gst: gst,
              finalAmount: finalAmount,
              status: "SUCCESS",
              razorpayPaymentId: payment_id,
              razorpayOrderId: order_id || undefined,
            },
          },
        },
        include: {
          members: { include: { user: true } },
          payment: true,
        },
      });

      // Delete the pending registration draft
      await tx.pendingRegistration.delete({
        where: { id: draft.id },
      });

      return t;
    });

    const payment = team.payment!;
    console.log(`🎉 Payment successfully verified and team/user account created for team "${team.name}" (ID: ${team.teamId}). Payment ID: ${payment_id}`);

    // Generate dynamic loginUrl using request host
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const loginUrl = `${protocol}://${host}/login`;

    // 6. Attempt to send confirmation email
    let emailStatus = "sent";
    try {
      const emailHtml = getConfirmationEmailHtml(team.name, team.teamId, payment.amount, payment.gst, payment.finalAmount, payment_id, loginUrl);
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
        const emailHtml = getConfirmationEmailHtml(team.name, team.teamId, payment.amount, payment.gst, payment.finalAmount, payment_id, loginUrl);
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
