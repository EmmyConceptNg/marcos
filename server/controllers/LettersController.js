import fs from "fs"; // Regular fs import for createWriteStream
import { promises as fsPromises } from "fs"; // Promise-based functions
import Letters from "../models/Letters.js";
import PDFDocument from "pdfkit";
import User from "../models/User.js";
import archiver from "archiver";
import nodemailer from "nodemailer";
import path from "path";
import { PDFDocument as PdfLibDocument, rgb } from "pdf-lib";
import axios from "axios";
import { htmlToText } from "html-to-text";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET,
});

const bureaus = {
  EQF: { name: "Equifax", address: "Equifax Address" },
  EXP: { name: "Experian", address: "Experian Address" },
  TUC: { name: "TransUnion", address: "TransUnion Address" },
};

// Letters controller
export const getLetters = async (req, res) => {
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
    inquiries = {},
  } = req.body.selectedItems;
  const { userId } = req.body;

  let letterPaths = [];

  try {
    const user = await User.findOne({ _id: userId }).populate("documents");
    if (!user) return res.status(404).json({ message: "User not found" });

    for (const bureauCode of Object.keys(bureaus)) {
      const bureau = bureaus[bureauCode];
      const filePath = `./public/Dispute_Letter_${bureau.name}_${userId}.pdf`;

      console.log(`Generating letter for ${bureau.name}`);

      const { htmlContent, imageUrl } = await generateLetterContent(
        bureauCode,
        disputes,
        accounts,
        inquiries[bureauCode],
        user
      );

      await generatePDF(filePath, htmlContent, user.documents, imageUrl);

      letterPaths.push({
        bureau: bureau.name,
        path: filePath,
        content: htmlContent, // Store HTML content
      });

      if (letterPaths.length === Object.keys(bureaus).length) {
        await updateDatabaseWithLetterPathsAndContents(
          userId,
          letterPaths,
          res
        );
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error generating letters: ${error.message}` });
  }
};

async function generateLetterContent(
  bureauCode,
  disputes,
  accounts,
  inquiries,
  user
) {
  const bureau = bureaus[bureauCode];
  const ssnString = user.ssn.toString().padStart(9, "0");
  const last4SSN = ssnString.slice(-4);

  // Original content generation logic
  let content = `Generate a professional credit repair letter with the format below and if possible,
  
  Name: ${user.fullName}
Address: ${user.presentAddress}
DOB: ${user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
Last 4 of SSN: ${last4SSN}
Date: ${new Date().toLocaleDateString()}

Bureau Name: ${bureau.name}
Bureau Address: ${bureau.address}

Dear ${bureau.name},

I have recently conducted an investigation into my credit report and found several items to be inaccurate.

Under 15 U.S. Code 1681e (b) Accuracy of report. Whenever a consumer reporting agency prepares a consumer report, it shall follow reasonable procedures to assure the maximum possible accuracy of the information concerning the individual about whom the report relates.

15 U.S. Code 1681i (5) Treatment of inaccurate or unverifiable information(A). In general, if after any reinvestigation under paragraph (1) of any information disputed by a consumer, an item of the information is found to be inaccurate or incomplete or cannot be verified, the consumer reporting agency shall—(i) promptly delete that item of information from the file of the consumer, or modify that item of information, as appropriate, based on the results of the reinvestigation; and (ii) promptly notify the furnisher of that information that the information has been modified or deleted from the file of the consumer.

Please remove the following items from my credit report, immediately:

Personal Information:
`;

  const personalItems = disputes.filter((item) => item.type === "personal");
  const accountItems = accounts;
  const inquiryItems = inquiries || [];

  // Personal Information
  if (personalItems.length === 0) {
    content += "None\n";
  } else {
    personalItems.forEach((item, index) => {
      content += `${index + 1}. ${
        item.details[bureauCode]
      } - The personal information is incorrect - please remove this from my credit report immediately.\n`;
    });
  }

  content += "\nAccounts:\n";

  // Account Information
  if (accountItems.length === 0) {
    content += "None\n";
  } else {
    accountItems.forEach((item, index) => {
      content += `${index + 1}. ${
        item.accountName
      } - This account is being reported inaccurately, please remove this from my credit report immediately.\n`;
    });
  }

  content += "\nInquiries:\n";

  // Inquiry Information
  if (inquiryItems.length === 0) {
    content += "None\n";
  } else {
    inquiryItems.forEach((item, index) => {
      content += `${index + 1}. ${item.creditor_name} - ${
        item.data.date_of_enquiry
      } - This inquiry was not authorized, please remove it from my credit report immediately.\n`;
    });
  }

  content += `
Thank you for your prompt attention to this matter.

Sincerely,
${user.fullName}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "user", content: content },
      ],
      max_tokens: 1024,
    });

    const letterContent = completion.choices[0].message.content.trim();

    // const imageResponse = await openai.images.generate({
    //   model: "dall-e-3",
    //   prompt: `Generate a tabular report credit report showing the 3 credit bureaus and fill in the  ${personalItems}, ${accountItems} and ${inquiryItems}. Please fill in the actual values and let it look like a professional credit report not just a random image`,
    // });

    // // Assuming the first image in the response
    // const imageUrl = imageResponse.data[0].url;
    const imageUrl = null;

    const htmlContent = convertToHtml(letterContent);
    return { htmlContent, imageUrl };
  } catch (error) {
    console.error("Error generating letter content with OpenAI:", error);
    throw new Error(
      `Error generating content for bureau ${bureau}: ${error.message}`
    );
  }
}

