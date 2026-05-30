/**
 * Seed script: Creates a test team with leader user + SUCCESS payment
 * Run: npx ts-node scripts/seed-test-team.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const teamId = "INCUX-TEST-001";
  const email = "testleader@incuxai.com";

  // 1. Upsert leader user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Test Leader",
      mobile: "9999900000",
      college: "JNTUA Anantapur",
      role: "PARTICIPANT",
      password: "hashed_placeholder",
    },
  });
  console.log("✅ User created:", user.email);

  // 2. Upsert team
  const team = await prisma.team.upsert({
    where: { teamId },
    update: {},
    create: {
      teamId,
      name: "Test Team Alpha",
      category: "STUDENT",
      projectTheme: "AI in Gaming",
      techStack: "Python, TensorFlow, Unity",
      status: "APPROVED",
    },
  });
  console.log("✅ Team created:", team.teamId);

  // 3. Link user to team as leader
  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: user.id, teamId: team.id } },
    update: {},
    create: {
      userId: user.id,
      teamId: team.id,
      role: "LEADER",
    },
  });
  console.log("✅ Team member linked");

  // 4. Upsert payment with SUCCESS status
  const payment = await prisma.payment.upsert({
    where: { teamId: team.id },
    update: {},
    create: {
      teamId: team.id,
      amount: 500,
      gst: 90,
      finalAmount: 590,
      currency: "INR",
      status: "SUCCESS",
      razorpayOrderId: "order_TEST001DEMO",
      razorpayPaymentId: "pay_TEST001DEMO",
      razorpaySignature: "sig_TEST001DEMO",
    },
  });
  console.log("✅ Payment created:", payment.status, "₹" + payment.finalAmount);

  console.log("\n🎉 Test team seeded successfully!");
  console.log("   Team ID  :", teamId);
  console.log("   Login    :", email);
  console.log("   Payment  : SUCCESS ₹590");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
