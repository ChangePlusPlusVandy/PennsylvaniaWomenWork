import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { emailText, emailHtml } from "../utils/emailConfig.js";
dotenv.config({ path: "./.env.local" });

const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY;

if (SENDGRID_API_KEY === undefined) {
  throw new Error("No SENDGRID_API_KEY found. Add it to your .env.local");
}

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "test505@lyton.dev",
    subject:
      "[Action Required] Account Activation with Pennsylvania Women Work",
    text: emailText(name),
    html: emailHtml(name),
  });
  console.log("Email sent");
};

export default sendWelcomeEmail;