async function updateDatabaseWithLetterPathsAndContents(
  userId,
  letterPaths,
  res
) {
  try {
    const update = { $set: { letterPaths } }; // Add letterContents here
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const letters = await Letters.findOneAndUpdate({ userId }, update, options);

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { letters: letters._id },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate("creditReport")
      .populate("letters")
      .populate("documents")
      .select("-password");

    res.status(200).json({
      user,
      message: "Dispute letters generated and saved successfully.",
    });
  } catch (dbError) {
    console.error("Error updating the database with letter paths:", dbError);
    res
      .status(500)
      .json({ error: "Error updating the database with letter paths." });
  }
}

export const downloadAllLetters = async (req, res) => {
  const { userId } = req.params;

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
export const getLetterById = async (req, res) => {
  const { letterId } = req.params;

  try {
    const letter = await Letters.findOne({ "letterPaths._id": letterId });
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    const letterPath = letter.letterPaths.id(letterId);
    const content = letterPath.content;
    const filePath = letterPath.path;

    
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfBase64 = pdfBuffer.toString("base64");

    res.json({
      letterPath: pdfBase64,
      content,
      bureau: letterPath.bureau,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLetterById = async (req, res) => {
  const { letterId } = req.params;
  const { content, userId } = req.body;

  try {
    const letter = await Letters.findOne({ "letterPaths._id": letterId });
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }


    const _user = await User.findOne({_id : userId}).populate('documents');

    if(!_user){
      return res.status(404).json({ message: "User not found" });
    }


    

    const letterPath = letter.letterPaths.id(letterId);
    const fullPath = path.resolve(letterPath.path);

    // Generate a new PDF with the updated HTML content
    await generatePDF(fullPath, content, _user?.documents);

    letterPath.content = content;
    await letter.save();

const user = await User.findOne({ _id: userId })
  .populate("subscriptionPlan")
  .populate("creditReport")
  .populate("documents")
  .populate("letters");

    res.json({ user, message: "Letter updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New function to generate PDF
async function generatePDF(filePath, htmlContent, documents, imageUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      const pdfDoc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      pdfDoc.pipe(stream);

      const textContent = htmlToText(htmlContent, {
        wordwrap: 130,
      });

      pdfDoc.font("Times-Roman").fontSize(12).text(textContent, 100, 100);

      if (imageUrl) {
        try {
          // Fetch the image
          const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });

          const image = response.data;
          const extension = path.extname(imageUrl).toLowerCase();
          const imageType =
            extension === ".jpg" || extension === ".jpeg" ? "JPEG" : "PNG";

          pdfDoc.addPage();
          pdfDoc.image(image, {
            fit: [500, 400],
            align: "center",
            valign: "center",
          });
        } catch (imgError) {
          console.error(`Error fetching image:`, imgError);
        }
      }

      if (documents && documents.length > 0) {
        for (const doc of documents) {
          try {
            // Extract the correct path from the URL
            const imageUrl = doc.path;

            // Fetch the image
            const response = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });

            // Embed the image into the PDF
            const image = response.data;
            const extension = path.extname(imageUrl).toLowerCase();
            const imageType =
              extension === ".jpg" || extension === ".jpeg" ? "JPEG" : "PNG";

            pdfDoc.addPage();
            pdfDoc.image(image, {
              fit: [500, 400],
              align: "center",
              valign: "center",
            });
          } catch (docError) {
            console.error(`Error processing document ${doc.path}:`, docError);
            continue;
          }
        }
      }

      pdfDoc.end();

      stream.on("finish", () => {
        console.log("PDF generation finished.");
        resolve();
      });

      stream.on("error", (error) => {
        console.error("Error writing PDF to file:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}









// Function to fetch image as bytes
const fetchImageAsBytes = async (imageUrl) => {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return response.data;
};

// Function to determine the image format
const isPng = (buffer) => {
  // Check the first 8 bytes for PNG signature
  return buffer
    .slice(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
};

// Update letter content by ID
export const notarizeLetter = async (req, res) => {
  const { letterId } = req.params;
  const { userId } = req.body;

  try {
    // Fetch the existing letter from the database
    const letter = await Letters.findOne({ "letterPaths._id": letterId });
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    // Find the specific letter path entry by ID
    const letterPathEntry = letter.letterPaths.id(letterId);
    if (!letterPathEntry) {
      return res.status(404).json({ message: "Letter path entry not found" });
    }

    // Fetch the user data including signature
    const user = await User.findById(userId)
      .populate("subscriptionPlan")
      .populate("creditReport")
      .populate("letters");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { signaturePath } = user; // Assuming the user's signature path is stored in user.signaturePath
    const content = letterPathEntry.content;

    // Create a new PDF with the updated content
    const plainTextContent = convertToPlainText(content);
    const pdfDoc = await PdfLibDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    page.drawText(plainTextContent, {
      x: 50,
      y: height - 50,
      size: 12,
      color: rgb(0, 0, 0),
    });

    if (signaturePath) {
      const signatureImageBytes = await fetchImageAsBytes(signaturePath);
      let signatureImage;
      if (isPng(signatureImageBytes)) {
        signatureImage = await pdfDoc.embedPng(signatureImageBytes);
      } else {
        signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
      }
      const signatureDims = signatureImage.scale(0.1); // Scale the signature image to a smaller size

      // Calculate x position for the right alignment
      // const x = width - signatureDims.width - 50; // 50 units padding from the right edge

      // Draw the signature image on the page at the specified coordinates
      page.drawImage(signatureImage, {
        x: 50,
        y: 50, // Adjust the position based on page layout
        width: signatureDims.width,
        height: signatureDims.height,
      });
    }

    // Save the new PDF to a temporary file
    const newPdfBytes = await pdfDoc.save();
    const newPdfPath = `./public/Dispute_Letter_${letterPathEntry.bureau}_${letterId}_temp.pdf`;
    fs.writeFileSync(newPdfPath, newPdfBytes);

    // Only delete the existing PDF if the new PDF was successfully created
    const existingPdfPath = path.resolve(letterPathEntry.path);
    if (fs.existsSync(existingPdfPath)) {
      fs.unlinkSync(existingPdfPath);
    }

    // Rename the temporary PDF to the final file path
    const finalPdfPath = `./public/Dispute_Letter_${letterPathEntry.bureau}_${letterId}.pdf`;
    fs.renameSync(newPdfPath, finalPdfPath);

    // Update the letter content and the PDF path in the database
    letterPathEntry.content = content;
    letterPathEntry.path = finalPdfPath;

    // Save the updated letter back to the database
    await letter.save();

    res.json({
      message: "Letter content and PDF updated successfully",
      content: content,
      pdfPath: finalPdfPath,
      user,
    });
  } catch (error) {
    console.error("Error updating letter content and PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const mailOutLetters = async (req, res) => {
  const { userId, recipientEmail } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_MAIL,
      pass: process.env.ADMIN_MAIL_PASS,
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

// Utility function to convert plain text to HTML content
const convertToHtml = (text) => {
  return text
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");
};

// Utility function to convert HTML content to plain text
const convertToPlainText = (html) => {
  const options = {
    wordwrap: 130,
    selectors: [
      { selector: "p", format: "block" },
      { selector: "br", format: "block" },
    ],
  };
  return htmlToText(html, options);
};

