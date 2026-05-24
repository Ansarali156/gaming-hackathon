import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config({ path: path.join(__dirname, '../.env') });

const WEBHOOK_SECRET = 'test_webhook_secret';
const WEBHOOK_URL = 'http://localhost/sun/public/gaminghackathon/razorpay-webhook.php';

async function runWebhookTest() {
  console.log('🚀 Starting end-to-end Razorpay Webhook integration test...');

  const mockOrderId = `order_${Math.floor(Math.random() * 100000000)}`;
  const mockPaymentId = `pay_${Math.floor(Math.random() * 100000000)}`;
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const testTeamId = `INC${randomSuffix}`;

  // 1. Insert a mock pending registration directly into SUN's SQLite database
  console.log('\n🗄️  Inserting mock pending registration in SUN SQLite database...');
  const dbFile = 'C:\\xampp\\htdocs\\sun\\public\\gaminghackathon\\orders.sqlite';
  
  try {
    const db = await open({
      filename: dbFile,
      driver: sqlite3.Database
    });

    // Create tables if not exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS gaming_teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id TEXT UNIQUE,
        team_name TEXT,
        leader_id TEXT,
        leader_name TEXT,
        leader_email TEXT,
        leader_mobile TEXT,
        amount REAL,
        team_registration_status TEXT DEFAULT 'PENDING',
        created_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS gaming_payment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id TEXT,
        razorpay_order_id TEXT UNIQUE,
        razorpay_payment_id TEXT UNIQUE,
        amount REAL,
        payment_status TEXT DEFAULT 'PENDING',
        created_at INTEGER,
        updated_at INTEGER
      );
    `);

    // Insert pending team
    await db.run(`
      INSERT INTO gaming_teams (team_id, team_name, leader_id, leader_name, leader_email, leader_mobile, amount, team_registration_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `, [
      testTeamId,
      `Webhook Test Team ${randomSuffix}`,
      `user_${randomSuffix}`,
      'Webhook Leader',
      `test-leader-webhook-${randomSuffix}@example.com`,
      '9999999999',
      1200,
      Math.floor(Date.now() / 1000)
    ]);

    // Insert pending payment mapping to razorpay_order_id
    await db.run(`
      INSERT INTO gaming_payment (team_id, razorpay_order_id, amount, payment_status, created_at, updated_at)
      VALUES (?, ?, ?, 'PENDING', ?, ?)
    `, [
      testTeamId,
      mockOrderId,
      1200,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000)
    ]);

    await db.close();
    console.log('✅ SQLite records inserted successfully!');
    console.log(`  - Team ID: ${testTeamId}`);
    console.log(`  - Order ID: ${mockOrderId}`);

  } catch (dbErr) {
    console.error('❌ Failed to setup SQLite test data:', dbErr);
    process.exit(1);
  }

  // 2. Build Razorpay Webhook Payload
  const webhookBody = {
    entity: 'event',
    account_id: 'acc_7iV281N89',
    event: 'order.paid',
    contains: ['order', 'payment'],
    payload: {
      order: {
        entity: {
          id: mockOrderId,
          entity: 'order',
          amount: 120000,
          amount_paid: 120000,
          amount_due: 0,
          currency: 'INR',
          receipt: 'receipt_test',
          status: 'paid',
          attempts: 1,
          notes: {
            source: 'gaminghackathon'
          },
          created_at: Math.floor(Date.now() / 1000)
        }
      },
      payment: {
        entity: {
          id: mockPaymentId,
          entity: 'payment',
          amount: 120000,
          currency: 'INR',
          status: 'captured',
          order_id: mockOrderId,
          invoice_id: null,
          international: false,
          method: 'upi',
          amount_refunded: 0,
          refund_status: null,
          captured: true,
          description: 'Registration Sync Test',
          card_id: null,
          bank: null,
          wallet: null,
          vpa: 'success@upi',
          email: 'test-leader-webhook@example.com',
          contact: '+919999999999',
          notes: [],
          fee: 24,
          tax: 4,
          error_code: null,
          error_description: null,
          error_source: null,
          error_step: null,
          error_reason: null,
          created_at: Math.floor(Date.now() / 1000)
        }
      }
    },
    created_at: Math.floor(Date.now() / 1000)
  };

  const rawBody = JSON.stringify(webhookBody);

  // 3. Generate HMAC SHA256 signature using the webhook secret
  const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');

  console.log('\n📮 Submitting Webhook POST request to XAMPP PHP Receiver...');
  console.log(`  - URL: ${WEBHOOK_URL}`);
  console.log(`  - Signature: ${signature}`);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Razorpay-Signature': signature
      },
      body: rawBody
    });

    const data = await res.json();
    console.log('\n📥 Response from XAMPP Webhook Receiver:');
    console.log(JSON.stringify(data, null, 2));

    if (res.ok && data.success) {
      console.log('\n⭐ Webhook executed successfully!');
      
      // Let's verify SQLite tables are successfully updated
      console.log('\n🔎 Verifying SQLite Database updates on SUN side...');
      const db = await open({
        filename: dbFile,
        driver: sqlite3.Database
      });

      const updatedPay = await db.get('SELECT * FROM gaming_payment WHERE razorpay_order_id = ?', [mockOrderId]);
      console.log('  - gaming_payment status:', updatedPay.payment_status);
      console.log('  - gaming_payment transaction ID:', updatedPay.razorpay_payment_id);

      const updatedTeam = await db.get('SELECT * FROM gaming_teams WHERE team_id = ?', [testTeamId]);
      console.log('  - gaming_teams status:', updatedTeam.team_registration_status);

      await db.close();

      if (updatedPay.payment_status === 'SUCCESS' && updatedTeam.team_registration_status === 'SUCCESS') {
        console.log('🎉 Webhook processed and SQLite states updated to SUCCESS successfully!');
      } else {
        console.error('❌ Database update mismatch!');
      }

    } else {
      console.error('\n❌ Webhook execution failed!');
    }

  } catch (fetchErr) {
    console.error('\n❌ Failed to execute fetch request to webhook:', fetchErr);
  }
}

runWebhookTest();
