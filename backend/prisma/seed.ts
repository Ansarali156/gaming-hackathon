import { PrismaClient, Role, Category, PaymentStatus, TeamStatus, TicketStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing non-user data to prevent duplicates
  await prisma.ticket.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.referral.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: [
          'admin@incuxai.com',
          'participant@incuxai.com',
          'sponsor@incuxai.com',
          'mentor@incuxai.com',
          'judge@incuxai.com',
        ],
      },
    },
  });

  const defaultPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 1. Core Role Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@incuxai.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@incuxai.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // 2. Create Sponsors
  const sponsorsData = [
    { name: 'Nvidia', tier: 'PLATINUM', logo: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128', website: 'https://nvidia.com', description: 'Nvidia AI technologies sponsor.', contact: 'nvidia@ai.com', isActive: true },
    { name: 'Epic Games', tier: 'PLATINUM', logo: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=128', website: 'https://epicgames.com', description: 'Unreal Engine credits & dev support.', contact: 'epic@gaming.com', isActive: true },
    { name: 'GitHub', tier: 'GOLD', logo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=128', website: 'https://github.com', description: 'GitHub Enterprise tools sponsor.', contact: 'github@coder.com', isActive: true },
    { name: 'Intel', tier: 'SILVER', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128', website: 'https://intel.com', description: 'Intel compute instances supplier.', contact: 'intel@chip.com', isActive: false },
  ];

  for (const s of sponsorsData) {
    await prisma.sponsor.create({ data: s });
  }

  // 3. Create Teams and Payments
  const categories = [Category.STUDENT, Category.IT_PROFESSIONAL, Category.STARTUP];
  const teamStatuses = [TeamStatus.APPROVED, TeamStatus.PENDING, TeamStatus.REJECTED];
  const paymentStatuses = [PaymentStatus.SUCCESS, PaymentStatus.PENDING, PaymentStatus.FAILED, PaymentStatus.REFUNDED];

  const teamData = [
    { name: 'Pixel Warriors', category: Category.STUDENT, status: TeamStatus.APPROVED, paymentStatus: PaymentStatus.SUCCESS, dateOffset: 5 },
    { name: 'Neural Nexus', category: Category.IT_PROFESSIONAL, status: TeamStatus.APPROVED, paymentStatus: PaymentStatus.SUCCESS, dateOffset: 4 },
    { name: 'Alpha Coders', category: Category.STUDENT, status: TeamStatus.PENDING, paymentStatus: PaymentStatus.PENDING, dateOffset: 3 },
    { name: 'Quantum Devs', category: Category.STARTUP, status: TeamStatus.APPROVED, paymentStatus: PaymentStatus.SUCCESS, dateOffset: 2 },
    { name: 'Metaverse Explorers', category: Category.STUDENT, status: TeamStatus.REJECTED, paymentStatus: PaymentStatus.FAILED, dateOffset: 2 },
    { name: 'Robo Knights', category: Category.IT_PROFESSIONAL, status: TeamStatus.PENDING, paymentStatus: PaymentStatus.PENDING, dateOffset: 1 },
    { name: 'AI Alchemists', category: Category.STARTUP, status: TeamStatus.PENDING, paymentStatus: PaymentStatus.SUCCESS, dateOffset: 1 },
    { name: 'Cyber Titans', category: Category.STUDENT, status: TeamStatus.APPROVED, paymentStatus: PaymentStatus.REFUNDED, dateOffset: 0 },
  ];

  for (let i = 0; i < teamData.length; i++) {
    const td = teamData[i];
    const teamId = `TEAM-${1000 + i}`;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - td.dateOffset);

    // Create a user who is the leader
    const leaderEmail = `leader${i}@incuxai.com`;
    const leader = await prisma.user.create({
      data: {
        email: leaderEmail,
        name: `${td.name} Leader`,
        password: defaultPassword,
        role: Role.PARTICIPANT,
        discordJoined: i % 2 === 0,
        createdAt,
      },
    });

    const team = await prisma.team.create({
      data: {
        teamId,
        name: td.name,
        category: td.category,
        status: td.status,
        projectTheme: 'AI Gaming Hackathon Project',
        projectTitle: `${td.name} Game`,
        createdAt,
      },
    });

    // Add leader to team
    await prisma.teamMember.create({
      data: {
        userId: leader.id,
        teamId: team.id,
        role: 'LEADER',
      },
    });

    // Create Payment
    let amount = 300;
    if (td.category === Category.IT_PROFESSIONAL) amount = 1000;
    else if (td.category === Category.STARTUP) amount = 5000;

    await prisma.payment.create({
      data: {
        teamId: team.id,
        amount,
        status: td.paymentStatus,
        razorpayOrderId: td.paymentStatus !== PaymentStatus.PENDING ? `order_pay_${10000 + i}` : null,
        razorpayPaymentId: td.paymentStatus === PaymentStatus.SUCCESS ? `pay_${20000 + i}` : null,
        gstInvoice: td.paymentStatus === PaymentStatus.SUCCESS ? `INV-2026-${100 + i}` : null,
        createdAt,
      },
    });

    // Create Referral
    if (i > 0 && i % 3 === 0) {
      await prisma.referral.create({
        data: {
          referrerId: admin.id,
          referredId: leader.id,
          points: 15,
          createdAt,
        },
      });
    }
  }

  // 4. Create Support Tickets
  const ticketData = [
    { subject: 'Double payment charged', category: 'Payment issues', message: 'I was charged twice during checkout. Order order_pay_10001.', status: TicketStatus.OPEN },
    { subject: 'Unity WebGL deployment crash', category: 'Technical issues', message: 'Our WebGL build crashes on start. Can we submit a Windows standalone instead?', status: TicketStatus.IN_PROGRESS },
    { subject: 'Can I add another team member?', category: 'Registration doubts', message: 'Currently we have 3 students. Can we add a 4th member?', status: TicketStatus.RESOLVED, response: 'Yes! Student teams can have up to 5 members.' },
    { subject: 'Failed transaction refund status', category: 'Payment issues', message: 'My payment failed but amount was deducted. Please check.', status: TicketStatus.CLOSED, response: 'Refund has been processed automatically by Razorpay.' },
  ];

  const allUsers = await prisma.user.findMany({ where: { role: Role.PARTICIPANT } });

  for (let i = 0; i < ticketData.length; i++) {
    const tk = ticketData[i];
    const user = allUsers[i % allUsers.length];

    await prisma.ticket.create({
      data: {
        userId: user.id,
        subject: tk.subject,
        category: tk.category,
        message: tk.message,
        status: tk.status,
        response: tk.response || null,
        assignedTo: tk.status === TicketStatus.IN_PROGRESS ? admin.id : null,
      },
    });
  }

  // 5. Create Announcements
  await prisma.announcement.create({
    data: {
      title: 'Hackathon Starts June 12!',
      message: 'Gear up! The main coding phase starts on June 12. Make sure you read the tracks and guidelines carefully.',
      visibility: 'ALL',
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Discord Role Bot Live',
      message: 'You can now link your Discord account in settings to receive your participant roles.',
      visibility: 'ALL',
      isPinned: false,
    },
  });

  console.log('Seed database completed successfully with mock data!');
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
