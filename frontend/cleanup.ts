import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Looking for unpaid teams...");
  
  // Find all teams
  const allTeams = await prisma.team.findMany({
    include: {
      payment: true,
      paymentTransactions: true,
      members: {
        include: { user: true }
      }
    }
  });

  let deletedCount = 0;

  for (const team of allTeams) {
    const isPaid = team.paymentTransactions.some(t => t.paymentStatus === 'SUCCESSFUL') || team.payment?.status === 'SUCCESS';
    
    if (!isPaid) {
      console.log(`Deleting team: ${team.name} (Payment not done)`);
      
      const userIdsToDelete = team.members.map(m => m.userId).filter(Boolean) as string[];

      // Delete team members
      await prisma.teamMember.deleteMany({
        where: { teamId: team.id }
      });

      // Delete payment transactions
      await prisma.paymentTransaction.deleteMany({
        where: { teamId: team.id }
      });

      // Delete old payment
      if (team.payment) {
        await prisma.payment.delete({
          where: { id: team.payment.id }
        });
      }

      // Delete team
      await prisma.team.delete({
        where: { id: team.id }
      });

      // Delete users associated exclusively with this team
      for (const userId of userIdsToDelete) {
        await prisma.user.deleteMany({
          where: { id: userId, role: "PARTICIPANT" }
        });
      }
      
      deletedCount++;
    }
  }
  
  console.log(`Deleted ${deletedCount} unpaid teams from the database.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
