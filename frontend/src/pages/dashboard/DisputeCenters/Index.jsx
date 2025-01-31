/* eslint-disable react/prop-types */
import {
  Box,
  Stack,
  Divider,
  Checkbox,
  Typography,
  Grid,
  Fade,
} from "@mui/material";
import { useEffect, useState } from "react";
import Text from "../../../components/Text";
import SearchInput from "../../../components/Search";
import { FilterList } from "@mui/icons-material";
import Button from "../../../components/Button";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../api/axios";
import { notify } from "../../../utils/Index";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import NoBalanceModal from "../../../components/modal/NoBalanceModal";
import { setUser } from "../../../redux/UserReducer";
import LetterModal from "../../../components/modal/LetterModal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function DisputeCenters() {
  const [type, setType] = useState("disputing");
  const user = useSelector((state) => state.user.details);
  const [attacking, setAttacking] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [personalInfo, setPersonalInfo] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({
    disputes: {},
    accounts: {},
    inquiries: { EQF: [], EXP: [], TUC: [] },
    personalInfo: {},
  });
  const [showLoader, setShowLoader] = useState(attacking);
  const [openNoBalance, setOpenNoBalance] = useState(false);

  useEffect(() => {
    setShowLoader(attacking);
    if (!attacking) {
      const timer = setTimeout(() => setShowLoader(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [attacking]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleStartNewRound = async () => {
    if (user?.balance < 2) {
      setOpenNoBalance(true);
      return false;
    }
    try {
      const response = await axios.post("/api/auth/deduct-balance", {
        userId: user._id,
        amount: import.meta.env.VITE_ROUNDS_AMOUNT,
      });
      dispatch(setUser(response.data.user));
      return true;
    } catch (error) {
      notify("Failed to start a new round. Please try again.", "error");
      return false;
    }
  };

  const handleAttackNow = async () => {
    if (!user.ssn) {
      notify("Error: Please update your personal details", "error");
      setTimeout(() => navigate("/dashboard/settings"), 2000);
      return;
    }
    if (!isAnyCheckboxSelected()) {
      notify("Error: No items selected for the attack.", "error");
      return;
    }

    setAttacking(true);
    try {
      // Deduct balance first
      if (!(await handleStartNewRound())) {
        setAttacking(false);
        return;
      }

      const selectedItems = compileSelectedItems();
      console.log("Selected Items Payload:", selectedItems);

      // Perform the attack
      const response = await axios.post("/api/letters", {
        selectedItems,
        userId: user._id,
      });
      dispatch(setUser(response.data.user));

      // Change type to "attacks" after successful completion
      setTimeout(() => setType("attacks"), 1000);
      Swal.fire({
        title: "Success!",
        text: "Attacking Completed.",
        icon: "success",
      });
    } catch (error) {
      console.log("The attack could not be completed.", error);
      Swal.fire({
        title: "Error!",
        text: "The attack could not be completed.",
        icon: "error",
      });
    } finally {
      setAttacking(false);
    }
  };

  const compileSelectedItems = () => {
    const selectedDisputes = filterSelectedItems(
      checkboxStates.disputes,
      "disputes"
    );
    const selectedAccounts = filterSelectedItems(
      checkboxStates.accounts,
      "accounts"
    );
    const selectedPersonalInfo = filterSelectedItems(
      checkboxStates.personalInfo,
      "personalInfo"
    );

    const selectedInquiries = {
      EQF: filterSelectedInquiries("EQF"),
      EXP: filterSelectedInquiries("EXP"),
      TUC: filterSelectedInquiries("TUC"),
    };

    console.log("Selected Inquiries:", selectedInquiries);
    return {
      disputes: selectedDisputes,
      accounts: selectedAccounts,
      inquiries: selectedInquiries,
      personalInfo: selectedPersonalInfo,
    };
  };

  const filterSelectedItems = (items, type) => {
    const selectedItems = [];
    Object.entries(items).forEach(([key, value]) => {
      if (type === "accounts") {
        // For accounts, we need to check each status
        Object.entries(value).forEach(([index, bureaus]) => {
          if (Object.values(bureaus).some(Boolean)) {
            selectedItems.push({ ...value[index], status: key });
          }
        });
      } else {
        // For other types (disputes, personalInfo)
        if (Object.values(value).some(Boolean)) {
          selectedItems.push(value);
        }
      }
    });
    return selectedItems;
  };
  const filterSelectedInquiries = (bureau) => {
    return checkboxStates.inquiries[bureau]
      .map((isSelected, index) => (isSelected ? inquiries[index] : null))
      .filter(Boolean);
  };

  const isAnyCheckboxSelected = () => {
    // Check disputes
    if (
      Object.values(checkboxStates.disputes).some((dispute) =>
        Object.values(dispute).some(Boolean)
      )
    )
      return true;

    // Check accounts
    if (
      Object.values(checkboxStates.accounts).some((accountType) =>
        Object.values(accountType).some((account) =>
          Object.values(account).some(Boolean)
        )
      )
    )
      return true;

    // Check inquiries
    if (
      Object.values(checkboxStates.inquiries).some((bureau) =>
        bureau.some(Boolean)
      )
    )
      return true;

    // Check personalInfo
    if (
      Object.values(checkboxStates.personalInfo).some((info) =>
        Object.values(info).some(Boolean)
      )
    )
      return true;

    return false;
  };

  return (
    <>
      <NoBalanceModal open={openNoBalance} setOpen={setOpenNoBalance} />
      <ToastContainer />
      <Helmet>
        <title>Dispute Center</title>
      </Helmet>
      <Fade in={true} timeout={1000}>
        <Box sx={{ backgroundColor: "transparent" }}>
          <Stack spacing={3} sx={{ overflow: "hidden" }}>
            <TabSelector type={type} setType={setType} attacking={attacking} />
            {type === "disputing" && (
              <>
                <Text fs="24px" fw="550" color="#131C30">
                  Disputes
                </Text>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <SearchInput
                    width="320px"
                    height="50px"
                    placeholder="Search"
                    bgcolor="#fff"
                  />
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ px: 3, backgroundColor: "#fff" }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FilterList />
                    <Text fs="14px" fw="550" color="#475467" sx={{ mb: 0 }}>
                      Filters
                    </Text>
                  </Stack>
                </Stack>
              </>
            )}
            {showLoader && <Loader />}
            {type === "disputing" && (
              <Disputes
                handleAttackNow={handleAttackNow}
                attacking={attacking}
                disputes={disputes}
                accounts={accounts}
                inquiries={inquiries}
                personalInfo={personalInfo}
                checkboxStates={checkboxStates}
                setDisputes={setDisputes}
                setAccounts={setAccounts}
                setInquiries={setInquiries}
                setPersonalInfo={setPersonalInfo}
                setCheckboxStates={setCheckboxStates}
              />
            )}
            {type === "attacks" && (
              <Attacks
                setType={setType}
                user={user}
                handleAttackNow={handleAttackNow}
                attacking={attacking}
                openNoBalance={openNoBalance}
                setOpenNoBalance={setOpenNoBalance}
              />
            )}
          </Stack>
        </Box>
      </Fade>
    </>
  );
}

const TabSelector = ({ type, setType, attacking }) => (
  <Stack direction="row" sx={{ width: { sm: "314px", xs: "100%" } }}>
    <TabButton
      active={type === "disputing"}
      onClick={() => setType("disputing")}
    >
      Disputing
    </TabButton>
    <TabButton
      right={true}
      active={type === "attacks"}
      onClick={() => !attacking && setType("attacks")}
    >
      Attacks
    </TabButton>
  </Stack>
);

const TabButton = ({ active, onClick, children, right = false }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    onClick={onClick}
    sx={{
      width: { sm: "157px", xs: "100%" },
      height: "51px",
      borderTopLeftRadius: right ? "0" : "10px",
      borderBottomLeftRadius: right ? "0" : "10px",
      borderTopRightRadius: right ? "10px" : "0",
      borderBottomRightRadius: right ? "10px" : "0",
      cursor: "pointer",
      border: active ? "1px solid #FF9D43" : "1px solid #CDCDCD",
    }}
  >
    <Text fs="18px" fw="550" color={active ? "#FF9D43" : "#CDCDCD"}>
      {children}
    </Text>
  </Box>
);

const Loader = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      bgcolor: "rgba(0, 0, 0, 0.5)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 9999,
    }}
  >
    <Box
      component="img"
      src="/assets/icons/loader.gif"
      sx={{ width: "70px", height: "70px", borderRadius: "100%" }}
    />
    <Text color="#fff" fs="18px" fw="500" sx={{ mt: 2 }}>
      Disputing... Please Wait...
    </Text>
  </Box>
);

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
        const accountType = [detail.data.EQF, detail.data.EXP, detail.data.TUC];
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

