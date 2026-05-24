import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function sendEmail(to: string, type: string, payload: any) {
  console.log(`[EMAIL WORKER] Sending ${type} to ${to} with data:`, payload);

  const user = process.env.EMAIL_USER || "incuxaigaming@gmail.com";
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    console.warn(`⚠️ Mock Email - To: ${to} | Type: ${type}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const subject = "Registration Confirmed - IncuXai Gaming Hackathon 🎮";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #a855f7; text-align: center; font-size: 24px; margin-bottom: 20px;">Registration Success!</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">Dear Lead,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">Congratulations! Your team <strong>${payload.teamName}</strong> has been successfully registered and approved for the <strong>IncuXai Gaming Hackathon 2026</strong>.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <h3 style="color: #333; font-size: 18px; margin-bottom: 12px;">Transaction Details:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; border-b: 1px solid #f5f5f5;">Transaction ID:</td>
          <td style="padding: 10px 0; font-family: monospace; font-weight: bold; font-size: 14px; color: #333; border-b: 1px solid #f5f5f5; text-align: right;">${payload.transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; border-b: 1px solid #f5f5f5;">Amount Paid:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #16a34a; font-size: 14px; border-b: 1px solid #f5f5f5; text-align: right;">₹${payload.amount}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; border-b: 1px solid #f5f5f5;">Status:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #16a34a; font-size: 14px; border-b: 1px solid #f5f5f5; text-align: right;">SUCCESSFUL</td>
        </tr>
      </table>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 14px; color: #555; line-height: 1.6;">
        You can now log in to your participant dashboard using your registered credentials to view tracks, timelines, and prepare for official submissions.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:3000/login" style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(168, 85, 247, 0.2);">Go to Dashboard</a>
      </div>
      <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
        Secured by Razorpay • IncuXai Platform Support
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"IncuXai Gaming Hackathon" <${user}>`,
    to,
    subject,
    html,
  });
}

async function processEmailQueue() {
  console.log('[EMAIL WORKER] Checking for queued emails...');

  try {
    // Pessimistic locking for queue processing
    await prisma.$transaction(async (tx) => {
      // Find one queued or retriable failed email
      const jobs = await tx.$queryRaw<any[]>`
        SELECT * FROM email_outbox 
        WHERE ("deliveryStatus" = 'QUEUED' OR ("deliveryStatus" = 'FAILED' AND "nextAttemptAt" <= NOW()))
        AND "retryCount" < 5
        ORDER BY "createdAt" ASC
        LIMIT 5
        FOR UPDATE SKIP LOCKED
      `;

      if (jobs.length === 0) {
        return;
      }

      console.log(`[EMAIL WORKER] Found ${jobs.length} jobs to process.`);

      for (const job of jobs) {
        // Mark as processing
        await (tx as any).emailOutbox.update({
          where: { id: job.id },
          data: { deliveryStatus: 'PROCESSING' },
        });

        try {
          await sendEmail(job.recipientEmail, job.emailType, job.contextPayload);

          // Mark as sent
          await (tx as any).emailOutbox.update({
            where: { id: job.id },
            data: { deliveryStatus: 'SENT' },
          });
          console.log(`[EMAIL WORKER] Successfully sent email to ${job.recipientEmail}`);

        } catch (error: any) {
          console.error(`[EMAIL WORKER] Failed to send email to ${job.recipientEmail}:`, error.message);
          
          const newRetryCount = job.retryCount + 1;
          const backoffMinutes = Math.pow(2, newRetryCount); // Exponential backoff: 2, 4, 8, 16 mins
          const nextAttempt = new Date(Date.now() + backoffMinutes * 60000);

          await (tx as any).emailOutbox.update({
            where: { id: job.id },
            data: {
              deliveryStatus: 'FAILED',
              retryCount: newRetryCount,
              nextAttemptAt: nextAttempt,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error('[EMAIL WORKER] Queue processing error:', error);
  }
}

async function cleanupAbandonedRegistrations() {
  console.log('[CLEANUP WORKER] Checking for abandoned registrations...');
  try {
    // Find teams created more than 15 minutes ago
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const abandonedTeams = await prisma.team.findMany({
      where: {
        createdAt: { lt: fifteenMinutesAgo },
        status: 'PENDING'
      },
      include: {
        payment: true,
        members: true
      }
    });

    for (const team of abandonedTeams) {
      const isPaid = team.payment?.status === 'SUCCESS';
      
      if (!isPaid) {
        console.log(`[CLEANUP WORKER] Deleting abandoned unpaid team: ${team.name}`);
        const userIds = team.members.map(m => m.userId).filter(Boolean);

        await prisma.$transaction([
          prisma.teamMember.deleteMany({ where: { teamId: team.id } }),
          ...(team.payment ? [prisma.payment.delete({ where: { id: team.payment.id } })] : []),
          prisma.team.delete({ where: { id: team.id } }),
          prisma.user.deleteMany({ where: { id: { in: userIds as string[] }, role: "PARTICIPANT" } })
        ]);
      }
    }
  } catch (error) {
    console.error('[CLEANUP WORKER] Error during cleanup:', error);
  }
}

// Run the email queue every 10 seconds
setInterval(processEmailQueue, 10000);

// Run the cleanup task every 5 minutes
setInterval(cleanupAbandonedRegistrations, 5 * 60 * 1000);
// Also run it once on startup
cleanupAbandonedRegistrations();

console.log('[WORKERS] Started polling email queue and registration cleanup...');
