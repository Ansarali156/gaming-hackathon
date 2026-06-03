import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../lib/mailer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from frontend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

async function processEmailQueue() {
  console.log(`[${new Date().toISOString()}] 🔍 Scanning EmailQueue for PENDING records...`);

  try {
    const pendingEmails = await prisma.emailQueue.findMany({
      where: {
        status: "PENDING",
        attempts: { lt: 5 } // Retry up to 5 times
      }
    });

    if (pendingEmails.length === 0) {
      console.log("🟢 No pending emails found in queue.");
      return;
    }

    console.log(`📥 Found ${pendingEmails.length} pending email(s) to process.`);

    for (const item of pendingEmails) {
      console.log(`📧 Attempting send to: ${item.to} (Attempt: ${item.attempts + 1})`);
      
      const nextAttempts = item.attempts + 1;
      let sendSuccess = false;
      let lastError = "";

      try {
        const result = await sendEmail({
          to: item.to,
          subject: item.subject,
          html: item.html
        });

        if (result.success) {
          sendSuccess = true;
        } else {
          lastError = String(result.error || "Email delivery failed on SMTP transmission");
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }

      if (sendSuccess) {
        await prisma.emailQueue.update({
          where: { id: item.id },
          data: {
            status: "SENT",
            attempts: nextAttempts,
            lastError: null
          }
        });
        console.log(`✅ Successfully sent and completed email to: ${item.to}`);
      } else {
        const nextStatus = nextAttempts >= 5 ? "FAILED" : "PENDING";
        await prisma.emailQueue.update({
          where: { id: item.id },
          data: {
            status: nextStatus,
            attempts: nextAttempts,
            lastError: lastError
          }
        });
        console.error(`❌ Failed attempt (${nextAttempts}/5) for ${item.to}. Error: ${lastError}`);
      }
    }
  } catch (error) {
    console.error("Critical error processing email queue:", error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isDaemon = args.includes("--daemon") || args.includes("-d");

  if (isDaemon) {
    const intervalSec = 60;
    console.log(`🚀 Starting Email Queue Processor in DAEMON mode (Interval: ${intervalSec}s)`);
    console.log("Press Ctrl+C to terminate process.");
    
    // Execute immediately on start
    await processEmailQueue();
    
    // Schedule repeating executions
    setInterval(async () => {
      await processEmailQueue();
    }, intervalSec * 1000);
  } else {
    console.log("🚀 Starting Email Queue Processor in SINGLE-RUN mode");
    await processEmailQueue();
    await prisma.$disconnect();
    console.log("👋 Execution complete.");
  }
}

main().catch(async (e) => {
  console.error("Fatal startup error:", e);
  await prisma.$disconnect();
  process.exit(1);
});
