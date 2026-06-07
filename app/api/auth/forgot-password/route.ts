import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";
import { applyRateLimit, authLimiter } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function getResetEmailHtml(name: string, resetUrl: string) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; background-color: #03000a; color: #f3f4f6; padding: 40px 20px; min-height: 100vh;">
      <div style="max-width: 550px; margin: 0 auto; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); color: #a855f7; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; padding: 4px 10px; border-radius: 50px;">Account Security</span>
          <h1 style="font-size: 26px; font-weight: 700; color: #ffffff; margin: 15px 0 5px 0;">Reset Your Password</h1>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">AI Gaming Hackathon Support</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">We received a request to reset your password for the AI Gaming Hackathon portal. Don't worry, your account is fully secure.</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin-bottom: 30px;">Please click the button below to choose a new password. This reset link is only valid for **1 hour**.</p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(90deg, #a855f7, #0ea5e9); color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 30px; border-radius: 10px; box-shadow: 0 0 20px -5px rgba(168, 85, 247, 0.4); text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Reset Password</a>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 15px; margin: 30px 0; text-align: center;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0; word-break: break-all;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #0ea5e9; text-decoration: underline;">${resetUrl}</a>
          </p>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #9ca3af; margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
          If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.
        </p>
        
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #6b7280;">
          Secured Connection • IncuXai Team
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  // ── Rate Limiting: prevent email flooding attacks ─────────────────────
  const rateLimited = await applyRateLimit(request, authLimiter);
  if (rateLimited) return rateLimited;

  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // 1. Search for user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    // 2. Generic success response if user is not found (anti email-enumeration best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If that email belongs to an account, password reset instructions have been sent."
      });
    }

    // 3. Generate 32-byte secure token (hex encoded, 64 characters)
    const token = crypto.randomBytes(32).toString("hex");

    // 4. Expiry set to 1 hour from now
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // 5. Store token in database
    await prisma.passwordResetToken.upsert({
      where: { email: user.email },
      update: {
        token,
        expires,
        createdAt: new Date(),
      },
      create: {
        email: user.email,
        token,
        expires,
      }
    });

    // 6. Generate dynamic domain URL using request headers
    const host = request.headers.get("host") || "aigaminghackathon.incuxai.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

    // 7. Send reset instructions email
    const emailHtml = getResetEmailHtml(user.name || "Participant", resetUrl);
    const emailRes = await sendEmail({
      to: user.email,
      subject: "🔒 Password Reset Instructions - AI Gaming Hackathon",
      html: emailHtml,
    });

    // If SMTP has issues, queue it for reliability
    if (!emailRes.success) {
      await prisma.emailQueue.create({
        data: {
          to: user.email,
          subject: "🔒 Password Reset Instructions - AI Gaming Hackathon",
          html: emailHtml,
          attempts: 1,
          lastError: String(emailRes.error || "Email delivery failed on forgot-password request"),
          status: "PENDING",
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "If that email belongs to an account, password reset instructions have been sent."
    });

  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
