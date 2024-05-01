import { Box, Stack, Divider, Checkbox, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Text from "../../../components/Text";
import SearchInput from "../../../components/Search";
import { Add, FilterList } from "@mui/icons-material";
import Button from "../../../components/Button";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

export default function DisputeCenters() {
  const [type, setType] = useState("disputing");

  return (
    <Box>
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
        {type === "attacks" && <Attacks setType={setType} />}
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
        console.log('payment status ')
        const statuses = [detail.data.EQF, detail.data.EXP, detail.data.TUC];
        if (statuses.some((status) => status === "Collection/Chargeoff")) {
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
  const publicRecords = user?.creditReport?.creditReportData?.public_information || [];
  publicRecords.forEach((record, recordIndex) => {
    // The recordIndex offset ensures unique indexes
    const index = recordIndex;
    // Structure the details by bureau
    const structuredPublicDetails = {
      EQF: {},
      EXP: {},
      TUC: {}
    };

    record.infoDetails.forEach((detail) => {
      if (detail.data.EQF) structuredPublicDetails.EQF[detail.label] = detail.data.EQF;
      if (detail.data.EXP) structuredPublicDetails.EXP[detail.label] = detail.data.EXP;
      if (detail.data.TUC) structuredPublicDetails.TUC[detail.label] = detail.data.TUC;
    });

    // Bankruptcies and Judgments assumed to be inherently negative
    if (record.infoType === "Bankruptcy" || record.infoType === "Judgment" ) {
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
   const user = useSelector((state) => state.user.details);
   const [disputes, setDisputes] = useState([]);
   const [checkedItems, setCheckedItems] = useState({});
   const [customMessages, setCustomMessages] = useState({});
   const [inquiries, setInquiries] = useState([]);
   const [accounts, setAccounts] = useState([])
   

   useEffect(() => {
     const { negatives, checkBoxState, messageState } =
       identifyNegativeItems(user);
       const query = queryAccount(user);
       setAccounts(query)
     setDisputes(negatives);
     setCheckedItems(checkBoxState);
     setCustomMessages(messageState);
     const userInquiries = user?.creditReport?.creditReportData?.inquiries;
     setInquiries(userInquiries)
   }, [user]);

   const handleCheckboxChange = (infoIndex) => {
     setCheckedItems((prevState) => ({
       ...prevState,
       [infoIndex]: !prevState[infoIndex],
     }));
   };

   const handleCustomMessageChange = (infoIndex, message) => {
     setCustomMessages((prevState) => ({
       ...prevState,
       [infoIndex]: message,
     }));
   };

  const handleAttackNow = () => {
    const selectedDisputes = disputes.filter((_, index) => checkedItems[index]);
    const disputesWithMessages = selectedDisputes.map((dispute, index) => ({
      ...dispute,
      customMessage: customMessages[index],
    }));
    console.log("Disputes to submit:", disputesWithMessages);
    // Here, you would handle submission, like an API call
  };

  return (
    <Box>
      <Stack
        direction="column"
        spacing={{ sm: 4, xs: 1 }}
        sx={{ overflow: "hidden", overflowX: "auto" }}
      >
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
                isChecked={checkedItems[infoIndex]}
                onCheckboxChange={handleCheckboxChange}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
              <BureauDetails
                bureau="EXP"
                details={dispute.details.EXP}
                infoIndex={infoIndex}
                isChecked={checkedItems[infoIndex]}
                onCheckboxChange={handleCheckboxChange}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
              <BureauDetails
                bureau="TUC"
                details={dispute.details.TUC}
                infoIndex={infoIndex}
                isChecked={checkedItems[infoIndex]}
                onCheckboxChange={handleCheckboxChange}
                customMessage={customMessages[infoIndex]}
                onCustomMessageChange={handleCustomMessageChange}
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {inquiries.length > 0 && (
        <Box>
          <Text fs="18px" fw="550" color={"#131C30"} sx={{ mb: 2 }}>
            Inquiries
          </Text>
          <Grid container>
            {inquiries.map((inquiry, index) => (
              <InquiryBox inquiry={inquiry} key={inquiries} />
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
            <Text fs="20px" fw="700" color={"#131C30"} sx={{ my: 2 }}>
              Accounts
            </Text>
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
                  isChecked={checkedItems[infoIndex]}
                  onCheckboxChange={handleCheckboxChange}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
              {account.details.EXP.length > 0 && (
                <AccountDetails
                  bureau="EXP"
                  details={account.details.EXP}
                  infoIndex={infoIndex}
                  isChecked={checkedItems[infoIndex]}
                  onCheckboxChange={handleCheckboxChange}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
              {account.details.TUC.length > 0 && (
                <AccountDetails
                  bureau="TUC"
                  details={account.details.TUC}
                  infoIndex={infoIndex}
                  isChecked={checkedItems[infoIndex]}
                  onCheckboxChange={handleCheckboxChange}
                  customMessage={customMessages[infoIndex]}
                  onCustomMessageChange={handleCustomMessageChange}
                />
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleAttackNow}>
          Attack now
        </Button>
      </Box>
    </Box>
  );
}

function Attacks({setType}) {
  // Attacks component logic goes here
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button variant="contained" onClick={() => setType("disputing")}>
        Start new dispute
      </Button>
    </Box>
  );
}

function BureauDetails({
  details,
  infoIndex,
  onCheckboxChange,
  isChecked,
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
              checked={isChecked}
              onChange={() => onCheckboxChange(infoIndex)}
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
  details,
  infoIndex,
  onCheckboxChange,
  isChecked,
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
              checked={isChecked}
              onChange={() => onCheckboxChange(infoIndex)}
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



function InquiryBox({inquiry}){
 return (
   <Grid item md={4} xs={6}>
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
               //  checked={isChecked}
               //  onChange={() => onCheckboxChange(infoIndex)}
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