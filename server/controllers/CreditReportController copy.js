import CreditReport from "../models/CreditReport.js";
import fs from "fs";
import cheerio from "cheerio";
import User from "../models/User.js";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import { PDFDocument } from "pdf-lib";
import pdfParse from "pdf-parse-debugging-disabled";

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
  const filePath = req.file.path;
  const { userId } = req.params;

  if (!fs.existsSync(filePath)) {
    console.error(`File not found at path: ${filePath}`);
    return res.status(400).json({ message: "File not found" });
  }

  let result;

  if (
    req.file.mimetype === "text/html" ||
    req.file.originalname.endsWith(".html")
  ) {
    fs.readFile(filePath, "utf8", async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading HTML file");
      }
      result = await parseHtmlAndStore(data, userId, filePath);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      cleanUpTempFile(filePath);
      res.status(200).json(result.data);
    });
  } else if (req.file.mimetype === "application/pdf") {
    try {
      const textContent = await convertPdfToText(filePath);
      if (textContent) {
        result = await parsePdfAndStore(textContent, userId, filePath);
      } else {
        console.error("Invalid text content extracted from PDF");
        return res
          .status(500)
          .send("Error converting PDF file: Invalid content");
      }
      cleanUpTempFile(filePath);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      res.status(200).json(result.data);
    } catch (error) {
      console.error("Error converting PDF file", error);
      return res.status(500).send("Error converting PDF file");
    }
  } else {
    return res.status(400).json({ message: "Unsupported file type" });
  }
};

const convertPdfToText = async (pdfPath) => {
  const apiKey = process.env.OCR_API;

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const numPages = pdfDoc.getPageCount();

    let combinedText = "";

    for (let i = 0; i < numPages; i++) {
      const singlePagePdf = await PDFDocument.create();
      const [page] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(page);
      const singlePagePdfBytes = await singlePagePdf.save();

      const form = new FormData();
      form.append("apikey", apiKey);
      form.append("isTable", "true");
      form.append("language", "eng");
      form.append("file", Buffer.from(singlePagePdfBytes), "page.pdf");

      const { data: ocrResult } = await axios.post(
        "https://apipro1.ocr.space/parse/image",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );

      if (ocrResult.IsErroredOnProcessing) {
        console.error("Error during OCR processing:", ocrResult.ErrorMessage);
        continue;
      }

      combinedText += ocrResult.ParsedResults[0].ParsedText.trim() + "\n\n";
    }

    const result = {
      text: combinedText.trim().replace(/\n{3,}/g, "\n\n"),
    };

    return result;
  } catch (error) {
    console.error("Error during OCR processing:", error.message);
    return null;
  }
};

