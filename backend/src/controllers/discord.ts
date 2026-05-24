import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const discordController = {
  oauthRedirect(req: Request, res: Response) {
    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.BACKEND_URL + '/api/discord/callback')}&response_type=code&scope=identify%20guilds`;
    res.redirect(discordOAuthUrl);
  },

  async oauthCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: process.env.BACKEND_URL + '/api/discord/callback',
          scope: 'identify guilds',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json() as { access_token: string };
      const accessToken = tokenData.access_token;

      // Get user info from Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch Discord user info');
      }

      const discordUser = await userResponse.json() as { id: string; username: string };

      // Update user in database
      await prisma.user.updateMany({
        where: { discordId: discordUser.id },
        data: { discordJoined: true },
      });

      // Redirect back to frontend
      res.redirect(`${process.env.FRONTEND_URL}/register?discord_verified=true`);
    } catch (error) {
      console.error('Discord OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/register?discord_error=true`);
    }
  },

  async verifyMembership(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      // Check if user is in Discord server
      const response = await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
        {
          headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        }
      );

      if (response.ok) {
        res.json({ success: true, verified: true });
      } else {
        res.json({ success: true, verified: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify Discord membership' });
    }
  },
};