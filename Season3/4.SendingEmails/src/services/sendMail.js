const { createTransporter } = require("../config/mailConfig");

// Send email function
async function sendTestEmail(to, subject, text, html) {
  const { transporter, testAccount } = await createTransporter();

  const info = await transporter.sendMail({
    from: `"My App" <abc@mail.com>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
  sendTestEmail,
};
