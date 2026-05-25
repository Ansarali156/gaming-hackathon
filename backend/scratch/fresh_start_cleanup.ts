import { prisma } from '../lib/prisma';

async function performFreshStartCleanup() {
  console.log('🧹 Starting fresh-start database cleanup...');

  try {
    // 1. Delete all PendingRegistration drafts
    const pendingRegCount = await prisma.pendingRegistration.deleteMany({});
    console.log(`🗑️ Deleted ${pendingRegCount.count} pending registration drafts.`);

    // 2. Delete all announcement notifications
    const announcementCount = await prisma.announcement.deleteMany({});
    console.log(`🗑️ Deleted ${announcementCount.count} announcement notifications.`);

    // 3. Find and delete all teams that are not APPROVED (PENDING or REJECTED)
    // Deleting teams automatically deletes associated payment and team member records due to Cascade onDelete
    const pendingTeams = await prisma.team.findMany({
      where: {
        status: { not: 'APPROVED' }
      },
      include: {
        members: {
          include: { user: true }
        }
      }
    });

    if (pendingTeams.length > 0) {
      console.log(`🔍 Found ${pendingTeams.length} payment-pending/rejected teams. Deleting...`);
      
      const teamIds = pendingTeams.map(t => t.id);
      
      // Collect associated participant users who only belong to these pending teams
      const participantUserIdsToDelete: string[] = [];
      for (const t of pendingTeams) {
        for (const m of t.members) {
          if (m.user.role === 'PARTICIPANT') {
            participantUserIdsToDelete.push(m.user.id);
          }
        }
      }

      // Delete the teams
      await prisma.team.deleteMany({
        where: { id: { in: teamIds } }
      });

      // Delete the corresponding participant users if they exist
      if (participantUserIdsToDelete.length > 0) {
        await prisma.user.deleteMany({
          where: {
            id: { in: participantUserIdsToDelete },
            role: 'PARTICIPANT' // Extra guard to never touch admins or sponsors
          }
        });
      }
      console.log(`🗑️ Successfully deleted ${pendingTeams.length} pending teams and their associated participant accounts.`);
    } else {
      console.log('✅ No pending or unpaid teams found in the primary tables.');
    }

    console.log('✨ Database is now completely pruned and ready for a fresh start!');

  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

performFreshStartCleanup();
