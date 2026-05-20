import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@incuxai.com';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { success: true, message: 'Email mocked (no API key)' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export function getRegistrationEmailHtml(teamName: string, teamId: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #F37254;">Welcome to IncuXAI Gaming Hackathon!</h1>
      <p>Team: <strong>${teamName}</strong></p>
      <p>Team ID: <strong>${teamId}</strong></p>
      <h3>Next Steps:</h3>
      <ul>
        <li>Join our Discord server for updates</li>
        <li>Complete your payment if pending</li>
        <li>Start building your project</li>
      </ul>
      <p style="color: #666;">See you at the hackathon!</p>
    </div>
  `;
}

export function getPaymentSuccessEmailHtml(teamName: string, amount: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #22c55e;">Payment Successful!</h1>
      <p>Team: <strong>${teamName}</strong></p>
      <p>Amount: <strong>₹${amount}</strong></p>
      <p>Your registration is now confirmed.</p>
    </div>
  `;
}

export function getPaymentFailureEmailHtml(teamName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ef4444;">Payment Failed</h1>
      <p>Team: <strong>${teamName}</strong></p>
      <p>Your payment was not successful. Please retry payment to confirm your registration.</p>
    </div>
  `;
}