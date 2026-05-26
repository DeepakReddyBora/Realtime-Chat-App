import dotenv from "dotenv";

dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (
  to,
  subject,
  otp
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to,

    subject,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 20px;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
        "
      >
        <h2 style="text-align: center;">
          Verify Your Account
        </h2>

        <p>
          Thank you for signing up.
        </p>

        <p>
          Use the OTP below to verify your account:
        </p>

        <div
          style="
            text-align: center;
            margin: 30px 0;
          "
        >
          <span
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              background: #f3f4f6;
              padding: 15px 25px;
              border-radius: 8px;
              display: inline-block;
            "
          >
            ${otp}
          </span>
        </div>

        <p>
          This OTP will expire in
          <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request this,
          please ignore this email.
        </p>

        <hr />

        <p
          style="
            text-align: center;
            color: gray;
            font-size: 14px;
          "
        >
          Real-Time Chat Application
        </p>
      </div>
    `,
  });
};

export default sendEmail;