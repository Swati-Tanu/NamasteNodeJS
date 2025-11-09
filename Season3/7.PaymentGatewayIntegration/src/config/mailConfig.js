const nodemailer = require("nodemailer");

// Create reusable transporter using Ethereal
async function createTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "linnie.kunze81@ethereal.email",
      pass: "FxwBBcyXZ3QNqzKJV9",
    },
  });

  return { transporter, testAccount };
}

module.exports = { createTransporter };