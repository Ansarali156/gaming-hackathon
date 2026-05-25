import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must contain uppercase, lowercase, number, and special character'),
});

export const authController = {
  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          teamMembers: {
            include: {
              team: true,
            },
          },
        },
      });
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is a PARTICIPANT with pending payment status
      if (user.role === 'PARTICIPANT') {
        const hasApprovedTeam = user.teamMembers.some(
          (tm: any) => tm.team.status === 'APPROVED'
        );
        if (!hasApprovedTeam) {
          return res.status(403).json({
            error: 'Your registration payment is pending. Please complete your payment before logging in.',
          });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Login failed' });
    }
  },

  async register(req: Request, res: Response): Promise<any> {
    try {
      const { email, name, password } = registerSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          password: hashedPassword,
          role: 'PARTICIPANT',
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Registration failed' });
    }
  },

  async getSession(req: Request, res: Response): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true, image: true },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      return res.json({ success: true, user });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },
};
