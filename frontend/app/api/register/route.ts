import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTeamId } from "@/lib/utils";
import bcrypt from "bcryptjs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, teamName, leader, members, projectTheme, techStack } = body;

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

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(leader.password, 10);

    // ── Generate unique team ID ───────────────────────────────────────────
    const teamId = await generateTeamId();

    // ── Pricing (needed for payment amount later) ──────────────────────
    const PRICING: Record<string, number> = { STUDENT: 300, IT_PROFESSIONAL: 1000, STARTUP: 1000 };
    const pricePerPerson = PRICING[category] ?? 300;
    const totalAmount = pricePerPerson * (members.length + 1);

    // ── Create team + users in DB ─────────────────────────────────────────
    const team = await prisma.team.create({
      data: {
        teamId,
        name: teamName.trim(),
        category,
        projectTheme: projectTheme || null,
        techStack: techStack || null,
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
          ],
        },
        payment: {
          create: {
            amount: totalAmount,
            status: "PENDING",
          },
        },
      },
      include: {
        members: { include: { user: true } },
        payment: true,
      },
    });

    return NextResponse.json({
      success: true,
      teamId: team.teamId,
      message: "Registration successful! You can now log in and complete your payment from the dashboard.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
