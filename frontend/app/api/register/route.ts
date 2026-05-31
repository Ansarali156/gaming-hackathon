import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTeamId } from "@/lib/utils";
import { PRICING } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { forwardToSun, makeSunRedirectUrl } from "@/lib/sunForwarder";
import { z } from "zod";

const memberSchema = z.object({
  name: z.string().trim().min(1, "Member name is required"),
  email: z.string().trim().email("Member email is invalid"),
  skills: z.array(z.string()).optional(),
  role: z.string().optional(),
});

const registrationSchema = z.object({
  category: z.string().min(1, "Category is required"),
  teamName: z.string().trim().min(1, "Team name is required"),
  projectTheme: z.string().optional(),
  techStack: z.string().optional(),
  validateOnly: z.boolean().optional(),
  paymentDetails: z.any().optional(),
  leader: z.object({
    name: z.string().trim().min(1, "Leader name is required"),
    email: z.string().trim().email("Leader email is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Leader mobile must be a valid 10-digit Indian number"),
    college: z.string().optional(),
    discordId: z.string().optional(),
    linkedin: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }),
  members: z.array(memberSchema).min(1, "At least one team member is required"),
});

export async function POST(request: Request) {
  try {
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const loginUrl = `${protocol}://${host}/login`;

    const body = await request.json();
    // ── Zod Validation ──────────────────────────────────────────────
    const parseResult = registrationSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0].message;
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { category, teamName, leader, members, projectTheme, techStack, validateOnly, paymentDetails } = parseResult.data;

    // ── Leader email uniqueness (each leader gets a fresh account + cleanup if pending) ───────
    const existingUser = await prisma.user.findUnique({
      where: { email: leader.email.toLowerCase() },
      include: {
        teamMembers: {
          include: {
            team: true,
          },
        },
      },
    });

    if (existingUser) {
      const isPendingParticipant = 
        existingUser.role === 'PARTICIPANT' &&
        existingUser.teamMembers.length > 0 &&
        existingUser.teamMembers.some((tm: any) => tm.team.status === 'PENDING');

      if (isPendingParticipant) {
        console.log(`🧹 Found pending participant registration for ${leader.email}. Cleaning up for fresh registration.`);
        
        const pendingTeams = existingUser.teamMembers
          .map((tm: any) => tm.team)
          .filter((t: any) => t.status === 'PENDING');

        if (pendingTeams.length > 0) {
          await prisma.team.deleteMany({
            where: { id: { in: pendingTeams.map((t: any) => t.id) } }
          });
        }

        await prisma.user.delete({
          where: { id: existingUser.id }
        });
      } else {
        return NextResponse.json({ error: "An account with this email already exists. Please login." }, { status: 409 });
      }
    }

    // ── Team name uniqueness ─────────────────────────────────────────────
    const existingTeam = await prisma.team.findFirst({
      where: { name: { equals: teamName.trim(), mode: "insensitive" } },
    });
    if (existingTeam) {
      return NextResponse.json({ error: "A team with this name already exists. Please choose a different name." }, { status: 409 });
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

    // ── Save complete registration details as dynamic PENDING draft in DB ──
    const registrationPayload = {
      category,
      teamName: teamName.trim(),
      leader: {
        email: leader.email.toLowerCase(),
        name: leader.name.trim(),
        mobile: leader.mobile || null,
        college: leader.college || null,
        linkedin: leader.linkedin || null,
        password: hashedPassword,
        skills: leader.skills || null,
      },
      members: members.map((m: any) => ({
        email: m.email.toLowerCase(),
        name: m.name.trim(),
        skills: m.skills || null,
        role: m.role || null,
      })),
      projectTheme: projectTheme || null,
      techStack: techStack || null,
      teamId,
      baseAmount,
      gst,
      finalAmount,
    };

    const pendingReg = await prisma.pendingRegistration.upsert({
      where: { email: leader.email.toLowerCase() },
      create: {
        email: leader.email.toLowerCase(),
        teamName: teamName.trim(),
        payload: registrationPayload as any,
      },
      update: {
        teamName: teamName.trim(),
        payload: registrationPayload as any,
      }
    });

    // ── Forward encrypted payload to SUN endpoint for payment handling ────
    let sunRedirectUrl: string | undefined;

    try {
      const payload = {
        id: pendingReg.id,
        email: leader.email.toLowerCase(),
        name: leader.name.trim(),
        mobile: leader.mobile || null,
        category,
        teamSize: members.length + 1,
        baseAmount,
        amount: baseAmount,
        gst: gst,
        finalAmount: finalAmount,
        teamId,
        teamName: teamName.trim(),
        callbackBase: process.env.NEXTAUTH_URL || "http://localhost:3000",
      };

      if (body.returnSunRedirect) {
        sunRedirectUrl = makeSunRedirectUrl(payload);
      } else {
        await forwardToSun(payload);
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
        teamId,
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
            <p><strong>Team ID:</strong> ${teamId}</p>
            <p><strong>Amount Due:</strong> ₹${finalAmount}</p>
            <p>Please follow the payment instructions sent to your email or contact support if you don't receive them within a few minutes.</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #a855f7; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send registration email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      teamId,
      message: "Registration successful! You can now complete payment on the payment page.",
      ...(sunRedirectUrl ? { sunRedirectUrl } : {}),
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
