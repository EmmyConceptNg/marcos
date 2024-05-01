import CreditReport from "../models/CreditReport.js";
import fs from "fs";
import cheerio from "cheerio";
import User from "../models/User.js";

// CreditReport controller
export const getCreditReport = async (req, res) => {
  // Handle GET request for CreditReport
  try {
    const items = await CreditReport.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCreditReport = async (req, res) => {
  // Handle POST request to create CreditReport
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

      // Parse the HTML data

      parseHtmlAndStore(data, userId, res);

      // Clean up the temp file
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temp file", err);
      });

      // res.send("File processed and data stored in database");
    });
  } else {
    res.status(400).send("Unsupported file type");
  }
};

const parseHtmlAndStore = async (htmlContent, userId, res) => {
  const $ = cheerio.load(htmlContent);
  let creditReportData = {};

  // Iterate over each 'rpt_content_wrapper' class
  $(".rpt_content_wrapper").each((_, wrapper) => {
    // Find the header and its text
    const header = $(wrapper).find(".rpt_fullReport_header");
    let key = header.find("span").first().text().trim();
    if (!key) {
      key = header.text().trim();
    }

    // Skip if no key is found
    if (!key) {
      console.log("No key found for this wrapper, skipping...");
      return;
    }

    key = toSnakeCase(key);

    // Special treatment for 'Account History'
    if (key === "account_history") {
      let accounts = [];

      // Process each sub-header as an account
      $(wrapper)
        .find(".sub_header.ng-binding.ng-scope")
        .each((_, subHeader) => {
          const accountKey = $(subHeader).text().trim();
          const accountData = [];
          const table = $(subHeader).next(
            ".re-even-odd.rpt_content_table.rpt_content_header.rpt_table4column"
          );

          // Process each row of the account's table
          const rows = $(table).find("tr:not(:first-child)");
          rows.each((_, row) => {
            const label = $(row).find("td.label").text().trim();
            const tucData = $(row).find("td").eq(1).text().trim();
            const expData = $(row).find("td").eq(2).text().trim();
            const eqfData = $(row).find("td").eq(3).text().trim();

            accountData.push({
              label: label,
              data: {
                TUC: tucData,
                EXP: expData,
                EQF: eqfData,
              },
            });
          });

          if (accountData.length > 0) {
            accounts.push({
              accountName: toSnakeCase(accountKey),
              accountDetails: accountData,
            });
          }
        });

      // Add the accounts array to the creditReportData object
      creditReportData[key] = accounts;
    } else if (key === "public_information") {
      let information = [];

      // Process each sub-header as an account
      $(wrapper)
        .find(".sub_header")
        .each((_, subHeader) => {
          const accountKey = $(subHeader).text().trim();
          const accountData = [];
          const table = $(subHeader).next(
            ".re-even-odd.rpt_content_table.rpt_content_header.rpt_table4column"
          );

          // Process each row of the account's table
          const rows = $(table).find("tr:not(:first-child)");
          rows.each((_, row) => {
            const label = $(row).find("td.label").text().trim();
            const tucData = $(row).find("td").eq(1).text().trim();
            const expData = $(row).find("td").eq(2).text().trim();
            const eqfData = $(row).find("td").eq(3).text().trim();

            accountData.push({
              label: label,
              data: {
                TUC: tucData,
                EXP: expData,
                EQF: eqfData,
              },
            });
          });

          if (accountData.length > 0) {
            information.push({
              infoType: accountKey,
              infoDetails: accountData,
            });
          }
        });

      // Add the accounts array to the creditReportData object
      creditReportData[key] = information;
    } else if (key === "inquiries") {
      console.log("inquires");

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
              creditor_name: creditor_name,
              data: {
                type_of_business: type_of_business,
                date_of_enquiry: date_of_enquiry,
                credit_bereau: credit_bereau,
              },
            });
          });
        });

      // Add the general section data to creditReportData under the appropriate key
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
              label: label,
              data: {
                TUC: tucData,
                EXP: expData,
                EQF: eqfData,
              },
            });
          });
        });

      // Add the general section data to creditReportData under the appropriate key
      creditReportData[key] = sectionData;
    }
  });

  // Attempt to update the database with the parsed data
  try {
    const document = await CreditReport.findOneAndUpdate(
      { userId: userId },
      { $set: { creditReportData: creditReportData } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update the user with the credit report reference
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { creditReport: document._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate("creditReport")
      .select("-password");

    // Respond to the request with user and document data
    res.status(200).json({ user: user, report: document });
  } catch (error) {
    console.error("Error saving credit report data: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toSnakeCase = (s) => {
  return s.toLowerCase().replace(/\s+/g, "_");
};
