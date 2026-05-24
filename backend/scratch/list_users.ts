import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching all users in PostgreSQL...");
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      createdAt: true
    }
  });

  console.log("Total users found:", users.length);
  users.forEach((u, i) => {
    console.log(`[User ${i + 1}]`);
    console.log(`  ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Name: ${u.name}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Password Exists: ${u.password ? 'YES (length: ' + u.password.length + ')' : 'NO'}`);
    console.log(`  Created At: ${u.createdAt}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Failed to fetch users:", e);
    await prisma.$disconnect();
  });
