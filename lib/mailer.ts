import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const user = process.env.EMAIL_USER || "incuxaigaming@gmail.com";
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    console.warn(`⚠️ Mock Email - To: ${to} | Subject: ${subject}`);
    console.log(`Mock HTML: ${html}`);
    return { success: true, message: "Mock email sent" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465 (SSL)
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"IncuXai Gaming Hackathon" <${user}>`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
