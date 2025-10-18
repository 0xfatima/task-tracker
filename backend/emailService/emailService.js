const nodemailer = require("nodemailer")
const sendDueDateReminder = async (userEmail, taskTitle, dueDate) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",  // Or use your SMTP provider
      
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
    rejectUnauthorized: false, // <-- This bypasses the SSL check
  },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reminder: Task Due Soon ⏳",
      text: `Hello, your task "${taskTitle}" is due on ${new Date(dueDate).toDateString()}. Please complete it before the deadline.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};


module.exports = sendDueDateReminder