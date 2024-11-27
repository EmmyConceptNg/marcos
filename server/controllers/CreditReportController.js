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
  const fileName = req.file.originalname;
  const { userId } = req.params;

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found at path: ${filePath}`);
    return res.status(400).json({ message: "File not found" });
  }

  let result;

  try {
    if (
      req.file.mimetype === "text/html" ||
      req.file.originalname.endsWith(".html")
    ) {
      // Read HTML file asynchronously using promises
      const data = await fs.promises.readFile(filePath, "utf8");
      console.log('processing')
      result = await parseHtmlAndStore(data, userId, filePath);
      console.log('done processing')

      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      // cleanUpTempFile(filePath);
      return res.status(200).json(result.data);
    } else if (req.file.mimetype === "application/pdf") {
      // Convert PDF to text and process
      const textContent = await convertPdfToText(filePath);
      if (textContent) {
        result = await parsePdfAndStore(
          textContent,
          userId,
          filePath,
          fileName
        );
      } else {
        console.error("Invalid text content extracted from PDF");
        cleanUpTempFile(filePath);
        return res
          .status(500)
          .send("Error converting PDF file: Invalid content");
      }
      // cleanUpTempFile(filePath);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    cleanUpTempFile(filePath);
    return res.status(500).send("Error processing the uploaded file");
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
      form.append("scale", "true");
      form.append("language", "eng");
      form.append("OCREngine", "2");
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

    let result = combinedText.trim().replace(/\n{3,}/g, "\n\n");

    // Replace incorrect parsing of "fransUnion" with "TransUnion"
    result = result.replace(/fransUnion/g, "TransUnion");
    result = result.replace(/Trans Union/g, "TransUnion");

    // console.log("Converted PDF Text:", result); // Log the result for debugging

    return result; // Return the result string directly
  } catch (error) {
    console.error("Error processing text:", error);
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
    // Create a new credit report instance
    const newDocument = new CreditReport({
      creditReportData,
      filePath,
      round: 1,
      userId,
    });

    // Save the new credit report
    const document = await newDocument.save();

    // Add the new credit report to the user's creditReport array
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { creditReport: document._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "documents",
        options: { sort: { createdAt: -1 } },
      })
      .populate("letters")
      .select("-password");

    return { status: 200, data: { user, report: document } };
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    return { status: 500, message: "Internal server error" };
  }
};

const parsePdfAndStore = async (pdfContent, userId, filePath, fileName) => {
  try {
    const creditReportData = await parsePdfText(pdfContent);
    console.log("storing", userId);

    // Create a new credit report instance
    const newDocument = new CreditReport({
      creditReportData,
      filePath: `${process.env.SERVER_URL}/public/records/${fileName.replace(
        /\\/g,
        "/"
      )}`,
      round: 1, // If you want the round value to start at 1
      userId,
    });

    // Save the new credit report
    const document = await newDocument.save();

    // Add the new credit report to the user's creditReport array
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { creditReport: document._id } }, // Use $push to add to the array
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "documents",
        options: { sort: { createdAt: -1 } },
      })
      .populate("documents")
      .populate("letters")
      .select("-password");

    console.log("done storing to DB");
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


export const downloadCreditReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await CreditReport.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Assuming filePath is a URL
    const fileUrl = report.filePath;

    // Fetch the file from the URL using axios
    const fileResponse = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream", // Stream the file to handle large files efficiently
    });

    // Set the headers for file download
    res.set({
      "Content-Type": fileResponse.headers["content-type"],
      "Content-Disposition": `attachment; filename=${fileUrl.split("/").pop()}`, // Extract filename from URL
    });

    // Pipe the file stream from axios response to the client
    fileResponse.data.pipe(res);
  } catch (error) {
    console.error("Error while downloading report:", error);
    res.status(500).json({ message: "Server error while downloading report" });
  }
};

export default {
  getCreditReport,
  createCreditReport,
  uploadRecord,
};
