import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import { registerController } from '../src/controllers/register';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

function decryptSunPayload(data: string, iv: string, tag: string, mac: string) {
  const sharedKey = process.env.SUN_SHARED_KEY;
  if (!sharedKey) throw new Error('SUN_SHARED_KEY not set');

  const key = crypto.createHash('sha256').update(sharedKey).digest();
  
  const ivBuffer = Buffer.from(iv, 'base64');
  const ciphertextBuffer = Buffer.from(data, 'base64');
  const tagBuffer = Buffer.from(tag, 'base64');
  const macBuffer = Buffer.from(mac, 'base64');

  // Verify HMAC MAC
  const expectedMac = crypto.createHmac('sha256', key).update(Buffer.concat([ivBuffer, ciphertextBuffer, tagBuffer])).digest();
  if (!crypto.timingSafeEqual(macBuffer, expectedMac)) {
    throw new Error('HMAC signature verification failed - signature is invalid!');
  }

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
  decipher.setAuthTag(tagBuffer);

  const decrypted = decipher.update(ciphertextBuffer, undefined, 'utf8') + decipher.final('utf8');
  return JSON.parse(decrypted);
}

async function runTest() {
  console.log('🚀 Starting end-to-end Registration & Payment Gateway flow test...');

  // Generate unique team and email for this specific test run
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const testTeamName = `Test Team ${randomSuffix}`;
  const testEmail = `test-leader-${randomSuffix}@example.com`;

  const payload = {
    category: 'STUDENT',
    teamName: testTeamName,
    leader: {
      email: testEmail,
      name: 'Test Leader',
      mobile: '9999999999',
      skills: 'TypeScript, Express, Next.js',
      college: 'IncuX Academy',
    },
    members: [
      {
        name: 'Test Member 1',
        email: `test-member1-${randomSuffix}@example.com`,
        skills: 'React, TailwindCSS',
        role: 'Frontend Developer',
      }
    ],
    projectTheme: 'AI NPC Systems',
    techStack: 'Unity, Next.js, Node.js',
    returnSunRedirect: true,
  };

  console.log(`\n📦 Submitting test payload for team "${testTeamName}"...`);
  console.log(`✉️  Leader Email: ${testEmail}`);

  // Mock Request and Response
  const req: any = {
    body: payload,
  };

  let responseData: any = null;
  let statusSet: number = 200;

  const res: any = {
    status(code: number) {
      statusSet = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    }
  };

  try {
    await registerController.createRegistration(req, res);

    if (statusSet >= 400 || !responseData || !responseData.success) {
      console.error(`\n❌ Registration Failed! Status Code: ${statusSet}`);
      console.error('Response:', responseData);
      process.exit(1);
    }

    console.log('\n✅ Registration Created Successfully in Database!');
    console.log(`🆔 Team ID: ${responseData.teamId}`);
    console.log(`🔗 Returned Redirect URL:\n${responseData.sunRedirectUrl}`);

    // Parse and decrypt the returned URL parameters
    const redirectUrlObj = new URL(responseData.sunRedirectUrl);
    console.log('\n🔍 Parsing and Decrypting Sun Payment Parameters...');

    const data = redirectUrlObj.searchParams.get('data')!;
    const iv = redirectUrlObj.searchParams.get('iv')!;
    const tag = redirectUrlObj.searchParams.get('tag')!;
    const mac = redirectUrlObj.searchParams.get('mac')!;
    const timestamp = redirectUrlObj.searchParams.get('timestamp')!;
    const sender = redirectUrlObj.searchParams.get('sender')!;

    console.log(`  - Sender: ${sender}`);
    console.log(`  - Timestamp (Seconds): ${timestamp}`);

    const decryptedPayload = decryptSunPayload(data, iv, tag, mac);
    console.log('\n🎉 Decrypted Payload details successfully:');
    console.log(JSON.stringify(decryptedPayload, null, 2));

    console.log('\n⭐ Integration flow is 100% correct and verified!');

    // Cleanup database records to keep DB pristine
    console.log('\n🧹 Cleaning up test database records...');
    const deletedTeam = await prisma.team.delete({
      where: { teamId: responseData.teamId }
    });
    console.log(`🗑️ Successfully deleted test team "${deletedTeam.name}" from database.`);

  } catch (error) {
    console.error('\n❌ Test Run Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('👋 Database disconnected.');
  }
}

runTest();
