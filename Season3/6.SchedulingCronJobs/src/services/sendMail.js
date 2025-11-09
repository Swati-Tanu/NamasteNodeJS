const { createTransporter } = require("../config/mailConfig");

// Send email function
async function sendTestEmail(to, subject, message) {
  const { transporter } = await createTransporter();

  const info = await transporter.sendMail({
    from: `"My App" <abc@mail.com>`,
    to,
    subject,
    text: message,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
  sendTestEmail,
};
