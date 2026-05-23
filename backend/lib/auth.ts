import { prisma } from './prisma';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-secret-key-2026';

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      discordJoined: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requireAuth(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin(req: Request) {
  const user = await requireAuth(req);
  if (user.role !== 'ADMIN') throw new Error('Forbidden');
  return user;
}
