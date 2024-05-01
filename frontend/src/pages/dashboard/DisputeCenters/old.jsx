import { Box, Stack, Divider, Checkbox } from "@mui/material";
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
        {type === "attacks" && <Attacks />}
      </Stack>
    </Box>
  );
}

function Disputes() {
  const user = useSelector((state) => state.user.details);
  const [disputes, setDisputes] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [customMessages, setCustomMessages] = useState({});
  const [negativeItems, setNegativeItems] = useState([]);

  useEffect(() => {
    const publicInformation =
      user?.creditReport?.creditReportData?.public_information;
    console.log("Public Information:", publicInformation);

    const structuredInfo = publicInformation.map((info) => ({
      infoType: info.infoType,
      details: {
        EQF: info.infoDetails.reduce((acc, curr) => {
          if (curr.data.EQF) acc[curr.label] = curr.data.EQF;
          return acc;
        }, {}),
        EXP: info.infoDetails.reduce((acc, curr) => {
          if (curr.data.EXP) acc[curr.label] = curr.data.EXP;
          return acc;
        }, {}),
        TUC: info.infoDetails.reduce((acc, curr) => {
          if (curr.data.TUC) acc[curr.label] = curr.data.TUC;
          return acc;
        }, {}),
      },
    }));

    setDisputes(structuredInfo);

    // Initialize state for checkboxes and custom messages
    const checkBoxInitState = {};
    const customMsgInitState = {};
    structuredInfo.forEach((info, infoIndex) => {
      checkBoxInitState[infoIndex] = {};
      customMsgInitState[infoIndex] = {};
      Object.keys(info.details).forEach((bureau) => {
        checkBoxInitState[infoIndex][bureau] = false; // Initialize each bureau's checkbox as false
        customMsgInitState[infoIndex][bureau] = ""; // Initialize each bureau's message as an empty string
      });
    });
    setCheckedItems(checkBoxInitState);
    setCustomMessages(customMsgInitState);

    // Negative Items

    const identifyNegativeItems = () => {
      const negatives = [];
      const accountHistory =
        user?.creditReport?.creditReportData?.account_history;

      // Loop through each account to check for negative indicators
      accountHistory.forEach((account) => {
        const paymentStatusDetail = account.accountDetails.find(
          (detail) => detail.label === "Payment Status"
        );
        const collectionDetail = account.accountDetails.find(
          (detail) => detail.label === "Collection"
        );
        const publicRecords =
          user?.creditReport?.creditReportData?.public_information;

        // Add negative indicators as needed
        if (
          (paymentStatusDetail &&
            paymentStatusDetail.data.TUC.includes("Late")) ||
          (collectionDetail && collectionDetail.data.TUC)
          // Add other negative indicators here
        ) {
          negatives.push(account);
        }

        // Check public records for bankruptcies, etc.
        publicRecords.forEach((record) => {
          if (record.infoType === "Bankruptcy") {
            negatives.push(record);
          }
        });
      });

      // Update the negative items state
      setNegativeItems(negatives);

      console.log(negatives);
    };

    // Call the function to check for negatives
    identifyNegativeItems();
  }, [user]);

  const handleCheckboxChange = (infoIndex, bureau) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [infoIndex]: {
        ...prevState[infoIndex],
        [bureau]: !prevState[infoIndex][bureau],
      },
    }));
  };

  const handleCustomMessageChange = (infoIndex, bureau, event) => {
    setCustomMessages((prevState) => ({
      ...prevState,
      [infoIndex]: {
        ...prevState[infoIndex],
        [bureau]: event.target.value,
      },
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
        {disputes.map((info, infoIndex) => (
          <Box key={infoIndex}>
            <Text fs="20px" fw="550" color="#131C30" mb={2}>
              {info.infoType}
            </Text>
            <Stack direction="row" spacing={2}>
              {Object.entries(info.details).map(
                ([bureau, details], bureauIndex) => (
                  <BureauDetails
                    key={bureau}
                    details={details}
                    infoIndex={infoIndex}
                    bureau={bureau}
                    onCheckboxChange={handleCheckboxChange}
                    isChecked={checkedItems[infoIndex][bureau]}
                    onCustomMessageChange={handleCustomMessageChange}
                    customMessage={customMessages[infoIndex][bureau]}
                  />
                )
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

function Attacks() {
  // Attacks component logic goes here
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button variant="contained">Start new dispute</Button>
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
  return (
    <Box display="flex" flexDirection="row">
      <Box
        border="1px solid #FF9D43"
        borderRadius="10px"
        p={2}
        minWidth="300px"
        mt={2}
        mb={2}
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
              onChange={(event) => onCustomMessageChange(infoIndex, event)}
              style={{
                flexGrow: 1,
                padding: "10px",
                marginLeft: "10px",
                borderRadius: "5px",
                border: "1px solid #CDCDCD",
              }}
            />
          </Stack>
          {Object.entries(details).map(([key, value], index) => (
            <Text key={index} fs="14px" fw="400" color="#475467">
              {key}: {value}
            </Text>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
