import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTeamId } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, teamName, leader, members, projectTheme, techStack, validateOnly, paymentDetails } = body;

    // ── Required field checks ──────────────────────────────────────────────
    if (!category || !teamName?.trim()) {
      return NextResponse.json({ error: "Category and team name are required." }, { status: 400 });
    }
    if (!leader?.name?.trim() || !leader?.email?.trim() || !leader?.password) {
      return NextResponse.json({ error: "Leader name, email, and password are required." }, { status: 400 });
    }
    if (!isValidEmail(leader.email)) {
      return NextResponse.json({ error: "Leader email is not valid." }, { status: 400 });
    }
    if (leader.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (leader.mobile && !isValidPhone(leader.mobile)) {
      return NextResponse.json({ error: "Leader mobile must be a valid 10-digit Indian number." }, { status: 400 });
    }

    // ── Validate team members ────────────────────────────────────────────
    if (!Array.isArray(members) || members.length < 1) {
      return NextResponse.json({ error: "At least one team member is required." }, { status: 400 });
    }
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name?.trim()) {
        return NextResponse.json({ error: `Member ${i + 1}: name is required.` }, { status: 400 });
      }
      if (!m.email?.trim() || !isValidEmail(m.email)) {
        return NextResponse.json({ error: `Member ${i + 1}: a valid email is required.` }, { status: 400 });
      }
    }

    // ── Team name uniqueness ─────────────────────────────────────────────
    const existingTeam = await prisma.team.findFirst({
      where: { name: { equals: teamName.trim(), mode: "insensitive" } },
    });
    if (existingTeam) {
      return NextResponse.json({ error: "A team with this name already exists. Please choose a different name." }, { status: 409 });
    }

    // ── Leader email uniqueness (each leader gets a fresh account) ───────
    const existingUser = await prisma.user.findUnique({ where: { email: leader.email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists. Please login." }, { status: 409 });
    }

    // If this is only a validation request, return early and succeed
    if (validateOnly) {
      return NextResponse.json({ success: true, message: "Validation successful." });
    }

    // ── Payment details verification ─────────────────────────────────────
    if (!paymentDetails || !paymentDetails.paymentId || !paymentDetails.orderId || !paymentDetails.signature) {
      return NextResponse.json({ error: "Payment verification details are missing." }, { status: 400 });
    }

    const { paymentId, orderId, signature } = paymentDetails;

    // Verify signature securely
    const crypto = require("crypto");
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "test_secret")
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== signature) {
      return NextResponse.json({ error: "Payment verification failed. Invalid signature." }, { status: 400 });
    }

    // Prevent Replay Attacks: Check if the payment ID has already been registered
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayPaymentId: paymentId }
    });
    if (existingPayment) {
      return NextResponse.json({ error: "This payment transaction has already been used for registration." }, { status: 409 });
    }

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(leader.password, 10);

    // ── Generate unique team ID ───────────────────────────────────────────
    const teamId = await generateTeamId();

    // ── Pricing calculation ──────────────────────────────────────────────
    const PRICING: Record<string, number> = { STUDENT: 300, IT_PROFESSIONAL: 1000, STARTUP: 1000 };
    const pricePerPerson = PRICING[category] ?? 300;
    const totalAmount = pricePerPerson * (members.length + 1);

    // ── Create team + users + payment atomically in DB ────────────────────
    const team = await prisma.team.create({
      data: {
        teamId,
        name: teamName.trim(),
        category,
        projectTheme: projectTheme || null,
        techStack: techStack || null,
        status: "APPROVED", // Set directly to approved upon verified payment
        members: {
          create: [
            {
              user: {
                create: {
                  email: leader.email.toLowerCase(),
                  name: leader.name.trim(),
                  mobile: leader.mobile || null,
                  password: hashedPassword,
                  role: "PARTICIPANT",
                },
              },
              role: "LEADER",
              skills: leader.skills || null,
            },
            ...members.map((m: any) => ({
              user: {
                connectOrCreate: {
                  where: { email: m.email.toLowerCase() },
                  create: {
                    email: m.email.toLowerCase(),
                    name: m.name.trim(),
                    role: "PARTICIPANT",
                  },
                },
              },
              role: "MEMBER",
              skills: m.skills || null,
              position: m.role || null,
            })),
          ] as any,
        },
        payment: {
          create: {
            amount: totalAmount,
            status: "SUCCESS",
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
          },
        },
      },
      include: {
        members: { include: { user: true } },
        payment: true,
      },
    });

    // ── Send Welcome Registration & Payment Email ────────────────────────
    await sendEmail({
      to: leader.email.toLowerCase(),
      subject: "Welcome to IncuXai Gaming Hackathon! 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a855f7;">Registration & Payment Successful! 🎉</h2>
          <p>Hi <strong>${leader.name.trim()}</strong>,</p>
          <p>Your team <strong>${teamName.trim()}</strong> has been successfully registered and your payment of <strong>₹${totalAmount}</strong> was verified.</p>
          <p><strong>Team ID:</strong> ${team.teamId}</p>
          <p><strong>Payment Transaction ID:</strong> ${paymentId}</p>
          <p>You can now log in to your participant dashboard using your email and password to access resources, connect with mentors, and submit your project links.</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 24px; background-color: #a855f7; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      teamId: team.teamId,
      message: "Registration and payment successful! You can now log in to your dashboard.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
