import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { emailText, emailHtml } from "../utils/emailConfig.js";
dotenv.config({ path: "./.env.local" });

let SENDGRID_API_KEY = "";

if (process.env.NODE_ENV === "development") {
  SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY;
}

if (SENDGRID_API_KEY === "") {
  throw new Error("No SENDGRID_API_KEY found. Add it to your .env.local");
}

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * This is function to send a welcome email to a new user
 * @param {string} email of the user
 * @param {string} name of the user
 * By default, the email is sent from test505@lyton.dev during development
 */
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "test505@lyton.dev",
    templateId: "d-7e26b82cf8624bafa4077b6ed73b52bf",
    dynamicTemplateData: {
      name: name,
    },
  });
  console.log("Email sent");
};

export default sendWelcomeEmail;
