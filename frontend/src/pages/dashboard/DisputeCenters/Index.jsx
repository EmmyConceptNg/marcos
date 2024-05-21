import {
  Box,
  Stack,
  Divider,
  Checkbox,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import Text from "../../../components/Text";
import SearchInput from "../../../components/Search";
import { Add, FilterList } from "@mui/icons-material";
import Button from "../../../components/Button";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../api/axios";
import { notify } from "../../../utils/Index";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import NoBalanceModal from "../../../components/modal/NoBalanceModal";
import { setUser } from "../../../redux/UserReducer";


export default function DisputeCenters() {
  const [type, setType] = useState("disputing");
  const user = useSelector((state) => state.user.details);
  useSelector;

  return (
    <Box>
      <ToastContainer />
      <Helmet>
        <title>Dispute Center</title>
      </Helmet>

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
              setType("attacks");
            }}
            sx={{
              width: { sm: "157px", xs: "100%" },
              height: "51px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              cursor: "pointer",
              border:
                type === "attacks" ? "1px solid #FF9D43" : "1px solid #CDCDCD",
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

            <Stack direction="row" spacing={2} justifyContent="space-between">
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
        {type === "disputing" && <Disputes />}
        {type === "attacks" && <Attacks setType={setType} user={user} />}
      </Stack>
    </Box>
  );
}

const queryAccount = (user) => {
  const negative = [];
  // Process account history for negative items
  const accountHistory =
    user?.creditReport?.creditReportData?.account_history || [];
  accountHistory.forEach((account, accountIndex) => {
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
    if (record.infoType === "Bankruptcy" || record.infoType === "Judgment") {
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

function Disputes() {
  const [attacking, setAttacking] = useState(false)
  const user = useSelector((state) => state.user.details);
  const [disputes, setDisputes] = useState([]);

  const [customMessages, setCustomMessages] = useState({});
  const [inquiries, setInquiries] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [checkboxStates, setCheckboxStates] = useState({});


  const dispatch = useDispatch()

  useEffect(() => {
    const { negatives, checkBoxState, messageState } =
      identifyNegativeItems(user);
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
      inquiries: userInquiries.map(() => false), // Assuming inquiries do not have bureau details
      accounts: queries.map(() => ({
        EQF: false,
        EXP: false,
        TUC: false,
      })),
    };

    setCheckboxStates(newCheckboxState);
  }, [user]);

  const handleSelectAllCheckbox = (type, checked) => {
    setCheckboxStates((prevState) => {
      if (type === "disputes" || type === "accounts") {
        return {
          ...prevState,
          [type]: prevState[type].map((checkboxes) => ({
            EQF: checked,
            EXP: checked,
            TUC: checked,
          })),
        };
      } else if (type === "inquiries") {
        // Assuming inquiries do not have bureau details
        return {
          ...prevState,
          [type]: prevState[type].map(() => checked),
        };
      } else {
        return prevState;
      }
    });
  };

  const handleCustomMessageChange = (infoIndex, message) => {
    setCustomMessages((prevState) => ({
      ...prevState,
      [infoIndex]: message,
    }));
  };

  const handleAttackNow = async () => {
    // Compile the selected disputes, accounts, and inquiries

    setAttacking(true)
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

    const selectedInquiries = inquiries.filter(
      (_, index) => checkboxStates.inquiries[index]
    );

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
      setAttacking(true)
      // Send a POST request to the server endpoint
      const response = await axios.post(endpoint, payload);

      // Handle the response from the server
      console.log(response.data);
      dispatch(setUser(response.data.user));
      notify("Success: Letters have been generated and sent!", "success");

      setAttacking(false)
    } catch (error) {
      console.error("Attack failed:", error);
      notify("Error: The attack could not be completed.", "error");
      setAttacking(false);
    }
  };

  const handleCheckboxChange = (type, index, bureau) => {
    setCheckboxStates((prevState) => {
      if (bureau) {
        return {
          ...prevState,
          [type]: prevState[type].map((item, i) =>
            i === index ? { ...item, [bureau]: !item[bureau] } : item
          ),
        };
      } else {
        // For checkboxes without bureau like inquiries
        return {
          ...prevState,
          [type]: prevState[type].map((checked, i) =>
            i === index ? !checked : checked
          ),
        };
      }
    });
  };

  return (
    <Box>
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
              Public Records
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
                details={dispute.details.EQF}
                infoIndex={infoIndex}
                onCheckboxChange={handleCheckboxChange} // Pass this function
                checkboxStates={checkboxStates}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
              <BureauDetails
                bureau="EXP"
                details={dispute.details.EXP}
                infoIndex={infoIndex}
                onCheckboxChange={handleCheckboxChange} // Pass this function
                checkboxStates={checkboxStates}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
              <BureauDetails
                bureau="TUC"
                details={dispute.details.TUC}
                infoIndex={infoIndex}
                onCheckboxChange={handleCheckboxChange} // Pass this function
                checkboxStates={checkboxStates}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {inquiries.length > 0 && (
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Checkbox
              onChange={(e) =>
                handleSelectAllCheckbox("inquiries", e.target.checked)
              }
              checked={checkboxStates.inquiries.every(Boolean)}
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <Text fs="18px" fw="550" color={"#131C30"} sx={{ mb: 2 }}>
              Inquiries
            </Text>
          </Stack>
          <Grid container>
            {inquiries.map((inquiry, index) => (
              <InquiryBox
                inquiry={inquiry}
                key={index}
                onCheckboxChange={handleCheckboxChange} // Pass this function
                checkboxStates={checkboxStates}
                infoIndex={index}
              />
            ))}
          </Grid>
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
              <Text fs="20px" fw="700" color={"#131C30"} sx={{ my: 2 }}>
                Accounts
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
              {account.details.EQF.length > 0 && (
                <AccountDetails
                  bureau="EQF"
                  details={account.details.EQF}
                  infoIndex={infoIndex}
                  onCheckboxChange={handleCheckboxChange} // Pass this function
                  checkboxStates={checkboxStates}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
              {account.details.EXP.length > 0 && (
                <AccountDetails
                  bureau="EXP"
                  details={account.details.EXP}
                  infoIndex={infoIndex}
                  onCheckboxChange={handleCheckboxChange} // Pass this function
                  checkboxStates={checkboxStates}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
              {account.details.TUC.length > 0 && (
                <AccountDetails
                  bureau="TUC"
                  details={account.details.TUC}
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
        <Button variant="contained" loading={attacking} onClick={()=>handleAttackNow()}>
          {attacking ? '' : 'Attack now'}
        </Button>
      </Box>
    </Box>
  );
}

function Attacks({ setType }) {
  const user = useSelector((state) => state.user.details);
  const [openNoBalance, setOpenNoBalance] = useState(false);

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

  const handleMailLeters = () => {
    if (!user.balance || user.balance === 0) {
      setOpenNoBalance(true);
    }
  };

  return (
    <>
      {!user?.letters?.letterPaths > 0 ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button variant="contained" onClick={() => setType("disputing")}>
            Start new dispute
          </Button>
        </Box>
      ) : (
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Text fs="20px" fw="550" color="#131C30">
              Credit report was uploaded
            </Text>
            <Text fs="20px" fw="700" color="#131C30">
              {moment(user.creditReport.createdAt).startOf("day").fromNow()}
            </Text>
          </Stack>

          <Box
            sx={{ boxShadow: "10px 10px 10px #131C30", bgcolor: "#fff", p: 4 }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Text fs="20px" fw="550" color="#131C30">
                  Documents have been generated
                </Text>
                <Text fs="20px" fw="700" color="#131C30">
                  {`(${user.letters?.letterPaths?.length} Attachments)`}
                </Text>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleDownloadAll}
                  color="#131C30"
                >
                  Download All
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    handleMailLeters();
                  }}
                >
                  Mail Them Out
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
      <NoBalanceModal open={openNoBalance} setOpen={setOpenNoBalance} />
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
  // The details object now contains arrays of strings for each bureau
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
              checked={checkboxStates["disputes"][infoIndex][bureau] || false}
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
  // The details object now contains arrays of strings for each bureau
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
              checked={checkboxStates["accounts"][infoIndex][bureau] || false}
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

function InquiryBox({ inquiry, onCheckboxChange, checkboxStates, infoIndex }) {
  return (
    <Grid item md={4} xs={12}>
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
              justifyContent="flex-start"
              alignItems="center"
            >
              <Checkbox
                checked={checkboxStates["inquiries"][infoIndex] || false}
                onChange={() => onCheckboxChange("inquiries", infoIndex)}
                sx={{
                  color: "#FF9D43",
                  "&.Mui-checked": {
                    color: "#FF9D43",
                  },
                }}
              />
              {inquiry.creditor_name}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
}
