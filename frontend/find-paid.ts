import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const paidTeam = await prisma.team.findFirst({
    where: { payment: { status: 'SUCCESS' } },
    include: { payment: true, members: { include: { user: true } } }
  });

  if (paidTeam) {
    console.log('Found paid team:', paidTeam.id);
    const user = paidTeam.members[0].user;
    console.log('Email:', user.email);
  } else {
    console.log('No paid team found');
  }
}

main().finally(() => prisma.$disconnect());
