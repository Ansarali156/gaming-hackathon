import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const email = "pendingleader@incuxai.com";
  const teamId = "INCUX-TEST-002";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Pending Leader",
      mobile: "9888800000",
      college: "JNTUA Anantapur",
      role: "PARTICIPANT",
      password: "hashed_placeholder",
    },
  });

  const team = await prisma.team.upsert({
    where: { teamId },
    update: {},
    create: {
      teamId,
      name: "Test Team Beta",
      category: "STUDENT",
      projectTheme: "AI in Gaming",
      status: "PENDING",
    },
  });

  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: user.id, teamId: team.id } },
    update: {},
    create: { userId: user.id, teamId: team.id, role: "LEADER" },
  });

  const payment = await prisma.payment.upsert({
    where: { teamId: team.id },
    update: {},
    create: {
      teamId: team.id,
      amount: 500,
      gst: 90,
      finalAmount: 590,
      currency: "INR",
      status: "PENDING",
      razorpayOrderId: "order_PENDING002DEMO",
    },
  });

  console.log("✅ Team:", team.teamId, "| Payment:", payment.status, "₹" + payment.finalAmount);
  console.log("✅ Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
