import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

import cors from "cors";
import express from "express";

import sql from "./db.js";
import { sendMail } from "./mailer.js";
import { checkMailtrapLimit } from "./mailtrap.js";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("running");
});

app.get("/mail/limits", async (req, res) => {
  const response = await checkMailtrapLimit();
  res.send(response || "Not available");
});

app.get("/ping", async (req, res) => {
  try {
    await sql.query("SELECT * FROM institution WHERE CODE = ?", [
      req.params.institutionCode,
    ]);
    res.send("Yes");
  } catch (err) {
    res.send("No: " + err);
  }
});

app.post("/institutions/:institutionCode/forward", async (req, res) => {
  try {
    const [results] = await sql.query(
      "SELECT * FROM institution WHERE CODE = ?",
      [req.params.institutionCode],
    );

    if (!results?.length) {
      throw new Error(
        "No institution found for code " + req.params.institutionCode,
      );
    }

    const institution = results[0];

    if (!institution.forwardEmail) {
      throw new Error(
        "No forward email found for institution " + req.params.institutionCode,
      );
    }

    await sendMail({
      to: institution.forwardEmail,
      subject: "Forwarded mail from " + institution.domain,
      body: `Someone has contacted you from the website contact form

Full name: ${req.body.name}
Email address: ${req.body.email}
Subject: ${req.body.subject}
Message: ${req.body.message}
      `,
    });

    res.send("Email was sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
