import { Box, Grid, Stack } from "@mui/material";
import Text from "../../components/Text";
import Button from "../../components/Button";
import CheckIcon from "../../components/svgs/CheckIcon";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet";
import { setUser } from "../../redux/UserReducer";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import { notify } from "../../utils/Index";
import { useCallback, useEffect, useState } from "react";


import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import ProgressMeter from "../../components/loader";
import ProgressLoader from "../../components/loader";
import { hasProofOfAddress, hasID, mapToRowsStructure } from "../../utils/helper";
import { ToastContainer } from "react-toastify";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function Dashboard() {
  return (
    <>
      <Box>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <Stack spacing={5}>
          <Overview />
          <Disputes />
        </Stack>
      </Box>
    </>
  );
}

function Overview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.details);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [linkToken, setLinkToken] = useState(null);
  const token = useSelector(state => state.user.token)
  
  const [itemId, setItemId] = useState(null);
  const [proPlan, setProPlan] = useState(null);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const getPlans = () => {
    axios.get("/api/subscription/get-plans", {headers: {
      'Authorization' : 'Bearer ' + token
    }}).then((response) => {
      const plans = response.data;
      console.log(plans);
      setProPlan(plans.find((plan) => plan.name === "Pro"));
      console.log(proPlan);
    });
  };

  useEffect(() => {
    getPlans();
  }, []);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    axios
      .post(
        "/api/subscription/initialize",
        { planId: proPlan?._id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(async (response) => {
        setIsUpgrading(true);
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        setIsUpgrading(true);

        if (result.error) {
          console.error(result.error.message);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsUpgrading(false);
        notify(error.response.data.error, "error");
      });
  };

  


  

  return (
    <>
      <Text color="#131C30" fs="36px" fw="700">
        Hi {user?.fullName}!
      </Text>

      {/* Update Profile */}
      {!user?.ssn || !user.proofOfAddress || !user.id ? (
        <Box
          sx={{
            backgroundImage: `url('/assets/images/bg-dash.svg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "15px",
            padding: { md: 3, xs: 1 },
          }}
        >
          <Stack
            direction={{ sm: "row", xs: "column" }}
            mb={2}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text color="#131C30" fs="18px" fw="700">
              Update your profile info to access credit report
            </Text>

            <Button
              variant="contained"
              loading={isUpgrading}
              width={{ sm: "165px", xs: "100%" }}
              height="48px"
              onClick={() => navigate("/dashboard/settings")}
            >
              Upgrade Profile
            </Button>
          </Stack>
        </Box>
      ):(null)}

      {/* {proPlan && user?.subscriptionPlan.name === "Basic" && ( */}
        <Box
          height={{ md: "199px" }}
          sx={{
            backgroundImage: `url('/assets/images/bg-dash.svg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "15px",
            padding: { md: 3, xs: 1 },
          }}
        >
          <Stack
            direction={{ sm: "row", xs: "column" }}
            mb={2}
            spacing={1}
            justifyContent="space-between"
          >
            <Text color="#131C30" fs={{ sm: "25px", xs: "18px" }} fw="700">
              Go faster with premium AI plan!
            </Text>

            <Button
              variant="contained"
              loading={isUpgrading}
              width={{ sm: "165px", xs: "100%" }}
              height="48px"
              onClick={() => handleUpgrade()}
            >
              Upgrade to Pro
            </Button>
          </Stack>
          {[
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          ].map((item, index) => (
            <Stack direction="row" spacing={2} mb={1} key={index}>
              <CheckIcon />
              <Text color="#131C30" fs={{ sm: "16px", xs: "16px" }} fw="400">
                {item}
              </Text>
            </Stack>
          ))}
        </Box>
      {/* )} */}
    </>
  );
}
function Disputes() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.details);
  const token = useSelector((state) => state.user.token);
 

  const handleUploadFromComputer = () => {
    if(!hasID(user) || !hasProofOfAddress(user)){
      notify('You need to upload a proof of address and a valid ID', 'info');
        setTimeout(() => {
          navigate("/dashboard/settings?proof=true");
        }, 2000);

      return false;
    }
    if (!user.ssn) {
      notify("You need to enter your Social Security Number", "info");
      setTimeout(() => {
        navigate("/dashboard/settings?redirect=/dashboard");
      }, 2000);
      return false;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.html";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      setUploadedFile(file);
      if ( file) {
        const fileType = file.type;
        const validTypes = ["application/pdf", "text/html"];
        if (validTypes.includes(fileType)) {
          const formData = new FormData();
          formData.append("file", file);

          await axios
            .post(`/api/creditreport/upload/${user?._id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                'Authorization' : 'Bearer ' + token
              },
            })
            .then((response) => {
              notify(response.data.success, "success");
              dispatch(setUser(response.data.user));
              navigate("/dashboard/credit-report");
            })
            .catch((error) => {
              notify(error.response?.data.error, "error");
            });
        } else {
          alert("Only PDF and HTML files are allowed.");
        }
      }
    };

    fileInput.click();
  };

const [report, setReport] = useState([])
  const [creditScore, setCreditScore] = useState({
    TUC: "0",
    EXP: "0",
    EQF: "0",
  });

  useEffect(() => {
   if (user && user.creditReport[0] && user.creditReport[0]?.creditReportData) {
     const summaryData = user.creditReport[0]?.creditReportData["summary"];
     setReport(mapToRowsStructure(summaryData));

     //Credit score
     const creditScoreArray =
       user.creditReport[0]?.creditReportData["credit_score"] ||
       user.creditReport[0]?.creditReportData["fico®_score"] ||
       user.creditReport[0]?.creditReportData["Vantage2"];
     if (creditScoreArray && creditScoreArray.length > 0) {
       const creditScoreObject = creditScoreArray.find(
         (entry) =>
           entry.label === "Credit Score:" ||
           entry.label === "FICO® Score 8:" ||
           entry.label === "Vantage2"
       );
       if (creditScoreObject) {
         const creditScoreData = creditScoreObject.data;
         setCreditScore(creditScoreData);
       } else {
         console.log("Credit Score not found.");
       }
     } else {
       console.log("No credit score data available.");
     }
   } else {
     console.log("Summary data not found");
   }
  }, []);


  return (
    <>
    <ToastContainer />
      <Text color="#131C30" fs="25px" fw="700">
        Disputes
      </Text>
      {user?.creditReport ? (
        <Box>
          <Box>
            <Grid container spacing={3}>
              {[
                {
                  image: "/assets/images/trans.svg",
                  scheduled: 0,
                  sent: 0,
                  completed: 0,
                },
                {
                  image: "/assets/images/experian.svg",
                  scheduled: 0,
                  sent: 0,
                  completed: 0,
                },
                {
                  image: "/assets/images/equifax.svg",
                  scheduled: 0,
                  sent: 0,
                  completed: 0,
                },
              ].map((item, index) => {
                return (
                  <Grid item key={index} md={4} sm={6} xs={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="205px"
                      border="1px solid #ECECEC"
                      p={2}
                      bgcolor="#fff"
                    >
                      <Box display="flex" justifyContent="center">
                        <Box component="img" src={item.image} />
                      </Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Icon
                            icon="solar:calendar-broken"
                            style={{ color: "#3C80E5" }}
                          />
                          <Text color="#131C30" fs="16px" fw="550">
                            Scheduled
                          </Text>
                        </Stack>
                        <Text color="#131C30" fs="16px" fw="550">
                          {item.scheduled}
                        </Text>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Icon
                            icon="icon-park-solid:message-sent"
                            style={{ color: "#34D073" }}
                          />
                          <Text color="#131C30" fs="16px" fw="550">
                            Sent
                          </Text>
                        </Stack>
                        <Text color="#131C30" fs="16px" fw="550">
                          {item.sent}
                        </Text>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Icon
                            icon="carbon:task-complete"
                            style={{ color: "#34D073" }}
                          />
                          <Text color="#131C30" fs="16px" fw="550">
                            Sent
                          </Text>
                        </Stack>
                        <Text color="#131C30" fs="16px" fw="550">
                          {item.sent}
                        </Text>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={3} justifyContent="center">
              

              {[
                { name: "TUC", image: "trans.svg", value: creditScore.TUC },
                {
                  name: "EXP",
                  image: "experian.svg",
                  value: creditScore.EXP,
                },
                { name: "EQF", image: "equifax.svg", value: creditScore.EQF },
              ].map((item, index) => {
                return (
                  <Grid item key={index} md={4} sm={6} xs={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="290px"
                      border="1px solid #ECECEC"
                      p={2}
                      bgcolor="#fff"
                    >
                      <ProgressLoader
                        key={index}
                        value={+item.value}
                        image={
                          <Box
                            component="img"
                            src={`/assets/images/${item.image}`}
                            key={index}
                            width={{ xs: "80px", sm: "100px" }}
                          />
                        }
                        
                      />
                    </Box>
                    {/* <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="290px"
                      border="1px solid #ECECEC"
                      p={2}
                      bgcolor="#fff"
                    >
                      <Box display="flex" justifyContent="center">
                        <Box component="img" src="/assets/images/meter.svg" />
                      </Box>
                      <Stack justifyContent="center" alignItems="center">
                        <Box display="flex" justifyContent="center">
                          <Box component="img" src={item.image} />
                        </Box>
                        <Text color="#C7C7C7" fs="15px" fw="400">
                          {`Last updated ${item.updated}`}
                        </Text>
                      </Stack>
                    </Box> */}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{ border: "3px dotted #CDCDCD" }}
          height="200px"
          borderRadius="15px"
          display="flex"
          justifyContent="center"
        >
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Text color="#131C30" fs={{ sm: "16px", xs: "16px" }} fw="400">
              You currently do not have any record. Please upload a credit
              record to see disputes
            </Text>
            <Button
              variant="contained"
              width="150px"
              dropdown onClick={() => {
               if (!user.proofOfAddress || !user.id) {
                 notify(
                   "You need to upload a proof of address and a valid ID card",
                   "info"
                 );

                  setTimeout(() => {
                    navigate("/dashboard/settings?proof=true");
                  }, 2000);

                 return false;
               }
              }}
              dropdownItems={[
                {
                  text: "Upload from Computer",
                  onClick: () => handleUploadFromComputer(),
                },
                {
                  text: "One click Upload (pro)",
                  onClick: () => console.log("Option 2 clicked"),
                },
              ]}
            >
              Upload
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
}
