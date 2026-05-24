import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting cleanup of teams and participants from the database...");

  // 1. Delete all cascading dependencies or children first
  const deletedTickets = await prisma.ticket.deleteMany({});
  console.log(`Deleted ${deletedTickets.count} tickets.`);

  const deletedPayments = await prisma.payment.deleteMany({});
  console.log(`Deleted ${deletedPayments.count} payments.`);

  const deletedTeamMembers = await prisma.teamMember.deleteMany({});
  console.log(`Deleted ${deletedTeamMembers.count} team members.`);

  const deletedSubmissions = await prisma.submission.deleteMany({});
  console.log(`Deleted ${deletedSubmissions.count} submissions.`);

  const deletedTeams = await prisma.team.deleteMany({});
  console.log(`Deleted ${deletedTeams.count} teams.`);

  const deletedReferrals = await prisma.referral.deleteMany({});
  console.log(`Deleted ${deletedReferrals.count} referrals.`);

  const deletedAmbassadors = await prisma.campusAmbassador.deleteMany({});
  console.log(`Deleted ${deletedAmbassadors.count} campus ambassadors.`);

  // 2. Delete all users except ADMIN accounts
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: {
        not: 'ADMIN'
      }
    }
  });
  console.log(`Deleted ${deletedUsers.count} non-admin users.`);

  // Ensure there is at least one admin account
  const adminExists = await prisma.user.findFirst({
    where: {
      role: 'ADMIN'
    }
  });

  if (!adminExists) {
    console.log("No admin user found. Creating a default admin account...");
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@incuxai.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN'
      }
    });
    console.log("Created default admin user: admin@incuxai.com / admin123");
  } else {
    console.log(`Admin user(s) preserved: ${adminExists.email}`);
  }

  console.log("Database cleanup completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
