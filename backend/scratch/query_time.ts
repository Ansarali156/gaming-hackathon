import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== Querying exact timestamps for team INC260005 ===");
  
  const team = await prisma.team.findUnique({
    where: { teamId: "INC260005" },
    include: {
      payment: true,
      members: {
        include: { user: true }
      }
    }
  });

  if (!team) {
    console.error("Team INC260005 not found!");
    return;
  }

  console.log("Team Details:");
  console.log(`  Team ID: ${team.teamId}`);
  console.log(`  Name: ${team.name}`);
  console.log(`  Created At (ISO): ${team.createdAt.toISOString()}`);
  console.log(`  Created At (Local String): ${team.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (India Standard Time)`);
  console.log(`  Created At (Raw Date String): ${team.createdAt.toString()}`);

  if (team.payment) {
    console.log("\nPayment Details:");
    console.log(`  Amount: ₹${team.payment.amount}`);
    console.log(`  Status: ${team.payment.status}`);
    console.log(`  Razorpay Payment ID: ${team.payment.razorpayPaymentId}`);
    console.log(`  Payment Created At (ISO): ${team.payment.createdAt.toISOString()}`);
    console.log(`  Payment Created At (Local String): ${team.payment.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (India Standard Time)`);
    console.log(`  Payment Updated At (ISO): ${team.payment.updatedAt.toISOString()}`);
    console.log(`  Payment Updated At (Local String): ${team.payment.updatedAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (India Standard Time)`);
  }

  console.log("\nMembers Details:");
  team.members.forEach((m, idx) => {
    console.log(`[Member ${idx + 1}] Role: ${m.role}`);
    console.log(`  Name: ${m.user.name}`);
    console.log(`  Email: ${m.user.email}`);
    console.log(`  User Created At (ISO): ${m.user.createdAt.toISOString()}`);
    console.log(`  User Created At (Local String): ${m.user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (India Standard Time)`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
