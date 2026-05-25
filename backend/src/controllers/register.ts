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

      const existingTeam = await prisma.team.findFirst({
        where: { name: { equals: normalizedTeamName, mode: 'insensitive' } },
      });
      if (existingTeam) {
        return res.status(409).json({ error: 'A team with this name already exists.' });
      }
      const existingUser = await prisma.user.findUnique({ where: { email: normalizedLeaderEmail } });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
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

      const team = await prisma.team.create({
        data: {
          teamId,
          name: normalizedTeamName,
          category,
          projectTheme,
          techStack,
          members: {
            create: [
              {
                user: {
                  connectOrCreate: {
                    where: { email: normalizedLeaderEmail },
                    create: {
                      email: normalizedLeaderEmail,
                      name: normalizedLeaderName,
                      mobile: leader.mobile || null,
                      college: leader.college || null,
                      linkedin: leader.linkedin || null,
                      password: hashedPassword,
                      role: 'PARTICIPANT',
                    },
                  },
                },
                role: 'LEADER',
                skills: leader.skills,
              },
              ...members
                .filter((m: any) => m.email)
                .map((m: any) => ({
                  user: {
                    connectOrCreate: {
                      where: { email: m.email },
                      create: {
                        email: m.email,
                        name: m.name,
                      },
                    },
                  },
                  role: 'MEMBER',
                  skills: m.skills,
                  position: m.role,
                })),
            ],
          },
          payment: {
            create: {
              amount: baseAmount,
              gst: gst,
              finalAmount: finalAmount,
              status: 'PENDING',
            } as any,
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
          payment: true,
        },
      });

      // Forward order details to SUN for payment handling or return a redirect URL
      let sunRedirectUrl: string | undefined;
      try {
        const leaderMember = team.members.find((m: any) => m.role === 'LEADER');
        const leaderUser = leaderMember?.user;
        if (leaderUser) {
          const payload = {
            id: leaderUser.id,
            email: leaderUser.email,
            name: leaderUser.name,
            mobile: leaderUser.mobile,
            category,
            teamSize: members.length + 1,
            baseAmount,
            amount: baseAmount,
            gst: gst,
            finalAmount: finalAmount,
            teamId: team.teamId,
            teamName: team.name,
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
        }
      } catch (err) {
        console.error('Failed to forward order to SUN:', err);
      }

      // Send confirmation email
      await sendEmail(
        leader.email,
        'Registration Successful - IncuXAI Gaming Hackathon',
        getRegistrationEmailHtml(teamName, teamId)
      );

      res.json({
        success: true,
        teamId: team.teamId,
        message: 'Registration created. Please follow payment instructions sent to your email.',
        sunRedirectUrl,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },
};