import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching list of tables in PostgreSQL...");
  const tables: any[] = await prisma.$queryRaw`
    SELECT tablename 
    FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public'
  `;
  console.log("Tables found:", tables.map(t => t.tablename));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Failed to fetch tables:", e);
    await prisma.$disconnect();
  });
