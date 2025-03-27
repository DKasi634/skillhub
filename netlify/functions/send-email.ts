import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL verification
  },
});

const handler: Handler = async (event) => {
  console.log("\n Function called with user email : ", process.env.EMAIL_USER, " \n And pass : ", process.env.EMAIL_PASSWORD)
  try {
    const { tutorEmail, studentEmail, subject, zoomLink } = JSON.parse(event.body || "{}");

    if (!tutorEmail || !studentEmail || !subject || !zoomLink) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }
    // Email details
    const mailOptionsTutor = {
      from: process.env.EMAIL_USER,
      to: tutorEmail,
      subject: `New Tutoring Session Scheduled: ${subject}`,
      text: `Hello, a new tutoring session has been scheduled.\n\nZoom Link: ${zoomLink}`,
    };

    const mailOptionsStudent = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: `Your Tutoring Session Details: ${subject}`,
      text: `Hello, your tutoring session has been scheduled.\n\nZoom Link: ${zoomLink}`,
    };

    // Send emails
    await transporter.sendMail(mailOptionsTutor);
    await transporter.sendMail(mailOptionsStudent);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send emails" }),
    };
  }
};

export { handler };
