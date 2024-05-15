import Letters from "../models/Letters.js";
import PDFDocument from "pdfkit";
import fs from "fs";

import OpenAI from "openai";
import User from "../models/User.js";
import archiver from "archiver";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET,
});

const bureaus = ["EQF", "EXP", "TUC"];

// Letters controller
export const getLetters = async (req, res) => {
  // Handle GET request for Letters
  try {
    const items = await Letters.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLetters = async (req, res) => {
  const {
    disputes = [],
    accounts = [],
    inquiries = [],
  } = req.body.selectedItems;
  const { userId } = req.body;

  let letterPaths = [];
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    let completedLetters = 0;
    for (const bureau of bureaus) {
      const filePath = `./public/Dispute_Letter_${bureau}_${userId}.pdf`;
      const writeStream = fs.createWriteStream(filePath);
      const doc = new PDFDocument();
      doc.pipe(writeStream);

      const content = await generateContentForBureau(
        bureau,
        disputes,
        accounts,
        inquiries,
        user
      );
      doc.fontSize(12).text(content).addPage();

      doc.end(); // Finish writing to the PDF

      writeStream.on("finish", async () => {
        console.log(`Dispute letter for ${bureau} saved.`);
        letterPaths.push({ bureau, path: filePath });
         completedLetters++;
        if (completedLetters === bureaus.length) {
          updateDatabaseWithLetterPaths(userId, letterPaths, res);
        }
      });

      writeStream.on("error", (error) => {
        console.error(`Error writing PDF for ${bureau}:`, error);
        res.status(500).json({ error: "Error writing PDF document." });
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error generating letters: " + error.message });
  }
};


async function generateContentForBureau(
  bureau,
  disputes,
  accounts,
  inquiries,
  user
) {
  // Start with the formal letter header using the user's dynamic details
  let content = `
    [Your Name]
    [Your Address]
    [City, State, Zip Code]
    [Email Address]
    [Phone Number]
    [Date]
    
    ${bureau} Bureau
    [Bureau Address]
    [Bureau City, State, Zip Code]
    
    Subject: Dispute of Item on Credit Report
    
    To Whom It May Concern,
    
    I am writing to formally dispute the following information in my credit report that I believe to be inaccurate.
  `;

  // Process each item and append to the content
  const items = [...disputes, ...accounts, ...inquiries];
  for (const item of items) {
    if (item.details && item.details[bureau]) {
      try {
        const itemContent = await generateDisputeLetterContent(
          bureau,
          item,
          user
        );
        content += itemContent + "\n\n";
      } catch (error) {
        console.error(
          `Error generating content for item in bureau ${bureau}:`,
          error
        );
        // Continue to the next item if there's an error with the current one
        continue;
      }
    }
  }

  // Add a professional closing after all disputes are detailed
  content += `
    I am requesting that the item(s) be investigated and corrected as necessary.
    
    Please provide me with the written results of your investigation, as well as an updated copy of my credit report.
    
    Thank you for your attention to this matter.
    
    Sincerely,
    
    [Your Signature (if sending by mail)]
    ${user.fullName}
  `;

  // Replace placeholder user details with actual data
  content = content.replace("[Your Name]", user.fullName);
  content = content.replace("[Your Address]", user.presentAddress);
  content = content.replace(
    "[City, State, Zip Code]",
    `${user.city}, ${user.state} ${user.postalCode}`
  );
  content = content.replace("[Email Address]", user.email);
  content = content.replace("[Phone Number]", user.phone);
  content = content.replace("[Date]", new Date().toLocaleDateString());

  return content;
}


async function generateDisputeLetterContent(bureau, item, user) {
  const prompt = `Create the body of a detailed and formal dispute letter for an item listed on a credit report, customizing the content specifically for the ${bureau} bureau without including headers or user contact information. The dispute is based on the following details:\n\nItem Details: ${JSON.stringify(
    item
  )}\n\n`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
    });

    // Log the entire completion object to inspect its structure
    console.log(`Received completion:`, completion.choices[0].message.content);

    // Assuming the response structure matches the documentation:
    const letterContent = completion.choices[0].message.content.trim();
    return letterContent;
  } catch (error) {
    console.error("Error generating letter content with OpenAI:", error);
    throw new Error(
      `Error generating content for bureau ${bureau}: ${error.message}`
    );
  }
}





async function updateDatabaseWithLetterPaths(userId, letterPaths, res) {
  try {
    // Database update logic
    const update = { $set: { letterPaths } };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await Letters.findOneAndUpdate({ userId }, update, options);
    // If you need to update the User model as well,
    // Don't forget to await the same as above.
    res.status(200).json({ message: "Dispute letters generated and saved successfully." });
  } catch (dbError) {
    console.error("Error updating the database with letter paths:", dbError);
    res.status(500).json({ message: "Error updating the database with letter paths." });
  }
}


export const downloadAllLetters = async (req, res) => {
  const { userId } = req.params; // You might pass this differently, adjust as needed

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  res.attachment(`DisputeLetters_${userId}.zip`);

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.on("end", () => {
    console.log("Archive wrote %d bytes", archive.pointer());
  });

  archive.pipe(res);

  // Add each PDF to the archive
  const letters = await Letters.findOne({ userId });
  if (letters && letters.letterPaths.length > 0) {
    letters.letterPaths.forEach((letter) => {
      archive.file(letter.path, { name: `DisputeLetter_${letter.bureau}.pdf` });
    });
  } else {
    return res.status(404).send({ error: "No letters found for this user." });
  }

  archive.finalize();
};


import nodemailer from "nodemailer";

// ...

export const mailOutLetters = async (req, res) => {
  const { userId, recipientEmail } = req.body; // Fetch these details from the request

  // Set up your SMTP server credentials or API key
  const transporter = nodemailer.createTransport({
    // For example, if using Gmail
    service: "gmail",
    auth: {
      user: process.env.ADMIN_MAIL,
      pass: process.env.ADMIN_MAIL_PASS, // or use OAuth2
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_MAIL,
    to: recipientEmail,
    subject: "Your Dispute Letters",
    text: "Please find attached the dispute letters.",
    attachments: [],
  };

  const letters = await Letters.findOne({ userId });
  if (letters && letters.letterPaths.length > 0) {
    letters.letterPaths.forEach((letter) => {
      mailOptions.attachments.push({
        filename: `DisputeLetter_${letter.bureau}.pdf`,
        path: letter.path,
      });
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res
          .status(500)
          .send({ error: "Error sending email: " + error.message });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send({ message: "Email sent successfully!" });
      }
    });
  } else {
    res.status(404).send({ error: "No letters found for this user." });
  }
};