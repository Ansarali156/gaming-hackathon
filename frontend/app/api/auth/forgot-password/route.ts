import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return NextResponse.json({ error: "No account found matching this email." }, { status: 404 });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Set expiration to 1 hour from now
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Save token in the VerificationToken table
    // We use upsert so if they request it multiple times, we just overwrite the old one
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: user.email,
          token: token // This won't match on upsert uniquely unless we know the token, so we actually want to delete old ones first.
        }
      },
      update: {},
      create: {
        identifier: user.email,
        token,
        expires,
      },
    }).catch(async () => {
      // If upsert fails because we didn't match the compound unique correctly for replacing, 
      // let's manually delete and create to be safe.
      await prisma.verificationToken.deleteMany({ where: { identifier: user.email } });
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires,
        }
      });
    });

    // Send the email with the reset link
    // Assuming the app runs on localhost:3000 locally, but in production we'd use an env var
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - IncuXai Hackathon",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-w-lg mx-auto">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name || "Participant"},</p>
          <p>We received a request to reset the password for your account associated with this email address.</p>
          <p>You can reset your password by clicking the link below (valid for 1 hour):</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
          <br/><br/>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br/>The IncuXai Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Reset link sent successfully." });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
