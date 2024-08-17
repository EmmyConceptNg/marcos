import CreditReport from "../models/CreditReport.js";
import fs from "fs";
import cheerio from "cheerio";
import User from "../models/User.js";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import { PDFDocument } from "pdf-lib";
import pdfParse from "pdf-parse-debugging-disabled";
import { parse } from "node-html-parser";
import { parsePdfText } from "./ParsePDF.js";

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


    console.log(pdfBuffer);

    let combinedText = "";

    for (let i = 0; i < numPages; i++) {
      const singlePagePdf = await PDFDocument.create();
      const [page] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(page);
      const singlePagePdfBytes = await singlePagePdf.save();

      console.log(singlePagePdfBytes);

      const form = new FormData();
      form.append("apikey", apiKey);
      form.append("isTable", "true");
      form.append("scale", "true");
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

    const result = combinedText.trim().replace(/\n{3,}/g, "\n\n");
    // console.log("Converted PDF Text:", result); // Log the result for debugging

    return result; // Return the result string directly
  } catch (error) {
    console.error("Error processing text:", error.message);
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
