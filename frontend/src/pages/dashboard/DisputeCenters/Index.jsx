/* eslint-disable react/prop-types */
import {
  Box,
  Stack,
  Divider,
  Checkbox,
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
import NoBalanceModal from "../../../components/modal/NoBalanceModal";
import { setUser } from "../../../redux/UserReducer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PersonalInfoBox } from "../../../components/disputes/PersonalInfoBox";
import { InquiryBox } from "../../../components/disputes/InquiryBox";
import { AccountDetails } from "../../../components/disputes/AccountDetails";
import { BureauDetails } from "../../../components/disputes/BureauDetails";
import { Attacks } from "../../../components/disputes/Attacks";
import { Disputes } from "../../../components/disputes/Disputes";

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






