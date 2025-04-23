import { Box, Checkbox, Divider, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Text from "../Text";
import { PersonalInfoBox } from "./PersonalInfoBox";
import { BureauDetails } from "./BureauDetails";
import { InquiryBox } from "./InquiryBox";
import { AccountDetails } from "./AccountDetails";
import Button from "../Button";

export function Disputes({
  handleAttackNow,
  attacking,
  disputes,
  setDisputes,
  inquiries,
  setInquiries,
  personalInfo,
  setPersonalInfo,
  accounts,
  setAccounts,
  checkboxStates,
  setCheckboxStates,
}) {
  const user = useSelector((state) => state.user.details);
  const [customMessages, setCustomMessages] = useState({});

  const queryAccount = (user) => {
    const categorizedAccounts = {
      Chargeoff: [],
      Late: [],
      Collection: [],
      Repossesion: [],
    };

    const accountHistory =
      user?.creditReport[0]?.creditReportData?.account_history || [];

    accountHistory.forEach((account) => {
      const structuredAccountDetails = {
        EQF: {},
        EXP: {},
        TUC: {},
      };

      let paymentStatus = null;
      let statuses = [];

      // First pass: Extract "Payment Status:"
      account.accountDetails.forEach((detail) => {
        if (detail.label === "Payment Status:") {
          statuses = [detail.data.EQF, detail.data.EXP, detail.data.TUC];
          if (
            statuses.some((status) =>
              status.toLowerCase().includes("collection/chargeoff")
            )
          ) {
            paymentStatus = "Chargeoff";
          } else if (
            statuses.some((status) => status.toLowerCase().includes("late"))
          ) {
            paymentStatus = "Late";
          } else if (
            statuses.some((status) =>
              status.toLowerCase().includes("repossesion")
            )
          ) {
            paymentStatus = "Repossesion";
          }
        }
      });

      // Second pass: Process "Account Type:" after statuses have been populated
      account.accountDetails.forEach((detail) => {
        if (detail.label === "Account Type:") {
          const accountType = [
            detail.data.EQF,
            detail.data.EXP,
            detail.data.TUC,
          ];
          console.log("statuses", statuses); // Should now contain the values from previous loop

          if (
            accountType.some((account) =>
              account.toLowerCase().includes("collection")
            ) &&
            statuses.some((status) => status.toLowerCase().includes("late"))
          ) {
            paymentStatus = "Collection";
          }
        }
      });

      // Third pass: Process "Creditor Remarks:" after statuses have been populated
      account.accountDetails.forEach((detail) => {
        if (detail.label === "Creditor Remarks:") {
          const creditorRemarks = [
            detail.data.EQF,
            detail.data.EXP,
            detail.data.TUC,
          ];

          if (
            creditorRemarks.some((remark) =>
              remark.toLowerCase().includes("placed for collection")
            ) &&
            statuses.some((status) =>
              status.toLowerCase().includes("collection/chargeoff")
            )
          ) {
            paymentStatus = "Collection";
          }
        }
      });

      // Collect all account details
      account.accountDetails.forEach((detail) => {
        if (detail.data.EQF)
          structuredAccountDetails.EQF[detail.label] = detail.data.EQF;
        if (detail.data.EXP)
          structuredAccountDetails.EXP[detail.label] = detail.data.EXP;
        if (detail.data.TUC)
          structuredAccountDetails.TUC[detail.label] = detail.data.TUC;
      });

      categorizedAccounts[paymentStatus]?.push({
        accountName: account.accountName,
        details: flattenDetails(structuredAccountDetails),
      });
    });

    return categorizedAccounts;
  };

  const identifyNegativeItems = (user) => {
    const negatives = [];
    const checkBoxState = {};
    const messageState = {};

    // Process public records for negative items
    const publicRecords =
      user?.creditReport[0]?.creditReportData?.public_information || [];
    publicRecords.forEach((record, recordIndex) => {
      // The recordIndex offset ensures unique indexes
      const index = recordIndex;
      // Structure the details by bureau
      const structuredPublicDetails = {
        EQF: {},
        EXP: {},
        TUC: {},
      };

      record.infoDetails.forEach((detail) => {
        if (detail.data.EQF)
          structuredPublicDetails.EQF[detail.label] = detail.data.EQF;
        if (detail.data.EXP)
          structuredPublicDetails.EXP[detail.label] = detail.data.EXP;
        if (detail.data.TUC)
          structuredPublicDetails.TUC[detail.label] = detail.data.TUC;
      });

      // Bankruptcies and Judgments assumed to be inherently negative
      if (
        record.infoType.toLowerCase().includes("bankruptcy") ||
        record.infoType.toLowerCase().includes("judgment") ||
        record.infoType.toLowerCase().includes("tax") ||
        record.infoType.toLowerCase().includes("court")
      ) {
        negatives.push({
          infoType: record.infoType,
          details: flattenDetails(structuredPublicDetails),
        });
        checkBoxState[index] = false; // Initialize checkbox as unchecked
        messageState[index] = ""; // Initialize custom message as empty
      }
    });

    // Return an object containing the negative items and their corresponding initial states
    return { negatives, checkBoxState, messageState };
  };


  function flattenDetails(details) {
    return {
      EQF: Object.entries(details.EQF || {}).map(
        ([label, value]) => `${label}: ${value}`
      ),
      EXP: Object.entries(details.EXP || {}).map(
        ([label, value]) => `${label}: ${value}`
      ),
      TUC: Object.entries(details.TUC || {}).map(
        ([label, value]) => `${label}: ${value}`
      ),
    };
  }


  useEffect(() => {
    if (!user?.creditReport[0]?.creditReportData) return;

    const { negatives, messageState } = identifyNegativeItems(user);
    const accountHistory =
      user?.creditReport[0]?.creditReportData?.account_history || [];
    const categorizedAccounts = queryAccount(user);

    setDisputes(negatives);
    setAccounts(categorizedAccounts);
    setCustomMessages(messageState);

    const cleanCreditorName = (name) =>
      name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Filter inquiries based on account history conditions
    const userInquiries =
      user?.creditReport[0]?.creditReportData?.inquiries || [];

    // Updated inquiry filter logic
    const filteredInquiries = userInquiries.filter((inquiry) => {
      const creditorName = inquiry.creditor_name;
      return !accountHistory.some((account) => {
        const cleanedAccount = cleanCreditorName(account.accountName);
        const cleanedInquiry = cleanCreditorName(creditorName);
        if (
          cleanedAccount
            .replace(/\s/g, "")
            .includes(cleanedInquiry.replace(/\s/g, ""))
        ) {
          return account.accountDetails.some((detail) => {
            if (
              detail.label === "Account Status:" ||
              detail.label === "Account Status"
            ) {
              return ["EQF", "EXP", "TUC"].some(
                (bureau) => detail.data[bureau]?.toLowerCase() == "open"
              );
            }
            return false;
          });
        }
        return false;
      });
    });

    setInquiries(filteredInquiries);

    const userPersonalInfo =
      user.creditReport[0].creditReportData.personal_information || [];
    setPersonalInfo(userPersonalInfo);

    const newCheckboxState = {
      disputes: negatives.reduce((acc, _, index) => {
        acc[index] = { EQF: false, EXP: false, TUC: false };
        return acc;
      }, {}),
      accounts: Object.keys(categorizedAccounts).reduce((acc, status) => {
        acc[status] = categorizedAccounts[status].reduce(
          (statusAcc, _, index) => {
            statusAcc[index] = { EQF: false, EXP: false, TUC: false };
            return statusAcc;
          },
          {}
        );
        return acc;
      }, {}),
      inquiries: {
        EQF: Array(
          filteredInquiries.filter((i) => i.data.credit_bereau === "Equifax")
            .length
        ).fill(false),
        EXP: Array(
          filteredInquiries.filter((i) => i.data.credit_bereau === "Experian")
            .length
        ).fill(false),
        TUC: Array(
          filteredInquiries.filter((i) => i.data.credit_bereau === "TransUnion")
            .length
        ).fill(false),
      },
      personalInfo: userPersonalInfo.reduce((acc, _, index) => {
        acc[index] = { EQF: false, EXP: false, TUC: false };
        return acc;
      }, {}),
    };

    setCheckboxStates(newCheckboxState);

    // setCheckboxStates((prevState) => ({
    //   ...prevState,
    //   ...newCheckboxState,
    // }));

    console.log("Current checkbox states:", checkboxStates);
  }, [user]);

  // Filter out personal info entries that have "-" for all bureaus
  const filteredPersonalInfo = personalInfo.filter((info) =>
    ["EQF", "EXP", "TUC"].some((bureau) => info.data[bureau] !== "-")
  );

  const handleSelectAllCheckbox = (type, checked) => {
    setCheckboxStates((prevState) => {
      const newState = { ...prevState };

      if (
        type === "disputes" ||
        type === "accounts" ||
        type === "personalInfo"
      ) {
        newState[type] = prevState[type].map(() => ({
          EQF: checked,
          EXP: checked,
          TUC: checked,
        }));
      } else if (type === "inquiries") {
        Object.keys(newState.inquiries).forEach((bureau) => {
          newState.inquiries[bureau] = newState.inquiries[bureau].map(
            () => checked
          );
        });
      }

      return newState;
    });
  };

  const handleSelectAllBureauCheckboxInquiries = (checked, bureau) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      inquiries: {
        ...prevState.inquiries,
        [bureau]: prevState.inquiries[bureau].map(() => checked),
      },
    }));
  };

  const handleSelectAllBureauCheckbox = (type, checked, bureau) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [type]: prevState[type].map((checkboxes) => ({
        ...checkboxes,
        [bureau]: checked,
      })),
    }));
  };

  const handleCustomMessageChange = (infoIndex, message) => {
    setCustomMessages((prevState) => ({
      ...prevState,
      [infoIndex]: message,
    }));
  };

  const handleCheckboxChange = (type, index, bureau, status = null) => {
    setCheckboxStates((prevState) => {
      if (type === "inquiries") {
        return {
          ...prevState,
          [type]: {
            ...prevState[type],
            [bureau]: prevState[type][bureau].map((val, idx) =>
              idx === index ? !val : val
            ),
          },
        };
      } else if (type === "accounts" && status) {
        return {
          ...prevState,
          [type]: {
            ...prevState[type],
            [status]: {
              ...prevState[type][status],
              [index]: {
                ...prevState[type][status][index],
                [bureau]: !prevState[type][status][index][bureau],
              },
            },
          },
        };
      } else {
        return {
          ...prevState,
          [type]: {
            ...prevState[type],
            [index]: {
              ...prevState[type][index],
              [bureau]: !prevState[type][index]?.[bureau],
            },
          },
        };
      }
    });
  };

  const bureauInquiries = {
    EQF: inquiries.filter(
      (inquiry) => inquiry.data.credit_bereau === "Equifax"
    ),
    EXP: inquiries.filter(
      (inquiry) => inquiry.data.credit_bereau === "Experian"
    ),
    TUC: inquiries.filter(
      (inquiry) => inquiry.data.credit_bereau === "TransUnion"
    ),
  };

  console.log(bureauInquiries);

  return (
    <Box>
      <ToastContainer />
      <Stack
        direction="column"
        spacing={{ sm: 4, xs: 1 }}
        sx={{ overflow: "hidden", overflowX: "auto" }}
      >
        {filteredPersonalInfo.length > 0 && (
          <>
            <Divider />
            <Box p={2} bgcolor="#FF9D43">
              <Text fs="20px" fw="700" color="#131C30" mb={2}>
                Personal Information
              </Text>
            </Box>
            {filteredPersonalInfo.map((info, infoIndex) => {
              // Check if the info label is one of the specified labels
              const displayLabels = [
                "Name:",
                "Name",
                "Also Known As",
                "Also Known As:",
                "Date of Birth:",
                "Date of Birth",
                "Current Address(es):",
                "Current Address",
                "Current Address:",
                "Previous Address",
                "Previous Address:",
                "Previous Address(es):",
              ];
              if (!displayLabels.includes(info.label)) {
                return null; // Skip rendering if the label is not in the display list
              }

              return (
                <Stack direction="row" spacing={2} key={infoIndex}>
                  <PersonalInfoBox
                    personalInfo={info}
                    infoIndex={infoIndex}
                    onCheckboxChange={handleCheckboxChange}
                    checkboxStates={checkboxStates}
                  />
                </Stack>
              );
            })}
          </>
        )}
      </Stack>

      <Stack
        direction="column"
        spacing={{ sm: 4, xs: 1 }}
        sx={{ overflow: "hidden", overflowX: "auto" }}
      >
        {disputes.length > 0 && (
          <>
            <Divider />

            <Box p={2} bgcolor="#FF9D43" mb={5}>
              <Text fs="20px" fw="700" color="#131C30" mb={2}>
                Public Records
              </Text>
            </Box>
          </>
        )}
        {disputes.map((dispute, infoIndex) => (
          <Box key={infoIndex} sx={{ mb: 4 }}>
            <Text fs="20px" fw="550" color="#131C30" mb={2}>
              {dispute.accountName || dispute.infoType}
            </Text>
            <Stack direction="row" spacing={2}>
              <BureauDetails
                bureau="EQF"
                details={dispute.details.EQF || []} // Ensure details are always an array
                infoIndex={infoIndex}
                onCheckboxChange={handleCheckboxChange}
                checkboxStates={checkboxStates}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
              <BureauDetails
                bureau="EXP"
                details={dispute.details.EXP || []} // Ensure details are always an array
                infoIndex={infoIndex}
                onCheckboxChange={handleCheckboxChange}
                checkboxStates={checkboxStates}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
              <BureauDetails
                bureau="TUC"
                details={dispute.details.TUC || []} // Ensure details are always an array
                infoIndex={infoIndex}
                onCheckboxChange={handleCheckboxChange}
                checkboxStates={checkboxStates}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {bureauInquiries && (
        <>
          <Box p={2} bgcolor="#FF9D43" my={5}>
            <Text fs="20px" fw="700" color="#131C30" mb={2}>
              Inquiries
            </Text>
          </Box>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Checkbox
                onChange={(e) =>
                  handleSelectAllCheckbox("inquiries", e.target.checked)
                }
                checked={Object.keys(checkboxStates.inquiries || {}).every(
                  (bureau) => checkboxStates.inquiries[bureau].every(Boolean)
                )}
                sx={{
                  color: "#FF9D43",
                  "&.Mui-checked": {
                    color: "#FF9D43",
                  },
                }}
              />
              <Text fs="18px" fw="550" color={"#131C30"} sx={{ mb: 2 }}>
                Select All Inquiries
              </Text>

              {Object.keys(bureauInquiries).map((bureau) => (
                <>
                  <Checkbox
                    onChange={(e) =>
                      handleSelectAllBureauCheckboxInquiries(
                        e.target.checked,
                        bureau
                      )
                    }
                    checked={checkboxStates?.inquiries?.[bureau]?.every(
                      Boolean
                    )}
                    sx={{
                      color: "#FF9D43",
                      "&.Mui-checked": {
                        color: "#FF9D43",
                      },
                    }}
                  />
                  <Text fs="18px" fw="550" color="#131C30" mb={2}>
                    {bureau}
                  </Text>
                </>
              ))}
            </Stack>

            {Object.keys(bureauInquiries).map(
              (bureau) =>
                bureauInquiries[bureau]?.length > 0 && (
                  <Grid container key={`grid-${bureau}`}>
                    {bureauInquiries[bureau]
                      .filter((inquiry) =>
                        Object.values(inquiry.data).some((value) => value)
                      ) // Filters empty inquiries
                      .map((inquiry, index) => (
                        <Grid
                          item
                          md={3}
                          sm={6}
                          lg={3}
                          xs={12}
                          key={`${bureau}-${index}`}
                        >
                          <InquiryBox
                            bureau={bureau}
                            inquiries={inquiry}
                            infoIndex={index}
                            onCheckboxChange={handleCheckboxChange}
                            checkboxStates={checkboxStates}
                          />
                        </Grid>
                      ))}
                  </Grid>
                )
            )}
          </Box>
        </>
      )}

      <Stack
        direction="column"
        spacing={{ sm: 4, xs: 1 }}
        sx={{ overflow: "hidden", overflowX: "auto" }}
      >
       
        {Object.entries(accounts).map(
          ([status, accountList]) =>
            accountList.length > 0 && (
              <Stack
                key={status}
                direction="column"
                spacing={4}
                sx={{ overflow: "hidden", overflowX: "auto" }}
              >
                <Box p={2} bgcolor="#FF9D43" mt={10} mb={5}>
                  <Text fs="20px" fw="700" color="#131C30" mb={2}>
                    {status} Accounts
                  </Text>
                </Box>
                {accountList.map((account, infoIndex) => (
                  <Box key={infoIndex} sx={{ mb: 4 }}>
                    <Text fs="20px" fw="550" color="#131C30" mb={2}>
                      {account.accountName || account.infoType}
                    </Text>
                    <Stack direction="row" spacing={2}>
                      {account.details.EQF?.length > 0 && (
                        <AccountDetails
                          bureau="EQF"
                          details={account.details.EQF || []}
                          infoIndex={infoIndex}
                          onCheckboxChange={handleCheckboxChange}
                          checkboxStates={checkboxStates}
                          customMessage={customMessages[infoIndex]}
                          onCustomMessageChange={handleCustomMessageChange}
                          status={status}
                        />
                      )}
                      {account.details.EXP?.length > 0 && (
                        <AccountDetails
                          bureau="EXP"
                          details={account.details.EXP || []}
                          infoIndex={infoIndex}
                          onCheckboxChange={handleCheckboxChange}
                          checkboxStates={checkboxStates}
                          customMessage={customMessages[infoIndex]}
                          onCustomMessageChange={handleCustomMessageChange}
                          status={status}
                        />
                      )}
                      {account.details.TUC?.length > 0 && (
                        <AccountDetails
                          bureau="TUC"
                          details={account.details.TUC || []}
                          infoIndex={infoIndex}
                          onCheckboxChange={handleCheckboxChange}
                          checkboxStates={checkboxStates}
                          customMessage={customMessages[infoIndex]}
                          onCustomMessageChange={handleCustomMessageChange}
                          status={status}
                        />
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )
        )}
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          loading={attacking}
          onClick={handleAttackNow}
        >
          {attacking ? "" : "Start New Round"}
        </Button>
      </Box>
    </Box>
  );
}
