import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const teamController = {
  async getTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const team = await prisma.team.findUnique({
        where: { teamId },
        include: {
          members: { include: { user: true } },
          payment: true,
          submission: true,
        },
      });

      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      res.json({ success: true, team });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  },

  async getTeamByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId },
        include: {
          team: {
            include: {
              members: { include: { user: true } },
              payment: true,
              submission: true,
            },
          },
        },
      });

      if (!teamMember) {
        return res.json({ success: true, team: null });
      }

      res.json({ success: true, team: teamMember.team });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  },

  async updateTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const { name, projectTheme, techStack, projectTitle, projectDesc } = req.body;

      const team = await prisma.team.update({
        where: { teamId },
        data: { name, projectTheme, techStack, projectTitle, projectDesc },
      });

      res.json({ success: true, team });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update team' });
    }
  },

  async submitProject(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const { pptLink, demoVideo, githubLink, apkLink } = req.body;

      const submission = await prisma.submission.upsert({
        where: { teamId },
        update: { pptLink, demoVideo, githubLink, apkLink },
        create: {
          teamId,
          pptLink,
          demoVideo,
          githubLink,
          apkLink,
        },
      });

      res.json({ success: true, submission });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit project' });
    }
  },
};