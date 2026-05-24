import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTeamId } from "@/lib/utils";
import { PRICING } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { forwardToSun, makeSunRedirectUrl } from "@/lib/sunForwarder";

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

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(leader.password, 10);

    // ── Generate unique team ID ───────────────────────────────────────────
    const teamId = await generateTeamId();

    // ── Pricing calculation ──────────────────────────────────────────────
    const pricePerPerson = (PRICING as any)[category]?.price ?? 300;
    const baseAmount = pricePerPerson * (members.length + 1);
    const gst = Number((baseAmount * 0.02).toFixed(2));
    const finalAmount = Number((baseAmount + gst).toFixed(2));

    // ── Create team + users + payment atomically in DB ────────────────────
    const team = await prisma.team.create({
      data: {
        teamId,
        name: teamName.trim(),
        category,
        projectTheme: projectTheme || null,
        techStack: techStack || null,
        status: "PENDING",
        members: {
          create: [
            {
              user: {
                create: {
                  email: leader.email.toLowerCase(),
                  name: leader.name.trim(),
                  mobile: leader.mobile || null,
                  college: leader.college || null,
                  linkedin: leader.linkedin || null,
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
            amount: baseAmount,
            gst: gst,
            finalAmount: finalAmount,
            status: "PENDING",
          },
        },
      },
      include: {
        members: { include: { user: true } },
        payment: true,
      },
    });

    // ── Forward encrypted payload to SUN endpoint for payment handling ────
    let sunRedirectUrl: string | undefined;

    try {
      const leaderMember = team.members.find((m: any) => m.role === "LEADER");
      const leaderUser = leaderMember?.user;
      if (leaderUser) {
        const payload = {
          id: leaderUser.id,
          email: leaderUser.email,
          name: leaderUser.name,
          mobile: leaderUser.mobile,
          amount: baseAmount,
          gst: gst,
          finalAmount: finalAmount,
          teamId: team.teamId,
          teamName: team.name,
        };

        if (body.returnSunRedirect) {
          sunRedirectUrl = makeSunRedirectUrl(payload);
        } else {
          await forwardToSun(payload);
        }
      }
    } catch (forwardErr) {
      console.error("Failed to forward order to SUN:", forwardErr);
      if (body.returnSunRedirect) {
        return NextResponse.json({
          success: false,
          error: "Unable to generate payment redirect. Please try again.",
        }, { status: 500 });
      }
      // Do not fail the registration — return success but warn the caller
      return NextResponse.json({
        success: true,
        teamId: team.teamId,
        warning: "Registration saved but forwarding to payment provider failed.",
      });
    }

    // ── Send Welcome Registration & Payment Email ────────────────────────
    try {
      await sendEmail({
        to: leader.email.toLowerCase(),
        subject: "Registration Received - IncuXai Gaming Hackathon",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #a855f7;">Registration Received ✅</h2>
            <p>Hi <strong>${leader.name.trim()}</strong>,</p>
            <p>Your team <strong>${teamName.trim()}</strong> has been registered. The registration record is saved and payment instructions have been forwarded to our payment partner.</p>
            <p><strong>Team ID:</strong> ${team.teamId}</p>
            <p><strong>Amount Due:</strong> ₹${finalAmount}</p>
            <p>Please follow the payment instructions sent to your email or contact support if you don't receive them within a few minutes.</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 24px; background-color: #a855f7; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send registration email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      teamId: team.teamId,
      message: "Registration successful! You can now complete payment on the payment page.",
      ...(sunRedirectUrl ? { sunRedirectUrl } : {}),
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
