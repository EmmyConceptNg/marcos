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

export default function DisputeCenters() {
  const [type, setType] = useState("disputing");
  const user = useSelector((state) => state.user.details);
  const [attacking, setAttacking] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [showLoader, setShowLoader] = useState(attacking);

  useEffect(() => {
    if (!attacking) {
      const timer = setTimeout(() => setShowLoader(false), 1000); // Wait 1 second before hiding the loader
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true); // Show loader if attacking is true
    }
  }, [attacking]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAttackNow = async () => {
    // Compile the selected disputes, accounts, and inquiries

    // Check if any checkboxes are selected
    if (!user.ssn) {
      notify("Error: Please update your personal details", "error");
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 2000);
      return false;
    }
    if (user?.creditReport?.round > 4) {
      notify("Error: Sorry you've used up your rounds", "error");
      return false;
    }
    if (!isAnyCheckboxSelected()) {
      notify("Error: No items selected for the attack.", "error");
      return false;
    }

    setAttacking(true);
    const selectedDisputes = disputes.filter(
      (_, index) =>
        checkboxStates.disputes[index].EQF ||
        checkboxStates.disputes[index].EXP ||
        checkboxStates.disputes[index].TUC
    );

    const selectedAccounts = accounts.filter(
      (_, index) =>
        checkboxStates.accounts[index].EQF ||
        checkboxStates.accounts[index].EXP ||
        checkboxStates.accounts[index].TUC
    );

    const selectedInquiries = {
      EQF: inquiries.filter(
        (inquiry, index) =>
          inquiry.data.credit_bereau === "Equifax" &&
          checkboxStates?.inquiries?.EQF[index]
      ),
      EXP: inquiries.filter(
        (inquiry, index) =>
          inquiry.data.credit_bereau === "Experian" &&
          checkboxStates?.inquiries?.EXP[index]
      ),
      TUC: inquiries.filter(
        (inquiry, index) =>
          inquiry.data.credit_bereau === "TransUnion" &&
          checkboxStates?.inquiries?.TUC[index]
      ),
    };

    // Combine all selected items into one array
    const selectedItems = {
      disputes: selectedDisputes,
      accounts: selectedAccounts,
      inquiries: selectedInquiries,
    };

    // Set up the endpoint and payload for the POST request
    const endpoint = "/api/letters";
    const payload = {
      selectedItems: selectedItems,
      userId: user._id,
    };

    try {
      setAttacking(true);
      // Send a POST request to the server endpoint
      const response = await axios.post(endpoint, payload);

      // Handle the response from the server
      console.log(response.data);
      dispatch(setUser(response.data.user));
      notify("Success: Letters have been generated and sent!", "success");

      setTimeout(() => {
        setType("attacks");
      }, 3000);

      setAttacking(false);
    } catch (error) {
      console.error("Attack failed:", error);

      notify("Error: The attack could not be completed.", "error");
      setTimeout(() => {
         setAttacking(false);
      }, 3000);
    }
  };

  // Helper function to check if any checkbox is selected
  const isAnyCheckboxSelected = () => {
    return (
      disputes.some((_, index) =>
        ["EQF", "EXP", "TUC"].some(
          (bureau) => checkboxStates.disputes[index][bureau]
        )
      ) ||
      accounts.some((_, index) =>
        ["EQF", "EXP", "TUC"].some(
          (bureau) => checkboxStates.accounts[index][bureau]
        )
      ) ||
      ["EQF", "EXP", "TUC"].some((bureau) =>
        checkboxStates.inquiries[bureau]?.some((checked) => checked)
      )
    );
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>Dispute Center</title>
      </Helmet>

      <Fade in={true} timeout={1000}>
        <Box sx={{  backgroundColor: "transparent" }}>
          <Stack spacing={3} sx={{ overflow: "hidden" }}>
            <Stack direction="row" sx={{ width: { sm: "314px", xs: "100%" } }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={() => {
                  setType("disputing");
                }}
                sx={{
                  width: { sm: "157px", xs: "100%" },
                  height: "51px",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                  cursor: "pointer",
                  border:
                    type === "disputing"
                      ? "1px solid #FF9D43"
                      : "1px solid #CDCDCD",
                }}
              >
                <Text
                  fs="18px"
                  fw="550"
                  color={type === "disputing" ? "#FF9D43" : "#CDCDCD"}
                >
                  Disputing
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={() => {
                  if (!attacking) {
                    setType("attacks");
                  } else {
                    notify("Attacking!!! Please wait...", "info");
                  }
                }}
                sx={{
                  width: { sm: "157px", xs: "100%" },
                  height: "51px",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  cursor: "pointer",
                  border:
                    type === "attacks"
                      ? "1px solid #FF9D43"
                      : "1px solid #CDCDCD",
                }}
              >
                <Text
                  fs="18px"
                  fw="550"
                  color={type === "attacks" ? "#FF9D43" : "#CDCDCD"}
                >
                  Attacks
                </Text>
              </Box>
            </Stack>

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
            {showLoader && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
                  position: "fixed", // Change to fixed to cover the whole page
                  top: 0,
                  left: 0,
                  width: "100%",
                  zIndex: 9999, // Ensure this is the highest zIndex
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/writing.gif"
                  sx={{ width: "200px", height:'200px', borderRadius: "100%" }}
                />
                <Text color="#fff" fs="18px" fw="500" sx={{ mt: 2 }}>
                  Disputing... Please Wait...
                </Text>
              </Box>
            )}

            {type === "disputing" && (
              <Disputes
                handleAttackNow={handleAttackNow}
                setAttacking={setAttacking}
                attacking={attacking}
                disputes={disputes}
                accounts={accounts}
                inquiries={inquiries}
                checkboxStates={checkboxStates}
                setDisputes={setDisputes}
                setAccounts={setAccounts}
                setInquiries={setInquiries}
                setCheckboxStates={setCheckboxStates}
              />
            )}
            {type === "attacks" && (
              <Attacks
                setType={setType}
                user={user}
                handleAttackNow={handleAttackNow}
                attacking={attacking}
              />
            )}
          </Stack>
        </Box>
      </Fade>
    </>
  );
}

