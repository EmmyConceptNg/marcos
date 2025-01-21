export const parsePdfText = (pdfContent) => {
  // Normalize and split the input content
  const lines = pdfContent
    .replace(/\\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Log parsed lines for initial visual inspection
  console.log("Parsed lines:", lines);

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
  let isNextLineVantage = false;
  let vantageCounter = 1;

  lines.forEach((line, index) => {
    // Log the current processing line
    console.log(`Processing line ${index}: ${line}`);

    // Section switching logic using contains check
    if (line.includes("Personal Information")) {
      currentSection = "personal_information";
      isNextLineVantage = false;
      console.log("Switched to section: personal_information");
    } else if (
      line.includes("FICO® Score	+ Back to Top") ||
      line.includes("Credit Score	Back to Top") ||
      line.includes("Your 3B Report & Vantage Scores® 3.0")
    ) {
      currentSection = "credit_score";
      console.log("Switched to section: credit_score");
      if (line.includes("Vantage Scores® 3.0")) {
        isNextLineVantage = true;
      }
    } else if (line.includes("Account History")) {
      currentSection = "account_history";
      isNextLineVantage = false;
      console.log("Switched to section: account_history");
    } else if (line.includes("Inquiries")) {
      currentSection = "inquiries";
      isNextLineVantage = false;
      console.log("Switched to section: inquiries");
    } else if (line.includes("Summary")) {
      currentSection = "summary";
      isNextLineVantage = false;
      console.log("Switched to section: summary");
    } else if (line.includes("Public Information")) {
      currentSection = "public_information";
      isNextLineVantage = false;
      console.log("Switched to section: public_information");
    } else if (line.includes("Creditor Contacts")) {
      currentSection = "creditor_contacts";
      isNextLineVantage = false;
      console.log("Switched to section: creditor_contacts");
    } else if (currentSection) {
      console.log(`In section: ${currentSection}`);

      // Process according to the current section
      switch (currentSection) {
        case "personal_information":
          parsePersonalInformation(line, data[currentSection]);
          break;
        case "credit_score":
          parseCreditScore(line, data, isNextLineVantage, vantageCounter);
          if (
            isNextLineVantage &&
            line.trim().length > 0 &&
            !line.includes(":")
          ) {
            // Only increase counter if dealing with actual Vantage score line
            vantageCounter++;
          }
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
    "Credit Report Date",
    "Name",
    "Also Known As",
    "Former",
    "Date of Birth",
    "Current Address(es)",
    "Current Address",
    "Previous Address(es)",
    "Previous Address",
    "Employers",
    "Employer",
  ];

  fields.forEach((field) => {
    if (line.includes(field)) {
      const parts = line
        .split(field)[1]
        ?.trim()
        .split("\t")
        .map((part) => part.trim()) || ["", "", ""];
      section.push({
        label: field,
        data: {
          TUC: parts[0] ?? "-",
          EXP: parts[1] ?? "-",
          EQF: parts[2] ?? "-",
        },
      });
    }
  });
};

const parseCreditScore = (
  line,
  creditReportData,
  isVantage,
  vantageCounter
) => {
  console.log("credit score line:", line); // Log each line in this section

  const extractData = (line) => {
    // Split at first ':' to separate label part from data part
    const [labelPart, dataPart] = line.split(":");
    // Split the data part by tab character '\t'
    const parts = dataPart.split("\t").map((part) => part.trim());

    // Initialize an iterator for parts
    const iterator = parts[Symbol.iterator]();

    // Get the first non-empty part or fallback to "-"
    const getNextPart = () => {
      for (let part of iterator) {
        if (part) return part;
      }
      return "-";
    };

    return {
      TUC: getNextPart(),
      EXP: getNextPart(),
      EQF: getNextPart(),
    };
  };

  if (isVantage && line.trim().length > 0 && !line.includes(":")) {
    // Handle Vantage score line
    const parts = line.split("\t").map((part) => part.trim());
    creditReportData.credit_score.push({
      label: `Vantage${vantageCounter}`,
      data: {
        TUC: parts[0] ?? "-",
        EXP: parts[1] ?? "-",
        EQF: parts[2] ?? "-",
      },
    });
  } else if (line.startsWith("Credit Score:")) {
    creditReportData.credit_score.push({
      label: "Credit Score:",
      data: extractData(line),
    });
  } else if (line.startsWith("Lender Rank:")) {
    creditReportData.credit_score.push({
      label: "Lender Rank:",
      data: extractData(line),
    });
  } else if (line.startsWith("FICO® Score 8:")) {
    creditReportData.credit_score.push({
      label: "FICO® Score 8:",
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
      label: "", // This should be blank if there's no specific label
      data: {
        TUC: parts[0] ?? "-",
        EXP: parts[1] ?? "-",
        EQF: parts[2] ?? "-",
      },
    });
  }
};

// const parseAccountHistory = (
//   line,
//   section,
//   previousLine,
//   lineBeforePrevious
// ) => {
//   const fields = [
//     "Account #:",
//     "Account Type:",
//     "Account Type - Detail:",
//     "Bureau Code:",
//     "Account Status:",
//     "Monthly Payment:",
//     "Date Opened:",
//     "Balance:",
//     "No. of Months (terms):",
//     "High Credit:",
//     "Credit Limit:",
//     "Past Due:",
//     "Payment Status:",
//     "Last Reported:",
//     "Comments:",
//     "Date Last Active:",
//     "Date of Last Payment:",
//   ];

//   if (line.includes("Account #:")) {
//     const accountName =
//       lineBeforePrevious &&
//       !fields.some((field) => lineBeforePrevious.includes(field))
//         ? lineBeforePrevious.trim()
//         : "Unknown Account";
//     section.push({
//       accountName: accountName,
//       accountDetails: [],
//     });
//   }

//   const currentAccount = section[section.length - 1];

//   fields.forEach((field) => {
//     if (line.includes(field)) {
//       const dataArray = line.split(field)[1]?.trim().split("\t") || [
//         "",
//         "",
//         "",
//       ];
//       currentAccount?.accountDetails?.push({
//         label: field,
//         data: {
//           TUC: dataArray[0]?.trim() || "-",
//           EXP: dataArray[1]?.trim() || "-",
//           EQF: dataArray[2]?.trim() || "-",
//         },
//       });
//     }
//   });
// };

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
    "Creditor Remarks:",
  ];

  if (line.includes("Account #:") || line.includes("Account #")) {
    const accountName =
      lineBeforePrevious &&
      !fields.some((field) => lineBeforePrevious.includes(field))
        ? lineBeforePrevious.trim()
        : "Unknown Account";
    section.push({
      accountName: accountName,
      accountDetails: [],
    });
    console.log("Initialized new account:", accountName);
  }

  const currentAccount = section[section.length - 1];

  if (!currentAccount) {
    console.warn("No current account initialized for line:", line);
    return;
  }

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
      console.log(`Added ${field} to account:`, currentAccount.accountName);
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
  const infoTypes = [
    "Bankruptcy",
    "Tax Lien",
    "Civil Judgment",
    "Legal Item",
    "Garnishment",
    "Fore Closure",
  ];

  const fields = [
    "Type",
    "Status",
    "Date Filed/Reported",
    "Reference#",
    "Closing Date",
    "Court",
    "Liability",
    "Exempt Amount",
    "Asset Amount",
    "Remarks",
    "Date Settled",
    "Date Paid",
  ];

  // Initialize a new entry if the line contains an info type
  if (infoTypes.some((infoType) => line.includes(infoType))) {
    const infoType = infoTypes.find((infoType) => line.includes(infoType));
    if (!section.some((entry) => entry.infoType === infoType)) {
      section.push({
        infoType,
        infoDetails: fields.map((field) => ({
          label: field,
          data: { TUC: "", EXP: "", EQF: "" },
        })),
      });
      console.log("Initialized new public information entry:", infoType);
    }
    return;
  }

  const currentInfo = section[section.length - 1];

  if (!currentInfo) {
    console.warn(
      "No current public information entry initialized for line:",
      line
    );
    return;
  }

  fields.forEach((field) => {
    if (line.includes(field)) {
      console.log('line includes:', field)
      const dataArray = line.split(field)[1]?.trim().split("\t") || [
        "",
        "",
        "",
      ];
      const detail = currentInfo.infoDetails.find(
        (detail) => detail.label === field
      );
      if (detail) {
        detail.data = {
          TUC: dataArray[0]?.trim() || "",
          EXP: dataArray[1]?.trim() || "",
          EQF: dataArray[2]?.trim() || "",
        };
        console.log(
          `Updated ${field} for public information:`,
          currentInfo.infoType
        );
      }
    }
  });
};



const parseCreditorContacts = (line, section) => {
  section.push({ label: "", data: { TUC: line, EXP: "-", EQF: "-" } });
};
