export const parsePdfText = (pdfContent) => {
  // Normalize and split the input content
  const lines = pdfContent
    .replace(/\\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log("Parsed lines:", lines); // For initial visual inspection

  const data = {
    customer_statement: [],
    personal_information: [],
    credit_score: [],
    summary: [],
    account_history: [],
    inquiries: [],
    public_information: [],
    creditor_contacts: [],
  };

  let currentSection = null;
  let previousLine = null;
  let lineBeforePrevious = null;

  lines.forEach((line, index) => {
    // Log the current processing line
    console.log(`Processing line ${index}: ${line}`);

    // Section switching logic using contains check
    if (line.includes("Personal Information")) {
      currentSection = "personal_information";
      console.log("Switched to section: personal_information");
    } else if (line.includes("Credit Score") && !line.includes(":")) {
      currentSection = "credit_score";
      console.log("Switched to section: credit_score");
    } else if (line.includes("Account History")) {
      currentSection = "account_history";
      console.log("Switched to section: account_history");
    } else if (line.includes("Inquiries")) {
      currentSection = "inquiries";
      console.log("Switched to section: inquiries");
    } else if (line.includes("Summary")) {
      currentSection = "summary";
      console.log("Switched to section: summary");
    } else if (line.includes("Public Information")) {
      currentSection = "public_information";
      console.log("Switched to section: public_information");
    } else if (line.includes("Creditor Contacts")) {
      currentSection = "creditor_contacts";
      console.log("Switched to section: creditor_contacts");
    } else if (currentSection) {
      console.log(`In section: ${currentSection}`);

      // Process according to the current section
      switch (currentSection) {
        case "personal_information":
          parsePersonalInformation(line, data[currentSection]);
          break;
        case "credit_score":
          parseCreditScore(line, data);
          break;
        case "account_history":
          parseAccountHistory(
            line,
            data[currentSection],
            previousLine,
            lineBeforePrevious
          );
          break;
        case "inquiries":
          parseInquiries(line, data[currentSection]);
          break;
        case "summary":
          parseSummary(line, data[currentSection]);
          break;
        case "public_information":
          parsePublicInformation(line, data[currentSection]);
          break;
        case "creditor_contacts":
          parseCreditorContacts(line, data[currentSection]);
          break;
      }
    }

    // Update previous lines
    lineBeforePrevious = previousLine;
    previousLine = line;
  });

  return data;
};

const parsePersonalInformation = (line, section) => {
  const fields = [
    "Credit Report Date:",
    "Name:",
    "Also Known As:",
    "Former:",
    "Date of Birth:",
    "Current Address(es):",
    "Previous Address(es):",
    "Employers:",
  ];
  fields.forEach((field) => {
    if (line.includes(field)) {
      section.push({
        label: field,
        data: { TUC: line.split(field)[1]?.trim() || "", EXP: "-", EQF: "-" },
      });
    }
  });
};

const parseCreditScore = (line, creditReportData) => {
  console.log("credit score line:", line); // Log each line in this section

  const extractData = (line) => {
    const parts = line.split("\t").map((part) => part.trim());
    return {
      TUC: parts[1] ?? "-",
      EXP: parts[2] ?? "-",
      EQF: parts[3] ?? "-",
    };
  };

  if (line.startsWith("Credit Score:")) {
    creditReportData.credit_score.push({
      label: "Credit Score:",
      data: {
        TUC: extractData(line).TUC,
        EXP: extractData(line).EXP,
        EQF: extractData(line).EQF,
      },
    });
  } else if (line.startsWith("Lender Rank:")) {
    creditReportData.credit_score.push({
      label: "Lender Rank:",
      data: {
        TUC: extractData(line).TUC,
        EXP: extractData(line).EXP,
        EQF: extractData(line).EQF,
      },
    });
  } else if (line.startsWith("Score Scale:")) {
    creditReportData.credit_score.push({
      label: "Score Scale:",
      data: {
        TUC: extractData(line).TUC,
        EXP: extractData(line).EXP,
        EQF: extractData(line).EQF,
      },
    });
  } else if (line.startsWith("Risk Factors")) {
    creditReportData.credit_score.push({
      label: "Risk Factors",
      data: {
        TUC: line.split("Risk Factors")[1]?.trim() || "-",
        EXP: "-",
        EQF: "-",
      },
    });
  } else if (
    line.startsWith("TransUnion") &&
    line.includes("Experian") &&
    line.includes("Equifax")
  ) {
    // This is a header line, we will skip it
  } else if (
    line.trim().length > 0 &&
    !line.includes("account") &&
    !line.includes(":")
  ) {
    const parts = line.split("\t").map((part) => part.trim());
    creditReportData.credit_score.push({
      label: "",
      data: {
        TUC: parts[0] ?? "-",
        EXP: parts[1] ?? "-",
        EQF: parts[2] ?? "-",
      },
    });
  }
};

const parseAccountHistory = (
  line,
  section,
  previousLine,
  lineBeforePrevious
) => {
  const fields = [
    "Account #:",
    "Account Type:",
    "Account Type - Detail:",
    "Bureau Code:",
    "Account Status:",
    "Monthly Payment:",
    "Date Opened:",
    "Balance:",
    "No. of Months (terms):",
    "High Credit:",
    "Credit Limit:",
    "Past Due:",
    "Payment Status:",
    "Last Reported:",
    "Comments:",
    "Date Last Active:",
    "Date of Last Payment:",
  ];

  if (line.includes("Account #:")) {
    const accountName =
      lineBeforePrevious &&
      !fields.some((field) => lineBeforePrevious.includes(field))
        ? lineBeforePrevious.trim()
        : "Unknown Account";
    section.push({
      accountName: accountName,
      accountDetails: [],
    });
  }

  const currentAccount = section[section.length - 1];

  fields.forEach((field) => {
    if (line.includes(field)) {
      const dataArray = line.split(field)[1]?.trim().split("\t") || [
        "",
        "",
        "",
      ];
      currentAccount.accountDetails.push({
        label: field,
        data: {
          TUC: dataArray[0]?.trim() || "-",
          EXP: dataArray[1]?.trim() || "-",
          EQF: dataArray[2]?.trim() || "-",
        },
      });
    }
  });
};

const parseInquiries = (line, section) => {
  if (line.includes("Creditor Name")) return;

  const details = line.split("\t").map((detail) => detail.trim());

  // Assuming details should at least contain Creditor Name, Date of Enquiry, and Credit Bureau
  const creditor_name = details[0] || "";
  const type_of_business = details.length === 4 ? details[1] : "-";
  const date_of_enquiry = details.length === 4 ? details[2] : details[1] || "";
  const credit_bereau = details.length === 4 ? details[3] : details[2] || "";

  section.push({
    creditor_name: creditor_name,
    data: {
      type_of_business: type_of_business,
      date_of_enquiry: date_of_enquiry,
      credit_bereau: credit_bereau,
    },
  });
};

const parseSummary = (line, section) => {
  const fields = [
    "Total Accounts:",
    "Open Accounts:",
    "Closed Accounts:",
    "Delinquent:",
    "Derogatory:",
    "Collection:",
    "Balances:",
    "Payments:",
    "Public Records:",
    "Inquiries(2 years):",
  ];
  fields.forEach((field) => {
    if (line.includes(field)) {
      section.push({
        label: field,
        data: {
          TUC: line.trim().split("\t")[1] || "",
          EXP: line.trim().split("\t")[2] || "",
          EQF: line.trim().split("\t")[3] || "",
        },
      });
    }
  });
};

const parsePublicInformation = (line, section) => {
  // Assuming this is where public information parsing logic would go
};

const parseCreditorContacts = (line, section) => {
  section.push({ label: "", data: { TUC: line, EXP: "-", EQF: "-" } });
};