function Disputes({
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

  useEffect(() => {
    if (!user?.creditReport[0]?.creditReportData) return;

    const { negatives, messageState } = identifyNegativeItems(user);
    const accountHistory =
      user?.creditReport[0]?.creditReportData?.account_history || [];
    const categorizedAccounts = queryAccount(user);

    setDisputes(negatives);
    setAccounts(categorizedAccounts);
    setCustomMessages(messageState);

    // Filter inquiries based on account history conditions
    const userInquiries =
      user?.creditReport[0]?.creditReportData?.inquiries || [];
    const filteredInquiries = userInquiries.filter((inquiry) => {
      const creditorName = inquiry.creditor_name;
      console.log("Checking inquiry for creditor:", creditorName);
      return !accountHistory.some((account) => {
        if (account.accountName.toLowerCase() === creditorName.toLowerCase()) {
          console.log("Matching account found:", account.accountName);
          return account.accountDetails.some((detail) => {
            if (detail.label === "Account Status:") {
              console.log("Account Status for", creditorName, ":", detail.data);
              return ["EQF", "EXP", "TUC"].every(
                (bureau) => detail.data[bureau]?.toLowerCase() === "open"
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
  setCheckboxStates(prevState => {
    if (type === "inquiries") {
      return {
        ...prevState,
        [type]: {
          ...prevState[type],
          [bureau]: prevState[type][bureau].map((val, idx) => idx === index ? !val : val)
        }
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
              [bureau]: !prevState[type][status][index][bureau]
            }
          }
        }
      };
    } else {
      return {
        ...prevState,
        [type]: {
          ...prevState[type],
          [index]: {
            ...prevState[type][index],
            [bureau]: !prevState[type][index]?.[bureau]
          }
        }
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
        {/* {accounts.length > 0 && (
          <>
            <Box p={2} bgcolor="#FF9D43" mt={10} mb={5}>
              <Text fs="20px" fw="700" color="#131C30" mb={2}>
                Account History
              </Text>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Checkbox
                onChange={(e) =>
                  handleSelectAllCheckbox("accounts", e.target.checked)
                }
                checked={checkboxStates.accounts?.every(
                  (checkboxes) =>
                    checkboxes.EQF && checkboxes.EXP && checkboxes.TUC
                )}
                sx={{
                  color: "#FF9D43",
                  "&.Mui-checked": {
                    color: "#FF9D43",
                  },
                }}
              />
              <Text fs="20px" fw="550" color="#131C30" mb={2}>
                Select All
              </Text>
              <Checkbox
                onChange={(e) =>
                  handleSelectAllBureauCheckbox(
                    "accounts",
                    e.target.checked,
                    "EQF"
                  )
                }
                checked={checkboxStates.accounts?.every(
                  (checkboxes) => checkboxes.EQF
                )}
                sx={{
                  color: "#FF9D43",
                  "&.Mui-checked": {
                    color: "#FF9D43",
                  },
                }}
              />
              <Text fs="20px" fw="550" color="#131C30" mb={2}>
                Equifax
              </Text>
              <Checkbox
                onChange={(e) =>
                  handleSelectAllBureauCheckbox(
                    "accounts",
                    e.target.checked,
                    "EXP"
                  )
                }
                checked={checkboxStates.accounts?.every(
                  (checkboxes) => checkboxes.EXP
                )}
                sx={{
                  color: "#FF9D43",
                  "&.Mui-checked": {
                    color: "#FF9D43",
                  },
                }}
              />
              <Text fs="20px" fw="550" color="#131C30" mb={2}>
                Experian
              </Text>
              <Checkbox
                onChange={(e) =>
                  handleSelectAllBureauCheckbox(
                    "accounts",
                    e.target.checked,
                    "TUC"
                  )
                }
                checked={checkboxStates.accounts?.every(
                  (checkboxes) => checkboxes.TUC
                )}
                sx={{
                  color: "#FF9D43",
                  "&.Mui-checked": {
                    color: "#FF9D43",
                  },
                }}
              />
              <Text fs="20px" fw="550" color="#131C30" mb={2}>
                TransUnion
              </Text>
            </Stack>
          </>
        )} */}
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

function Attacks({
  setType,
  handleAttackNow,
  attacking,
  openNoBalance,
  setOpenNoBalance,
}) {
  const user = useSelector((state) => state.user.details);

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [letterContent, setLetterContent] = useState("");
  const [letterPath, setLetterPath] = useState("");
  const [openLetterModal, setOpenLetterModal] = useState(false);
  const [letterBureau, setLetterBureau] = useState("");
  const [mailing, setMailing] = useState(false);

  const dispatch = useDispatch();

  const handleDownloadAll = async () => {
    try {
      const response = await axios({
        url: `/api/letters/download-all/${user?._id}`,
        method: "GET",
        responseType: "blob", // Important to handle binary data correctly
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "DisputeLetters.zip"); // You can specify a dynamic name for the zip file
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // It's important to revoke the created object URL to avoid memory leaks
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  const handleMailLetters = () => {
    setMailing(true);

    if (!user.balance || user.balance === 0) {
      setOpenNoBalance(true);
      setMailing(false);
    }

    Swal.fire({
      title: "Mail Letter!!!",
      text: "are ready to mail the letteres!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Mail Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(`/api/letters/mail-out/${user?._id}`)
          .then((response) => {
            dispatch(setUser(response.data.user));
            Swal.fire({
              title: "Mailed!",
              text: "Document mailed successfully.",
              icon: "success",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: error.response.data.error || "An error occured",
              icon: "error",
            });
          })
          .finally(() => {
            setMailing(false);
          });
      }
    });
  };

  const handleViewLetter = async (letterId) => {
    try {
      const { data } = await axios.get(`/api/letters/${letterId}`);
      console.log("API Response:", data);
      setLetterContent(data.content); // Assuming the response data contains the letter content
      setLetterPath(data.letterPath); // Assuming the response data contains the letter path (PDF base64)
      setLetterBureau(data.bureau);
      setSelectedLetter(letterId);
      setOpenLetterModal(true);
    } catch (error) {
      console.error("Error fetching letter content:", error);
    }
  };

  const handleSaveLetter = async (updatedContent) => {
    try {
      await axios
        .put(`/api/letters/${selectedLetter}`, {
          content: updatedContent,
          // pdfContent: updatedPdfContent, // Assuming your API expects this field
          userId: user._id,
        })
        .then((response) => {
          dispatch(setUser(response.data.user));
          setOpenLetterModal(false);
        });
    } catch (error) {
      console.error("Error updating letter content:", error);
    }
  };

  return (
    <>
      {!user?.letters?.letterPaths?.length &&
      user?.creditReport[0]?.round < 2 ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button variant="contained" onClick={() => setType("disputing")}>
            Start new dispute
          </Button>
        </Box>
      ) : (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Text fs="20px" fw="550" color="#131C30">
                Credit report was uploaded
              </Text>
              <Text fs="20px" fw="700" color="#131C30">
                {moment(user.creditReport[0].createdAt)
                  .startOf("day")
                  .fromNow()}
              </Text>
            </Stack>

            <RoundMenu
              setType={setType}
              user={user}
              handleAttackNow={handleAttackNow}
              attacking={attacking}
            />
          </Stack>

          <Box sx={{ boxShadow: "0px 1px 3px #131C30", bgcolor: "#fff", p: 4 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Text fs="20px" fw="550" color="#131C30">
                  Documents have been generated
                </Text>
                <Text fs="20px" fw="700" color="#131C30">
                  {`(${user?.letters?.letterPaths?.length || 0} Attachments)`}
                </Text>
              </Stack>
              <Stack direction="row" spacing={2}>
                {user?.letters?.letterPaths?.map((letterPath, index) => (
                  <Button
                    width="100%"
                    key={index}
                    variant="outlined"
                    onClick={() => handleViewLetter(letterPath._id)}
                    color="#131C30"
                  >
                    View Letter {index + 1} - {letterPath.bureau}
                  </Button>
                ))}
                <Button
                  width="100%"
                  variant="outlined"
                  onClick={handleDownloadAll}
                  color="#131C30"
                >
                  Download All
                </Button>
                <Button
                  loading={mailing}
                  width="100%"
                  variant="contained"
                  onClick={handleMailLetters}
                >
                  Mail Them Out
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
      <NoBalanceModal open={openNoBalance} setOpen={setOpenNoBalance} />

      <LetterModal
        user={user}
        open={openLetterModal}
        setOpen={setOpenLetterModal}
        letterBureau={letterBureau}
        letterContent={letterContent}
        letterPath={letterPath}
        setLetterPath={setLetterPath}
        setLetterContent={setLetterContent}
        handleSaveLetter={handleSaveLetter}
        selectedLetter={selectedLetter}
        setSelectedLetter={setSelectedLetter}
      />
    </>
  );
}

function BureauDetails({
  bureau,
  details,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
  onCustomMessageChange,
  customMessage,
}) {
  const displayDetails = details.map((detail, index) => (
    <Typography
      key={index}
      sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
    >
      {detail}
    </Typography>
  ));

  return (
    <Box display="flex" flexDirection="row" marginBottom={2}>
      <Box
        border="1px solid #FF9D43"
        borderRadius="10px"
        padding={2}
        minWidth="300px"
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Checkbox
              checked={
                checkboxStates?.["disputes"]?.[infoIndex]?.[bureau] || false
              }
              onChange={() => onCheckboxChange("disputes", infoIndex, bureau)}
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <input
              type="text"
              placeholder="Add a custom message"
              value={customMessage || ""}
              onChange={(event) =>
                onCustomMessageChange(infoIndex, event.target.value)
              }
              style={{
                flexGrow: 1,
                padding: "10px",
                marginLeft: "10px",
                borderRadius: "5px",
                background: "#fff",
                border: "1px solid #CDCDCD",
              }}
            />
          </Stack>
          {displayDetails}
        </Stack>
      </Box>
    </Box>
  );
}

function AccountDetails({
  bureau,
  details,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
  onCustomMessageChange,
  customMessage,
  status,
}) {
  const displayDetails = details.map((detail, index) => (
    <Typography
      key={index}
      sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
    >
      {detail}
    </Typography>
  ));

  return (
    <Box display="flex" flexDirection="row" marginBottom={2}>
      <Box
        border="1px solid #FF9D43"
        borderRadius="10px"
        padding={2}
        width="300px"
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Checkbox
              checked={
                !!checkboxStates?.accounts?.[status]?.[infoIndex]?.[bureau]
              }
              onChange={() =>
                onCheckboxChange("accounts", infoIndex, bureau, status)
              }
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <input
              type="text"
              placeholder="Add a custom message"
              value={customMessage || ""}
              onChange={(event) =>
                onCustomMessageChange(infoIndex, event.target.value)
              }
              style={{
                flexGrow: 1,
                padding: "10px",
                marginLeft: "10px",
                borderRadius: "5px",
                border: "1px solid #CDCDCD",
                background: "#fff",
              }}
            />
          </Stack>
          {displayDetails}
        </Stack>
      </Box>
    </Box>
  );
}

function InquiryBox({
  bureau,
  inquiries,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
}) {
  const { creditor_name, data } = inquiries;
  const isChecked = checkboxStates?.inquiries?.[bureau]?.[infoIndex] || false;

  return (
    <Box display="flex" flexDirection="row" marginBottom={2}>
      <Box
        border="1px solid #FF9D43"
        borderRadius="10px"
        padding={2}
        width="300px"
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Checkbox
              checked={
                checkboxStates?.inquiries?.[bureau]?.[infoIndex] || false
              }
              onChange={() => onCheckboxChange("inquiries", infoIndex, bureau)}
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <Box>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
              >
                <span style={{ fontWeight: "bold" }}>{creditor_name}</span> -{" "}
                {bureau}
              </Typography>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
              >
                {data.date_of_enquiry}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function PersonalInfoBox({
  personalInfo,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
}) {
  const { label, data } = personalInfo;

  // Define the labels you want to display
  const displayLabels = [
    "Name:",
    "Name",
    'Also Known As',
    'Also Known As:',
    "Date of Birth:",
    "Date of Birth",
    "Current Address(es):",
    "Current Address",
    "Current Address:",
    'Previous Address',
    'Previous Address:',
    'Previous Address(es):',
  ];

  // Check if the current label should be displayed
  if (!displayLabels.includes(label)) {
    return null; // Return null if the label is not in the display list
  }

  return (
    <>
      {Object.entries(data).map(([bureau, value]) => {
        const isChecked =
          checkboxStates?.personalInfo?.[infoIndex]?.[bureau] || false;

        return (
          <Box key={bureau} display="flex" flexDirection="row" marginBottom={2}>
            <Box
              border="1px solid #FF9D43"
              borderRadius="10px"
              padding={2}
              width="300px"
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Checkbox
                    checked={
                      checkboxStates?.personalInfo?.[infoIndex]?.[bureau] ||
                      false
                    }
                    onChange={() =>
                      onCheckboxChange("personalInfo", infoIndex, bureau)
                    }
                    sx={{
                      color: "#FF9D43",
                      "&.Mui-checked": {
                        color: "#FF9D43",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#475467",
                    }}
                  >
                    {label} -{" "}
                    <span style={{ fontWeight: "bold" }}>{value}</span>
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#475467",
                    }}
                  >
                    {bureau}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function RoundMenu({ user, attacking, setType }) {
  return (
    <>
      {!user?.creditReport[0]?.round > 5 && (
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          loading={attacking}
          onClick={() => setType("disputing")}
        >
          {`Start Round ${user?.creditReport[0]?.round ? user?.creditReport[0]?.round + 1 : 1}`}
        </Button>
      )}
    </>
  );
}