const queryAccount = (user) => {
  const negative = [];
  // Process account history for negative items
  const accountHistory =
    user?.creditReport?.creditReportData?.account_history || [];
  accountHistory.forEach((account) => {
    const structuredAccountDetails = {
      EQF: {},
      EXP: {},
      TUC: {},
    };

    let hasNegativeDetails = false;

    account.accountDetails.forEach((detail) => {
      // Check for negative indicators like "Collection" or "Chargeoff" in "Payment Status"
      if (detail.label === "Payment Status:") {
        console.log("payment status ");
        const statuses = [detail.data.EQF, detail.data.EXP, detail.data.TUC];
        if (
          statuses.some(
            (status) =>
              status.toLowerCase().includes("collection/chargeoff") ||
              status.toLowerCase().includes("late")
          )
        ) {
          hasNegativeDetails = true;
        }
      }

      // Aggregate details by bureau
      if (detail.data.EQF)
        structuredAccountDetails.EQF[detail.label] = detail.data.EQF;
      if (detail.data.EXP)
        structuredAccountDetails.EXP[detail.label] = detail.data.EXP;
      if (detail.data.TUC)
        structuredAccountDetails.TUC[detail.label] = detail.data.TUC;
    });

    // If negative details are found, add this account to the negatives array
    if (hasNegativeDetails) {
      negative.push({
        accountName: account.accountName,
        details: flattenDetails(structuredAccountDetails),
      });
    }
  });
  return negative;
};

