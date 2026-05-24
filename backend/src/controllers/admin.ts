import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const adminController = {
  async getAnalytics(req: Request, res: Response) {
    try {
      const totalRegistrations = await prisma.team.count();
      const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' },
      });
      const pendingPayments = await prisma.payment.count({
        where: { status: 'PENDING' },
      });
      const discordJoins = await prisma.user.count({
        where: { discordJoined: true },
      });

      const categoryDistribution = await prisma.team.groupBy({
        by: ['category'],
        _count: true,
      });

      const dailyRegistrations = await prisma.team.groupBy({
        by: ['createdAt'],
        _count: true,
        orderBy: { createdAt: 'desc' },
        take: 7,
      });

      res.json({
        success: true,
        analytics: {
          totalRegistrations,
          totalRevenue: totalRevenue._sum.amount || 0,
          pendingPayments,
          discordJoins,
          categoryDistribution,
          dailyRegistrations,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  },

  async getParticipants(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, category } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = status;
      if (category) where.category = category;

      const [participants, total] = await Promise.all([
        prisma.team.findMany({
          where,
          include: {
            members: { include: { user: true } },
            payment: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.team.count({ where }),
      ]);

      res.json({
        success: true,
        participants,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch participants' });
    }
  },

  async approveTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const team = await prisma.team.update({
        where: { teamId },
        data: { status: 'APPROVED' },
      });

      res.json({ success: true, team });
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve team' });
    }
  },

  async rejectTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const team = await prisma.team.update({
        where: { teamId },
        data: { status: 'REJECTED' },
      });

      res.json({ success: true, team });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reject team' });
    }
  },

  async createAnnouncement(req: Request, res: Response) {
    try {
      const { title, message, visibility, isPinned } = req.body;
      const announcement = await prisma.announcement.create({
        data: { title, message, visibility, isPinned },
      });

      res.json({ success: true, announcement });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  },

  async getAnnouncements(req: Request, res: Response) {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 50,
      });

      res.json({ success: true, announcements });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  },

  async getSponsors(req: Request, res: Response) {
    try {
      const sponsors = await prisma.sponsor.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, sponsors });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sponsors' });
    }
  },

  async createSponsor(req: Request, res: Response) {
    try {
      const { name, tier, logo, website, description, contact } = req.body;
      const sponsor = await prisma.sponsor.create({
        data: { name, tier, logo, website, description, contact },
      });

      res.json({ success: true, sponsor });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sponsor' });
    }
  },
};