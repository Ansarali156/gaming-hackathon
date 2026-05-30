import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { PRICING } from '../../lib/constants';
import { forwardToSun, makeSunPayload, makeSunRedirectUrl } from '../../lib/sunForwarder';
import { generateTeamId } from '../../utils';
import { sendEmail, getRegistrationEmailHtml } from '../services/email';
import bcrypt from 'bcryptjs';

function isValidEmail(email: any) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const registerController = {
  async createRegistration(req: Request, res: Response) {
    try {
      const { category, teamName, leader, members, projectTheme, techStack, validateOnly } = req.body;
      const normalizedTeamName = String(teamName || '').trim();
      const normalizedLeaderEmail = String(leader?.email || '').toLowerCase();
      const normalizedLeaderName = String(leader?.name || '').trim();

      if (!category || !normalizedTeamName || !normalizedLeaderEmail || !normalizedLeaderName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (!isValidEmail(normalizedLeaderEmail)) {
        return res.status(400).json({ error: 'Leader email is invalid' });
      }
      if (!Array.isArray(members) || members.length < 1) {
        return res.status(400).json({ error: 'At least one team member is required' });
      }
      for (const [index, member] of members.entries()) {
        if (!member?.name || !member?.email) {
          return res.status(400).json({ error: `Member ${index + 1} requires name and email` });
        }
        if (!isValidEmail(member.email)) {
          return res.status(400).json({ error: `Member ${index + 1} email is invalid` });
        }
      }

      if (!leader?.password) {
        return res.status(400).json({ error: 'Leader password is required' });
      }
      if (leader.password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      // 1. Check existing user and cleanup if registration is pending
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedLeaderEmail },
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
          console.log(`🧹 Found pending participant registration for ${normalizedLeaderEmail}. Cleaning up for fresh registration.`);
          
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
          return res.status(409).json({ error: 'An account with this email already exists.' });
        }
      }

      // 2. Check team name uniqueness
      const existingTeam = await prisma.team.findFirst({
        where: { name: { equals: normalizedTeamName, mode: 'insensitive' } },
      });
      if (existingTeam) {
        return res.status(409).json({ error: 'A team with this name already exists.' });
      }

      const pricingCategory = category as keyof typeof PRICING;
      const pricePerPerson = PRICING[pricingCategory]?.price ?? 300;
      const baseAmount = pricePerPerson * (members.length + 1);
      const gst = Number((baseAmount * 0.02).toFixed(2));
      const finalAmount = Number((baseAmount + gst).toFixed(2));

      if (validateOnly) {
        return res.json({ success: true, message: 'Validation successful.' });
      }

      const hashedPassword = await bcrypt.hash(leader.password, 10);
      const teamId = await generateTeamId();

      // ── Save complete registration details as dynamic PENDING draft in DB ──
      const registrationPayload = {
        category,
        teamName: normalizedTeamName,
        leader: {
          email: normalizedLeaderEmail,
          name: normalizedLeaderName,
          mobile: leader.mobile || null,
          college: leader.college || null,
          linkedin: leader.linkedin || null,
          password: hashedPassword,
          skills: leader.skills || null,
        },
        members: members
          .filter((m: any) => m.email)
          .map((m: any) => ({
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
        where: { email: normalizedLeaderEmail },
        create: {
          email: normalizedLeaderEmail,
          teamName: normalizedTeamName,
          payload: registrationPayload as any,
        },
        update: {
          teamName: normalizedTeamName,
          payload: registrationPayload as any,
        }
      });

      // Log this as a PENDING payment entry
      await prisma.paymentLog.upsert({
        where: { id: pendingReg.id },
        create: {
          id: pendingReg.id,
          email: normalizedLeaderEmail,
          teamName: normalizedTeamName,
          teamId,
          amount: baseAmount,
          finalAmount,
          status: 'PENDING',
          reason: 'Registration initiated, awaiting payment',
          payload: registrationPayload as any,
        },
        update: {
          teamName: normalizedTeamName,
          teamId,
          amount: baseAmount,
          finalAmount,
          status: 'PENDING',
          reason: 'Registration re-initiated, awaiting payment',
          payload: registrationPayload as any,
        },
      });

      // Forward order details to SUN for payment handling or return a redirect URL
      let sunRedirectUrl: string | undefined;
      try {
        const payload = {
          id: pendingReg.id,
          email: normalizedLeaderEmail,
          name: normalizedLeaderName,
          mobile: leader.mobile || null,
          category,
          teamSize: members.length + 1,
          baseAmount,
          amount: baseAmount,
          gst: gst,
          finalAmount: finalAmount,
          teamId,
          teamName: normalizedTeamName,
          callbackBase: process.env.APP_URL || 'http://localhost:3000',
        };

        // Only attempt SUN forwarding if the shared key is configured
        if (process.env.SUN_SHARED_KEY) {
          if (req.body.returnSunRedirect) {
            sunRedirectUrl = makeSunRedirectUrl(payload as any);
          } else {
            await forwardToSun(payload as any);
          }
        } else {
          console.log('SUN_SHARED_KEY not configured — skipping SUN forwarding');
        }
      } catch (err) {
        console.error('Failed to forward order to SUN:', err);
      }

      // Send confirmation email
      await sendEmail(
        leader.email,
        'Registration Successful - IncuXAI Gaming Hackathon',
        getRegistrationEmailHtml(normalizedTeamName, teamId)
      );

      res.json({
        success: true,
        teamId,
        message: 'Registration created. Please follow payment instructions sent to your email.',
        sunRedirectUrl,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  async cancelRegistration(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await prisma.user.findUnique({
        where: { email: String(email).toLowerCase() },
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

      if (user) {
        const teamMember = user.teamMembers[0];
        if (teamMember) {
          const team = teamMember.team;
          
          // Only rollback if the payment status is still PENDING!
          if (team.payment?.status === 'PENDING') {
            await prisma.$transaction([
              prisma.payment.deleteMany({ where: { teamId: team.id } }),
              prisma.teamMember.deleteMany({ where: { teamId: team.id } }),
              prisma.team.delete({ where: { id: team.id } }),
              prisma.user.delete({ where: { id: user.id } })
            ]);
            console.log(`Log: 🧹 Rolled back pending registration for ${email}`);

            // Log this as a FAILED/cancelled payment
            await prisma.paymentLog.create({
              data: {
                email: String(email).toLowerCase(),
                teamName: team.name,
                teamId: team.teamId,
                amount: team.payment?.amount ?? null,
                finalAmount: team.payment?.finalAmount ?? null,
                status: 'FAILED',
                reason: 'Registration cancelled or payment abandoned by user',
              },
            });
          }
        }
      }

      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.json({ success: true });
    } catch (error) {
      console.error('Cancel registration failed:', error);
      res.status(500).json({ error: 'Failed to cancel registration' });
    }
  },
};