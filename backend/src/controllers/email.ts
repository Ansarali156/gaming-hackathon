import { Request, Response } from 'express';
import { sendEmail, getRegistrationEmailHtml, getPaymentFailureEmailHtml } from '../services/email';

export const emailController = {
  async sendEmail(req: Request, res: Response) {
    try {
      const { to, subject, html } = req.body;

      if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
      }

      const result = await sendEmail(to, subject, html);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  },

  async sendRegistrationSuccess(req: Request, res: Response) {
    try {
      const { email, teamName, teamId } = req.body;

      if (!email || !teamName || !teamId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await sendEmail(
        email,
        'Registration Successful - IncuXAI Gaming Hackathon',
        getRegistrationEmailHtml(teamName, teamId)
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  },

  async sendPaymentFailure(req: Request, res: Response) {
    try {
      const { email, teamName } = req.body;

      if (!email || !teamName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await sendEmail(
        email,
        'Payment Failed - IncuXAI Gaming Hackathon',
        getPaymentFailureEmailHtml(teamName)
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  },
};