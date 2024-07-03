import CreditReport from "../models/CreditReport.js";
import fs from "fs";
import cheerio from "cheerio";
import User from "../models/User.js";
import pdf from "pdf-parse-debugging-disabled";

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
      cleanUpTempFile(filePath);
    });
  } else if (req.file.mimetype === "application/pdf") {
    try {
      const textContent = await convertPdfToText(filePath);
      if (textContent && textContent.trim().length > 0) {
        parsePdfAndStore(textContent, userId, res);
      } else {
        console.error("Invalid text content extracted from PDF");
        res.status(500).send("Error converting PDF file: Invalid content");
      }
      cleanUpTempFile(filePath);
    } catch (error) {
      console.error("Error converting PDF file", error);
      res.status(500).send("Error converting PDF file");
    }
  } else {
    res.status(400).json({ message: "Unsupported file type" });
  }
};

const convertPdfToText = async (pdfPath) => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
};

const parseHtmlAndStore = async (htmlContent, userId, res) => {
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
      { $set: { creditReportData }, $inc: { round: 1 } },
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
      .select("-password");

    res.status(200).json({ user, report: document });
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const parsePdfAndStore = async (textContent, userId, res) => {
  const lines = textContent.split("\n").map((line) => line.trim());
  let creditReportData = {};

  let currentSection = null;
  let accounts = [];
  let publicInformation = [];
  let inquiries = [];
  let otherSectionData = [];

  lines.forEach((line) => {
    if (line.match(/TransUnion|Experian|Equifax/)) {
      currentSection = "threeBureauData";
      return;
    }

    if (line.startsWith("Account History")) {
      currentSection = "account_history";
      if (!creditReportData.account_history) {
        creditReportData.account_history = [];
      }
      return;
    }

    if (line.startsWith("Public Information")) {
      currentSection = "public_information";
      return;
    }

    if (line.startsWith("Inquiries")) {
      currentSection = "inquiries";
      return;
    }

    if (currentSection === "account_history") {
      handleAccountHistoryPdf(line, accounts);
    } else if (currentSection === "public_information") {
      handlePublicInformationPdf(line, publicInformation);
    } else if (currentSection === "inquiries") {
      handleInquiriesPdf(line, inquiries);
    } else if (currentSection === "threeBureauData") {
      handleThreeBureauDataPdf(line, otherSectionData);
    }
  });

  creditReportData["account_history"] = accounts;
  creditReportData["public_information"] = publicInformation;
  creditReportData["inquiries"] = inquiries;

  try {
    const document = await CreditReport.findOneAndUpdate(
      { userId },
      { $set: { creditReportData }, $inc: { round: 1 } },
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
      .select("-password");

    res.status(200).json({ user, report: document });
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleAccountHistoryPdf = (line, accounts) => {
  if (
    line.startsWith("FIDELITY SVG") ||
    line.startsWith("CALIBER") ||
    line.startsWith("BANK OF AMERICA") ||
    line.startsWith("GM FINANCIAL") ||
    line.startsWith("SYNCB/BMRT") ||
    line.startsWith("ALDOUS")
  ) {
    accounts.push({ accountName: line, details: [] });
  } else if (line) {
    const lastIndex = accounts.length - 1;
    if (lastIndex >= 0) {
      accounts[lastIndex].details.push(line);
    }
  }
};

const handlePublicInformationPdf = (line, publicInformation) => {
  if (!publicInformation.length) publicInformation.push({});
  const infoSection = publicInformation[publicInformation.length - 1];

  if (!infoSection.infoType) {
    infoSection.infoType = line;
  } else {
    if (!infoSection.infoDetails) infoSection.infoDetails = [];
    const [label, tucData, expData, eqfData] = line.split(/\s{2,}/);
    infoSection.infoDetails.push({
      label: label.trim(),
      data: {
        TUC: tucData?.trim(),
        EXP: expData?.trim(),
        EQF: eqfData?.trim(),
      },
    });
  }
};

const handleInquiriesPdf = (line, inquiries) => {
  const [creditorName, typeOfBusiness, dateOfEnquiry, creditBereau] =
    line.split(/\s{2,}/);
  inquiries.push({
    creditor_name: creditorName.trim(),
    data: {
      type_of_business: typeOfBusiness?.trim(),
      date_of_enquiry: dateOfEnquiry?.trim(),
      credit_bureau: creditBereau?.trim(),
    },
  });
};

const handleThreeBureauDataPdf = (line, otherSectionData) => {
  const [label, tucData, expData, eqfData] = line.split(/\s{2,}/);
  otherSectionData.push({
    label: label.trim(),
    data: { TUC: tucData?.trim(), EXP: expData?.trim(), EQF: eqfData?.trim() },
  });
};

const cleanUpTempFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting temp file", err);
  });
};

const toSnakeCase = (s) => s.toLowerCase().replace(/\s+/g, "_");
