import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== 1. PENDING REGISTRATIONS ===");
  const pendingRegs = await prisma.pendingRegistration.findMany();
  console.log(`Total Pending Registrations in Draft: ${pendingRegs.length}`);
  pendingRegs.forEach((pr, i) => {
    const payload = pr.payload as any;
    console.log(`[Draft ${i + 1}]`);
    console.log(`  ID: ${pr.id}`);
    console.log(`  Email: ${pr.email}`);
    console.log(`  Team Name: ${pr.teamName}`);
    console.log(`  Leader Password Exists: ${payload?.leader?.password ? 'YES' : 'NO'}`);
    console.log(`  Final Amount: ₹${payload?.finalAmount}`);
  });

  console.log("\n=== 2. TEAMS AND THEIR STATUS ===");
  const teams = await prisma.team.findMany({
    include: {
      payment: true,
      members: {
        include: { user: true }
      }
    }
  });
  console.log(`Total Teams found: ${teams.length}`);
  teams.forEach((t, i) => {
    console.log(`[Team ${i + 1}]`);
    console.log(`  Team ID: ${t.teamId}`);
    console.log(`  Name: ${t.name}`);
    console.log(`  Status: ${t.status}`);
    console.log(`  Payment Status: ${t.payment?.status || 'NONE'}`);
    console.log(`  Payment Razorpay ID: ${t.payment?.razorpayPaymentId || 'NONE'}`);
    console.log(`  Members count: ${t.members.length}`);
    const leader = t.members.find(m => m.role === 'LEADER');
    if (leader) {
      console.log(`    Leader: ${leader.user.name} (${leader.user.email})`);
      console.log(`    Leader Password Exists: ${leader.user.password ? 'YES' : 'NO'}`);
    }
  });

  console.log("\n=== 3. PAYMENTS ===");
  const payments = await prisma.payment.findMany();
  console.log(`Total Payments found: ${payments.length}`);
  payments.forEach((p, i) => {
    console.log(`[Payment ${i + 1}]`);
    console.log(`  ID: ${p.id}`);
    console.log(`  Amount: ₹${p.amount}`);
    console.log(`  Status: ${p.status}`);
    console.log(`  Razorpay Payment ID: ${p.razorpayPaymentId}`);
    console.log(`  Razorpay Order ID: ${p.razorpayOrderId}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Diagnostic failed:", e);
    await prisma.$disconnect();
  });
