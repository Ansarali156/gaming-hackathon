import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database cleanup. Keeping ONLY team INC260005 and Admin accounts...");

  // 1. Find team INC260005
  const keepTeam = await prisma.team.findUnique({
    where: { teamId: "INC260005" },
    include: { members: { include: { user: true } } }
  });

  if (!keepTeam) {
    console.error("❌ Critical Error: Team INC260005 not found! Aborting deletion to prevent data loss.");
    return;
  }

  // 2. Collect IDs to keep
  const keepUserEmails = keepTeam.members.map(m => m.user.email.toLowerCase());
  keepUserEmails.push("admin@incuxai.com"); // Always keep admin

  console.log("Keeping team:", keepTeam.name, `(${keepTeam.teamId})`);
  console.log("Keeping users:", keepUserEmails);

  // 3. Find teams to delete (all except INC260005)
  const deleteTeams = await prisma.team.findMany({
    where: {
      NOT: { teamId: "INC260005" }
    }
  });

  console.log(`\nFound ${deleteTeams.length} teams to delete:`);
  deleteTeams.forEach(t => console.log(` - Team: ${t.name} (ID: ${t.teamId})`));

  // Perform deletion in a transaction
  await prisma.$transaction(async (tx) => {
    // Delete payments for teams to be deleted
    const deletedPayments = await tx.payment.deleteMany({
      where: {
        team: {
          NOT: { teamId: "INC260005" }
        }
      }
    });
    console.log(`\n🗑️ Deleted ${deletedPayments.count} payment records.`);

    // Delete team submissions for teams to be deleted
    const deletedSubmissions = await tx.submission.deleteMany({
      where: {
        team: {
          NOT: { teamId: "INC260005" }
        }
      }
    });
    console.log(`🗑️ Deleted ${deletedSubmissions.count} submission records.`);

    // Delete team members for teams to be deleted
    const deletedMembers = await tx.teamMember.deleteMany({
      where: {
        team: {
          NOT: { teamId: "INC260005" }
        }
      }
    });
    console.log(`🗑️ Deleted ${deletedMembers.count} team member associations.`);

    // Delete the teams themselves
    const deletedTeamsRes = await tx.team.deleteMany({
      where: {
        NOT: { teamId: "INC260005" }
      }
    });
    console.log(`🗑️ Deleted ${deletedTeamsRes.count} team records.`);

    // Delete users who are NOT in the keep list and have Role !== ADMIN
    // (This keeps other admin accounts if they exist, but safely deletes all test participants)
    const deletedUsers = await tx.user.deleteMany({
      where: {
        AND: [
          { email: { notIn: keepUserEmails } },
          { role: { not: "ADMIN" } }
        ]
      }
    });
    console.log(`🗑️ Deleted ${deletedUsers.count} test user accounts.`);

    // Delete pending registration drafts (since those were promoted, we can clean up any remaining drafts)
    const deletedDrafts = await tx.pendingRegistration.deleteMany();
    console.log(`🗑️ Deleted ${deletedDrafts.count} outstanding staging drafts.`);

    // Delete email queue logs
    const deletedEmails = await tx.emailQueue.deleteMany();
    console.log(`🗑️ Deleted ${deletedEmails.count} email queue logs.`);
  });

  console.log("\n⭐ Database successfully cleaned! Pristine state restored.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Cleanup failed:", e);
    await prisma.$disconnect();
  });
