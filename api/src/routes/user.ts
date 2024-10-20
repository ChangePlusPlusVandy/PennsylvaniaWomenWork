import express from "express";
import sgMail from "@sendgrid/mail";

const router = express.Router();
const axios = require("axios").default;

router.use(express.json());

router.post("/test", async (req: any, res: any) => {
  console.log("Received group data:")
  const {name} = req.body;

  return res.status(200).json(name)
})

router.post("/send-email", async (req: any, res: any) => {
  try {
    const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY || "";
    const SEND_GRID_TEST_EMAIL = process.env.SEND_GRID_TEST_EMAIL || "";

    if (SENDGRID_API_KEY === "" || SEND_GRID_TEST_EMAIL === "") {
      throw new Error("SendGrid API key or test email is missing");
    }

    const { email, name } = req.body;

    sgMail.setApiKey(SENDGRID_API_KEY);

    await sgMail.send({
      to: email,
      from: SEND_GRID_TEST_EMAIL,
      templateId: "d-7e26b82cf8624bafa4077b6ed73b52bf",
      dynamicTemplateData: {
        name: name,
      },
    });

    return res.status(200).json({ message: "Email successfully sent" });
  } catch (err) {
    return res.status(400).json({ message: "Email sending failed" });
  }
});

export default router;
