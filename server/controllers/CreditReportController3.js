import CreditReport from "../models/CreditReport.js";
import fs from "fs";
import cheerio from "cheerio";
import User from "../models/User.js";
import pdf from "pdf-parse";

// CreditReport controller
export const getCreditReport = async (req, res) => {
  try {
    const items = await CreditReport.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCreditReport = async (req, res) => {
  try {
    const newItem = new CreditReport(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadRecord = async (req, res) => {
  const filePath = req.file.path; // Ensure this path is correct
  const { userId } = req.params;

  // Debugging logs
  console.log("Uploaded file path:", filePath);

  // Check if the file exists before proceeding
  if (!fs.existsSync(filePath)) {
    console.error(`File not found at path: ${filePath}`);
    return res.status(400).json({ message: "File not found" });
  }

  // Check file extension and parse accordingly
  if (
    req.file.mimetype === "text/html" ||
    req.file.originalname.endsWith(".html")
  ) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading HTML file");
      }

      parseHtmlAndStore(data, userId, res);

      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temp file", err);
      });
    });
  } else if (req.file.mimetype === "application/pdf") {
    fs.readFile(filePath, (err, dataBuffer) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading PDF file");
      }

      pdf(dataBuffer)
        .then((data) => {
          const textContent = data.text;
          parsePdfAndStore(textContent, userId, res);

          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp file", err);
          });
        })
        .catch((error) => {
          console.error("Error parsing PDF file: ", error);
          res.status(500).send("Error parsing PDF file");
        });
    });
  } else {
    res.status(400).send("Unsupported file type");
  }
};

const parseHtmlAndStore = async (htmlContent, userId, res) => {
  const $ = cheerio.load(htmlContent);
  let creditReportData = {};

  // Process HTML data similar to the existing code...

  try {
    const document = await CreditReport.findOneAndUpdate(
      { userId: userId },
      { $set: { creditReportData: creditReportData }, $inc: { round: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { creditReport: document._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate("creditReport")
      .select("-password");

    res.status(200).json({ user: user, report: document });
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const parsePdfAndStore = async (textContent, userId, res) => {
  let creditReportData = {};
  const lines = textContent.split("\n");

  let currentSection = null;
  let threeBureauData = {};
  let accountHistory = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.includes("TransUnion Experian Equifax")) {
      currentSection = "threeBureauData";
      return;
    }

    if (trimmedLine.startsWith("Account History")) {
      currentSection = "accountHistory";
      return;
    }

    if (currentSection === "threeBureauData") {
      if (trimmedLine) {
        const [transUnion, experian, equifax] = trimmedLine
          .split(" ")
          .filter(Boolean);
        threeBureauData[transUnion] = { experian, equifax };
      }
    } else if (currentSection === "accountHistory") {
      if (
        trimmedLine.startsWith("FIDELITY SVG") ||
        trimmedLine.startsWith("CALIBER") ||
        trimmedLine.startsWith("BANK OF AMERICA") ||
        trimmedLine.startsWith("GM FINANCIAL") ||
        trimmedLine.startsWith("SYNCB/BMRT") ||
        trimmedLine.startsWith("ALDOUS")
      ) {
        accountHistory.push({ accountName: trimmedLine });
      } else if (trimmedLine) {
        const lastIndex = accountHistory.length - 1;
        if (lastIndex >= 0) {
          if (!accountHistory[lastIndex].details) {
            accountHistory[lastIndex].details = [];
          }
          accountHistory[lastIndex].details.push(trimmedLine);
        }
      }
    }
  });

  creditReportData.threeBureauData = threeBureauData;
  creditReportData.accountHistory = accountHistory;

  try {
    const document = await CreditReport.findOneAndUpdate(
      { userId: userId },
      { $set: { creditReportData: creditReportData }, $inc: { round: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { creditReport: document._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate("creditReport")
      .select("-password");

    res.status(200).json({ user: user, report: document });
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toSnakeCase = (s) => {
  return s.toLowerCase().replace(/\s+/g, "_");
};