const parseHtmlAndStore = async (htmlContent, userId, filePath) => {
  const $ = cheerio.load(htmlContent);
  let creditReportData = {};

  $(".rpt_content_wrapper").each((_, wrapper) => {
    const header = $(wrapper).find(".rpt_fullReport_header");
    let key = header.find("span").first().text().trim();
    if (!key) key = header.text().trim();
    if (!key) return;

    key = toSnakeCase(key);

    if (key === "account_history") {
      let accounts = [];
      $(wrapper)
        .find(".sub_header.ng-binding.ng-scope")
        .each((_, subHeader) => {
          const accountKey = $(subHeader).text().trim();
          const accountData = [];
          const table = $(subHeader).next(
            ".re-even-odd.rpt_content_table.rpt_content_header.rpt_table4column"
          );
          const rows = $(table).find("tr:not(:first-child)");
          rows.each((_, row) => {
            const label = $(row).find("td.label").text().trim();
            const tucData = $(row).find("td").eq(1).text().trim();
            const expData = $(row).find("td").eq(2).text().trim();
            const eqfData = $(row).find("td").eq(3).text().trim();
            accountData.push({
              label,
              data: { TUC: tucData, EXP: expData, EQF: eqfData },
            });
          });
          if (accountData.length > 0) {
            accounts.push({
              accountName: toSnakeCase(accountKey),
              accountDetails: accountData,
            });
          }
        });
      creditReportData[key] = accounts;
    } else if (key === "public_information") {
      let information = [];
      $(wrapper)
        .find(".sub_header")
        .each((_, subHeader) => {
          const accountKey = $(subHeader).text().trim();
          const accountData = [];
          const table = $(subHeader).next(
            ".re-even-odd.rpt_content_table.rpt_content_header.rpt_table4column"
          );
          const rows = $(table).find("tr:not(:first-child)");
          rows.each((_, row) => {
            const label = $(row).find("td.label").text().trim();
            const tucData = $(row).find("td").eq(1).text().trim();
            const expData = $(row).find("td").eq(2).text().trim();
            const eqfData = $(row).find("td").eq(3).text().trim();
            accountData.push({
              label,
              data: { TUC: tucData, EXP: expData, EQF: eqfData },
            });
          });
          if (accountData.length > 0) {
            information.push({
              infoType: accountKey,
              infoDetails: accountData,
            });
          }
        });
      creditReportData[key] = information;
    } else if (key === "inquiries") {
      const sectionData = [];
      $(wrapper)
        .find(".rpt_content_table.rpt_content_header")
        .each((_, table) => {
          const rows = $(table).find("tr:not(:first-child)");
          rows.each((_, row) => {
            const creditor_name = $(row).find("td").eq(0).text().trim();
            const type_of_business = $(row).find("td").eq(1).text().trim();
            const date_of_enquiry = $(row).find("td").eq(2).text().trim();
            const credit_bereau = $(row).find("td").eq(3).text().trim();
            sectionData.push({
              creditor_name,
              data: { type_of_business, date_of_enquiry, credit_bereau },
            });
          });
        });
      creditReportData[key] = sectionData;
    } else {
      const sectionData = [];
      $(wrapper)
        .find(".rpt_content_table.rpt_content_header")
        .each((_, table) => {
          const rows = $(table).find("tr:not(:first-child)");
          rows.each((_, row) => {
            const label = $(row).find("td.label").text().trim();
            const tucData = $(row).find("td").eq(1).text().trim();
            const expData = $(row).find("td").eq(2).text().trim();
            const eqfData = $(row).find("td").eq(3).text().trim();
            sectionData.push({
              label,
              data: { TUC: tucData, EXP: expData, EQF: eqfData },
            });
          });
        });
      creditReportData[key] = sectionData;
    }
  });

  try {
    const document = await CreditReport.findOneAndUpdate(
      { userId },
      { $set: { creditReportData }, $inc: { round: 1 }, filePath },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { creditReport: document._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate("creditReport")
      .populate("documents")
      .populate("letters")
      .select("-password");

    return { status: 200, data: { user, report: document } };
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    return { status: 500, message: "Internal server error" };
  }
};

const parsePdfAndStore = async (pdfContent, userId, filePath) => {
  try {
    const creditReportData = parsePdfText(pdfContent);

    const document = await CreditReport.findOneAndUpdate(
      { userId },
      { $set: { creditReportData }, $inc: { round: 1 }, filePath },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { creditReport: document._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate("creditReport")
      .populate("documents")
      .populate("letters")
      .select("-password");

    return { status: 200, data: { user, report: document } };
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    return { status: 500, message: "Internal server error" };
  }
};

const parsePdfText = (pdfContent) => {
  let creditReportData = {
    customer_statement: [],
    personal_information: [],
    credit_score: [],
    summary: [],
    account_history: [],
    inquiries: [],
    public_information: [],
    creditor_contacts: [],
  };

  pdfContent.pages.forEach((page) => {
    const lines = page.text.split("\n");

    let currentSection = "";
    let currentAccount = null;
    let currentAccountName = "";

    lines.forEach((line) => {
      if (line.includes("Personal Information")) {
        currentSection = "personal_information";
      } else if (line.includes("Credit Score")) {
        currentSection = "credit_score";
      } else if (line.includes("Summary")) {
        currentSection = "summary";
      } else if (line.includes("Account History")) {
        currentSection = "account_history";
      } else if (line.includes("Inquiries")) {
        currentSection = "inquiries";
      } else if (line.includes("Public Information")) {
        currentSection = "public_information";
      } else if (line.includes("Creditor Contacts")) {
        currentSection = "creditor_contacts";
      }

      switch (currentSection) {
        case "personal_information":
          parsePersonalInformation(line, creditReportData);
          break;
        case "credit_score":
          parseCreditScore(line, creditReportData);
          break;
        case "summary":
          parseSummary(line, creditReportData);
          break;
        case "account_history":
          if (line.includes("Account Type:")) {
            if (currentAccount) {
              creditReportData.account_history.push(currentAccount);
            }
            currentAccountName = extractAccountName(line);
            currentAccount = {
              accountName: currentAccountName,
              accountDetails: [],
            };
          } else if (currentAccount) {
            currentAccount.accountDetails.push({
              label: extractLabel(line),
              data: extractData(line),
            });
          }
          break;
        case "inquiries":
          parseInquiries(line, creditReportData);
          break;
        case "public_information":
          parsePublicInformation(line, creditReportData);
          break;
        case "creditor_contacts":
          parseCreditorContacts(line, creditReportData);
          break;
      }
    });

    // Push the last account if there is one
    if (currentAccount) {
      creditReportData.account_history.push(currentAccount);
    }
  });

  return creditReportData;
};

const extractData = (line) => {
  const parts = line.split("\t");
  return {
    TUC: parts[1]?.trim() ?? "-",
    EXP: parts[2]?.trim() ?? "-",
    EQF: parts[3]?.trim() ?? "-",
  };
};

const parsePersonalInformation = (line, creditReportData) => {
  if (line.startsWith("Credit Report Date:")) {
    creditReportData.personal_information.push({
      label: "Credit Report Date:",
      data: extractData(line),
    });
  } else if (line.startsWith("Name:")) {
    creditReportData.personal_information.push({
      label: "Name:",
      data: extractData(line),
    });
  } else if (line.startsWith("Also Known As:")) {
    creditReportData.personal_information.push({
      label: "Also Known As:",
      data: extractData(line),
    });
  } else if (line.startsWith("Former:")) {
    creditReportData.personal_information.push({
      label: "Former:",
      data: extractData(line),
    });
  } else if (line.startsWith("Date of Birth:")) {
    creditReportData.personal_information.push({
      label: "Date of Birth:",
      data: extractData(line),
    });
  } else if (line.startsWith("Current Address(es):")) {
    creditReportData.personal_information.push({
      label: "Current Address(es):",
      data: extractData(line),
    });
  } else if (line.startsWith("Previous Address(es):")) {
    creditReportData.personal_information.push({
      label: "Previous Address(es):",
      data: extractData(line),
    });
  } else if (line.startsWith("Employers:")) {
    creditReportData.personal_information.push({
      label: "Employers:",
      data: extractData(line),
    });
  }
};

const parseCreditScore = (line, creditReportData) => {
  if (line.startsWith("Credit Score:")) {
    creditReportData.credit_score.push({
      label: "Credit Score:",
      data: extractData(line),
    });
  } else if (line.startsWith("Lender Rank:")) {
    creditReportData.credit_score.push({
      label: "Lender Rank:",
      data: extractData(line),
    });
  } else if (line.startsWith("Score Scale:")) {
    creditReportData.credit_score.push({
      label: "Score Scale:",
      data: extractData(line),
    });
  } else if (line.startsWith("Risk Factors")) {
    creditReportData.credit_score.push({
      label: "Risk Factors",
      data: extractData(line),
    });
  }
};

const parseSummary = (line, creditReportData) => {
  if (line.startsWith("Total Accounts:")) {
    creditReportData.summary.push({
      label: "Total Accounts:",
      data: extractData(line),
    });
  } else if (line.startsWith("Open Accounts:")) {
    creditReportData.summary.push({
      label: "Open Accounts:",
      data: extractData(line),
    });
  } else if (line.startsWith("Closed Accounts:")) {
    creditReportData.summary.push({
      label: "Closed Accounts:",
      data: extractData(line),
    });
  } else if (line.startsWith("Delinquent:")) {
    creditReportData.summary.push({
      label: "Delinquent:",
      data: extractData(line),
    });
  } else if (line.startsWith("Derogatory:")) {
    creditReportData.summary.push({
      label: "Derogatory:",
      data: extractData(line),
    });
  } else if (line.startsWith("Collection:")) {
    creditReportData.summary.push({
      label: "Collection:",
      data: extractData(line),
    });
  } else if (line.startsWith("Balances:")) {
    creditReportData.summary.push({
      label: "Balances:",
      data: extractData(line),
    });
  } else if (line.startsWith("Payments:")) {
    creditReportData.summary.push({
      label: "Payments:",
      data: extractData(line),
    });
  } else if (line.startsWith("Public Records:")) {
    creditReportData.summary.push({
      label: "Public Records:",
      data: extractData(line),
    });
  } else if (line.startsWith("Inquiries(2 years):")) {
    creditReportData.summary.push({
      label: "Inquiries(2 years):",
      data: extractData(line),
    });
  }
};

const parseInquiries = (line, creditReportData) => {
  const regex = /^(.*?):?\t+\s*(.*?)\t+\s*(.*?)\t+\s*(.*?)$/;
  const match = line.match(regex);
  if (match) {
    creditReportData.inquiries.push({
      creditor_name: match[1],
      data: {
        type_of_business: match[2],
        date_of_enquiry: match[3],
        credit_bureau: match[4],
      },
    });
  }
};

const parsePublicInformation = (line, creditReportData) => {
  if (line.includes("None Reported")) return;

  creditReportData.public_information.push({
    label: extractPublicInformationLabel(line),
    data: extractData(line),
  });
};

const parseCreditorContacts = (line, creditReportData) => {
  creditReportData.creditor_contacts.push({
    label: extractCreditorName(line),
    data: {
      TUC: extractAddress(line),
      EXP: extractPhoneNumber(line),
      EQF: extractAddress(line),
    },
  });
};

// Utility functions to extract specific data points from lines of text

const extractAccountName = (line) => {
  const regex = /Account #:\s*(.*?)\t/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractLabel = (line) => {
  const regex = /^(.*?):/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractCreditorName = (line) => {
  const regex = /^(.*?)\t/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractTypeOfBusiness = (line) => {
  const regex = /\t(.*?)\t/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractDateOfEnquiry = (line) => {
  const regex = /\t(\d{2}\/\d{2}\/\d{4})\t/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractCreditBureau = (line) => {
  const regex = /\t(TransUnion|Experian|Equifax)\t/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractPublicInformationLabel = (line) => {
  const regex = /^(.*?):/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractAddress = (line) => {
  const regex = /\n.*?(\n.*?)\t/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const extractPhoneNumber = (line) => {
  const regex = /(\(\d{3}\)\s\d{3}-\d{4})/;
  const match = line.match(regex);
  return match ? match[1].trim() : "-";
};

const cleanUpTempFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting temp file", err);
  });
};

const toSnakeCase = (s) => s.toLowerCase().replace(/\s+/g, "_");

export default {
  getCreditReport,
  createCreditReport,
  uploadRecord,
};
