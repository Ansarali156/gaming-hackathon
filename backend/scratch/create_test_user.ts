import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  const testEmail = 'tester@aigaming.com';
  const testPassword = 'Password123!';
  const teamName = 'Alpha Coders';
  const teamId = 'INC268888';

  console.log('🏁 Creating approved test participant user account...');
  console.log(`✉️  Test Email: ${testEmail}`);
  console.log(`🔑 Test Password: ${testPassword}`);

  try {
    // 1. Cleanup old test runs if any
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
      include: {
        teamMembers: {
          include: {
            team: true
          }
        }
      }
    });

    if (existingUser) {
      console.log('🧹 Pruning existing test account...');
      const teamIds = existingUser.teamMembers.map(tm => tm.team.id);
      if (teamIds.length > 0) {
        await prisma.team.deleteMany({
          where: { id: { in: teamIds } }
        });
      }
      await prisma.user.delete({
        where: { id: existingUser.id }
      });
      console.log('🗑️ Deleted old test records.');
    }

    // 2. Hash test password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // 3. Create fully approved Team, User (Leader), and successful Payment
    const team = await prisma.team.create({
      data: {
        teamId,
        name: teamName,
        category: 'STUDENT',
        status: 'APPROVED', // Fully approved team
        members: {
          create: [
            {
              user: {
                create: {
                  email: testEmail,
                  name: 'Test Participant',
                  mobile: '9999999999',
                  college: 'AI Institute',
                  password: hashedPassword,
                  role: 'PARTICIPANT',
                },
              },
              role: 'LEADER',
            }
          ] as any,
        },
        payment: {
          create: {
            amount: 600.00,
            gst: 12.00,
            finalAmount: 612.00,
            status: 'SUCCESS', // Successfully paid
            razorpayPaymentId: 'pay_test_' + Math.random().toString(36).substring(2, 10),
            razorpayOrderId: 'order_test_' + Math.random().toString(36).substring(2, 10),
          }
        }
      },
      include: {
        members: { include: { user: true } },
        payment: true,
      }
    });

    console.log('🎉 Test participant user account successfully created & approved!');
    console.log(`🆔 Team ID: ${team.teamId}`);
    console.log(`🚀 You can now log in at http://localhost:3000/login using the credentials above!`);

  } catch (error) {
    console.error('❌ Failed to create test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
