import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    // 1. Search for token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired password reset link." }, { status: 400 });
    }

    // 2. Verify token has not expired
    const now = new Date();
    if (resetToken.expires < now) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      }).catch(() => {});

      return NextResponse.json({ error: "Password reset link has expired." }, { status: 400 });
    }

    // 3. Encrypt new password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Atomically update user password and delete the token in a transaction
    await prisma.$transaction(async (tx) => {
      // Find and update user password
      await tx.user.update({
        where: { email: resetToken.email.toLowerCase() },
        data: { password: hashedPassword }
      });

      // Delete the used token
      await tx.passwordResetToken.delete({
        where: { id: resetToken.id }
      });
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now proceed to login."
    });

  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
