import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting manual promotion of pending successful payment drafts with unique teamId resolution...");

  const drafts = await prisma.pendingRegistration.findMany();
  console.log(`Found ${drafts.length} drafts in PendingRegistration.`);

  for (const draft of drafts) {
    const payload = draft.payload as any;
    const { category, teamName, leader, members, projectTheme, techStack, teamId, baseAmount, gst, finalAmount } = payload;

    console.log(`\n📦 Promoting draft for Leader: ${draft.email} (Team: "${teamName}")`);

    try {
      // Check if team leader already exists in primary User table
      const existingUser = await prisma.user.findUnique({
        where: { email: draft.email.toLowerCase() }
      });

      if (existingUser) {
        console.log(`⚠️ User ${draft.email} already exists in primary User table. Skipping.`);
        continue;
      }

      // Check if team name already exists
      const existingTeamName = await prisma.team.findFirst({
        where: { name: { equals: teamName.trim(), mode: "insensitive" } }
      });

      if (existingTeamName) {
        console.log(`⚠️ Team with name "${teamName}" already exists. Skipping.`);
        continue;
      }

      // Generate a dynamically guaranteed unique teamId
      let activeTeamId = teamId;
      let conflict = await prisma.team.findUnique({ where: { teamId: activeTeamId } });
      
      if (conflict) {
        let isUnique = false;
        let attempt = 1;
        const prefix = "INC";
        const year = new Date().getFullYear().toString().slice(-2);
        
        while (!isUnique) {
          const count = await prisma.team.count();
          const number = (count + attempt).toString().padStart(4, "0");
          activeTeamId = `${prefix}${year}${number}`;
          
          const duplicate = await prisma.team.findUnique({ where: { teamId: activeTeamId } });
          if (!duplicate) {
            isUnique = true;
          } else {
            attempt++;
          }
        }
        console.log(`⚡ Team ID collision resolved: changed ID from "${teamId}" to "${activeTeamId}"`);
      }

      // Atomically create Team, Users, and Payment, then delete the draft
      await prisma.$transaction(async (tx) => {
        await tx.team.create({
          data: {
            teamId: activeTeamId,
            name: teamName,
            category,
            projectTheme,
            techStack,
            status: "APPROVED",
            members: {
              create: [
                {
                  user: {
                    create: {
                      email: leader.email.toLowerCase(),
                      name: leader.name,
                      mobile: leader.mobile,
                      college: leader.college,
                      linkedin: leader.linkedin,
                      password: leader.password, // Already hashed
                      role: "PARTICIPANT",
                    },
                  },
                  role: "LEADER",
                  skills: leader.skills,
                },
                ...members.map((m: any) => ({
                  user: {
                    connectOrCreate: {
                      where: { email: m.email.toLowerCase() },
                      create: {
                        email: m.email.toLowerCase(),
                        name: m.name,
                        role: "PARTICIPANT",
                      },
                    },
                  },
                  role: "MEMBER",
                  skills: m.skills,
                  position: m.role,
                })),
              ] as any,
            },
            payment: {
              create: {
                amount: baseAmount,
                gst: gst,
                finalAmount: finalAmount,
                status: "SUCCESS",
                razorpayPaymentId: `pay_manual_${Math.floor(Math.random() * 1000000)}`,
                razorpayOrderId: `order_manual_${Math.floor(Math.random() * 1000000)}`,
              },
            },
          },
        });

        // Delete the draft
        await tx.pendingRegistration.delete({
          where: { id: draft.id }
        });
      });

      console.log(`✅ Successfully promoted and created login for "${draft.email}" (Team ID: ${activeTeamId})`);
    } catch (err) {
      console.error(`❌ Failed to promote draft for "${draft.email}":`, err);
    }
  }

  console.log("\n⭐ All successful payment drafts have been processed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Promotion script failed:", e);
    await prisma.$disconnect();
  });
