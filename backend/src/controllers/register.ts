import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createRazorpayOrder } from '../../lib/razorpay';
import { generateTeamId } from '../../utils';
import { sendEmail, getRegistrationEmailHtml } from '../services/email';

export const registerController = {
  async createRegistration(req: Request, res: Response) {
    try {
      const { category, teamName, leader, members, projectTheme, techStack, totalAmount } = req.body;

      if (!category || !teamName || !leader?.email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const teamId = await generateTeamId();

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(totalAmount);

      const team = await prisma.team.create({
        data: {
          teamId,
          name: teamName,
          category,
          projectTheme,
          techStack,
          members: {
            create: [
              {
                user: {
                  connectOrCreate: {
                    where: { email: leader.email },
                    create: {
                      email: leader.email,
                      name: leader.name,
                      mobile: leader.mobile,
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
              amount: totalAmount,
              status: 'PENDING',
              razorpayOrderId: razorpayOrder.id,
            },
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

      // Send confirmation email
      await sendEmail(
        leader.email,
        'Registration Successful - IncuXAI Gaming Hackathon',
        getRegistrationEmailHtml(teamName, teamId)
      );

      res.json({
        success: true,
        teamId: team.teamId,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        message: 'Please complete payment to confirm registration',
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },
};