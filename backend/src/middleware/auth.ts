import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

export interface AuthRequest extends Request {
  dbUser?: any; // Prisma User object
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.user = decoded;

    // Fetch user from DB based on userId from token
    if (req.user && req.user.userId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: req.user.userId },
      });
      if (user) {
        req.dbUser = user;
      }
    } catch (error) {
      console.error('Error fetching user from DB:', error);
      next(); // Proceed anyway, or fail securely depending on requirements
    }
  }
];

// Authorize roles (requires authenticate to run first)
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    if (!roles.includes(req.dbUser.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};