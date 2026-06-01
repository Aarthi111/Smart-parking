const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // App Password, not your Gmail password
  },
});

async function sendOTPEmail(toEmail, toName, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Your ParkChennai Verification Code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="font-size:24px;color:#1a1a1a;margin:0">🅿 ParkChennai</h1>
        </div>
        <p style="color:#333;font-size:16px">Hi <strong>${toName}</strong>,</p>
        <p style="color:#555;font-size:15px">Your verification code is:</p>
        <div style="text-align:center;margin:28px 0;">
          <span style="
            font-size:42px;
            font-weight:800;
            letter-spacing:12px;
            color:#f5a623;
            background:#fff8f0;
            padding:16px 28px;
            border-radius:12px;
            border:2px solid #ffe0c2;
            display:inline-block;
          ">${otp}</span>
        </div>
        <p style="color:#888;font-size:13px;text-align:center">
          This code expires in <strong>10 minutes</strong>.<br/>
          Never share this code with anyone.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#bbb;font-size:12px;text-align:center">
          If you didn't create a ParkChennai account, ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
