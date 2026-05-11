import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

import express from "express";
import sql from "./db.js";
import { sendMail } from "./mailer.js";

const app = express();

app.use(express.json());

app.post("institutions/:institutionCode/contact", async (req, res) => {
  try {
    const [results] = sql.query("SELECT * FROM INTITUTION WHERE CODE = ?", [
      req.params.institutionCode,
    ]);

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
      body: `Someone has contacted you from the website form
      Full name: ${req.body.name}
      Email address: ${req.body.email}
      Subject: ${req.body.subject}
      Message: ${req.body.message}
      `,
    });

    res.send("Email was sent successfully");
  } catch (err) {
    console.err(err);
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
