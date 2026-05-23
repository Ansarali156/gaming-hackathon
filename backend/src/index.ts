import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import { createServer } from 'http';
import { initializeSocket } from './socket/socket';

// Import routes
import authRoutes from './routes/auth';
import registerRoutes from './routes/register';
import paymentRoutes from './routes/payments';
import teamRoutes from './routes/teams';
import adminRoutes from './routes/admin';
import chatRoutes from './routes/chat';
import emailRoutes from './routes/email';
import discordRoutes from './routes/discord';


const app = express();
const httpServer = createServer(app);
initializeSocket(httpServer);
const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/discord', discordRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
httpServer.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  
  // Retry DB connection (Render free-tier databases wake up slowly)
  const maxRetries = 10;
  let retries = 0;
  
  const connectWithRetry = async () => {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error: any) {
      retries++;
      if (retries < maxRetries) {
        console.log(`⏳ Database not ready (attempt ${retries}/${maxRetries}), retrying in 5s...`);
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error('❌ Database connection failed after max retries:', error?.message || error);
      }
    }
  };
  
  connectWithRetry();
});

export default app;