const identifyNegativeItems = (user) => {
  const negatives = [];
  const checkBoxState = {};
  const messageState = {};

  // Process public records for negative items
  const publicRecords =
    user?.creditReport?.creditReportData?.public_information || [];
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
  accounts,
  setAccounts,
  checkboxStates,
  setCheckboxStates,
}) {
  const user = useSelector((state) => state.user.details);
  const [customMessages, setCustomMessages] = useState({});

  useEffect(() => {
    const { negatives, messageState } = identifyNegativeItems(user);
    const queries = queryAccount(user);

    setDisputes(negatives);
    setAccounts(queries);
    setCustomMessages(messageState);

    const userInquiries = user?.creditReport?.creditReportData?.inquiries || [];

    setInquiries(userInquiries);

    // Initialize states for disputes, inquiries, and accounts separately
    const newCheckboxState = {
      disputes: negatives.map(() => ({
        EQF: false,
        EXP: false,
        TUC: false,
      })),
      accounts: queries.map(() => ({
        EQF: false,
        EXP: false,
        TUC: false,
      })),
      inquiries: {
        EQF: userInquiries
          .filter((inquiry) => inquiry.data.credit_bereau === "Equifax")
          .map(() => false),
        EXP: userInquiries
          .filter((inquiry) => inquiry.data.credit_bereau === "Experian")
          .map(() => false),
        TUC: userInquiries
          .filter((inquiry) => inquiry.data.credit_bereau === "TransUnion")
          .map(() => false),
      },
    };

    setCheckboxStates(newCheckboxState);
  }, [user]);

  const handleSelectAllCheckbox = (type, checked) => {
    setCheckboxStates((prevState) => {
      const newState = { ...prevState };

      if (type === "disputes" || type === "accounts") {
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

  const handleCheckboxChange = (type, index, bureau) => {
    setCheckboxStates((prevState) => {
      let newState = { ...prevState };
      if (type === "inquiries") {
        newState[type][bureau][index] = !newState[type][bureau][index];
      } else {
        newState[type] = prevState[type].map((checkboxes, i) =>
          i === index
            ? { ...checkboxes, [bureau]: !checkboxes[bureau] }
            : checkboxes
        );
      }
      return newState;
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
        {disputes.length > 0 && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Checkbox
              onChange={(e) =>
                handleSelectAllCheckbox("disputes", e.target.checked)
              }
              checked={checkboxStates.disputes?.every(
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
                  "disputes",
                  e.target.checked,
                  "EQF"
                )
              }
              checked={checkboxStates.disputes?.every(
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
                  "disputes",
                  e.target.checked,
                  "EXP"
                )
              }
              checked={checkboxStates.disputes?.every(
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
                  "disputes",
                  e.target.checked,
                  "TUC"
                )
              }
              checked={checkboxStates.disputes?.every(
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
                  checked={checkboxStates?.inquiries?.[bureau]?.every(Boolean)}
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
                  {bureauInquiries[bureau].map((inquiry, index) => (
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
      )}

      <Stack
        direction="column"
        spacing={{ sm: 4, xs: 1 }}
        sx={{ overflow: "hidden", overflowX: "auto" }}
      >
        {accounts.length > 0 && (
          <>
            <Divider />
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
        )}
        {accounts.map((account, infoIndex) => (
          <Box key={infoIndex} sx={{ mb: 4 }}>
            <Text fs="20px" fw="550" color="#131C30" mb={2}>
              {account.accountName || account.infoType}
            </Text>
            <Stack direction="row" spacing={2}>
              {account.details.EQF?.length > 0 && (
                <AccountDetails
                  bureau="EQF"
                  details={account.details.EQF || []} // Ensure details are always an array
                  infoIndex={infoIndex}
                  onCheckboxChange={handleCheckboxChange} // Pass this function
                  checkboxStates={checkboxStates}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
              {account.details.EXP?.length > 0 && (
                <AccountDetails
                  bureau="EXP"
                  details={account.details.EXP || []} // Ensure details are always an array
                  infoIndex={infoIndex}
                  onCheckboxChange={handleCheckboxChange} // Pass this function
                  checkboxStates={checkboxStates}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
              {account.details.TUC?.length > 0 && (
                <AccountDetails
                  bureau="TUC"
                  details={account.details.TUC || []} // Ensure details are always an array
                  infoIndex={infoIndex}
                  onCheckboxChange={handleCheckboxChange} // Pass this function
                  checkboxStates={checkboxStates}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
            </Stack>
          </Box>
        ))}
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

function Attacks({ setType, handleAttackNow, attacking }) {
  const user = useSelector((state) => state.user.details);
  const [openNoBalance, setOpenNoBalance] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [letterContent, setLetterContent] = useState("");
  const [letterPath, setLetterPath] = useState("");
  const [openLetterModal, setOpenLetterModal] = useState(false);
  const [letterBureau, setLetterBureau] = useState("");

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
    if (!user.balance || user.balance === 0) {
      setOpenNoBalance(true);
    }
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
        });

      setOpenLetterModal(false);
    } catch (error) {
      console.error("Error updating letter content:", error);
    }
  };

  return (
    <>
      {!user?.letters?.letterPaths?.length && user?.creditReport?.round < 2 ? (
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
                {moment(user.creditReport.createdAt).startOf("day").fromNow()}
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
                checkboxStates?.["accounts"]?.[infoIndex]?.[bureau] || false
              }
              onChange={() => onCheckboxChange("accounts", infoIndex, bureau)}
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
              checked={isChecked}
              onChange={() => onCheckboxChange("inquiries", infoIndex, bureau)}
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
            >
              {creditor_name} - {data.credit_bereau}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function RoundMenu({ user, attacking, setType }) {
  return (
    <>
      {!user?.creditReport?.round > 5 && (
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          loading={attacking}
          onClick={() => setType("disputing")}
        >
          {`Start Round ${user?.creditReport?.round ? user?.creditReport?.round + 1 : 1}`}
        </Button>
      )}
    </>
  );
}
