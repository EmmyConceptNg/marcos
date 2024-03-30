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
import { usePlaidLink } from "react-plaid-link";


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
  const [accessToken, setAccessToken] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [proPlan, setProPlan] = useState(null);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const getPlans = () => {
    axios.get("/api/subscription/get-plans").then((response) => {
      const plans = response.data;
      console.log(plans)
      setProPlan(plans.find((plan) => plan.name === "Pro"));
      console.log(proPlan)
    });
  };

  useEffect(() => {
    getPlans();
  }, []);

   

  const handleUpgrade = () => {
    setIsUpgrading(true);
    axios
      .post("/api/subscription/initialize", { planId: proPlan?._id })
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

  // Fetch link_token from server when component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await axios.post("/api/plaid/create_link_token", {
          userId: user?._id,
        });
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error fetching link token: ", error);
      }
    };

    fetchLinkToken();
  }, [user?._id]);

  const fetchAccounts = () => {};
  const onSuccess = useCallback(
    async (publicToken, metadata) => {
      // Send the publicToken to your server to exchange for an access token
      try {
        const response = await axios.post("/api/plaid/exchange_public_token", {
          publicToken, userId : user._id
        });
        setAccessToken(response.data.plaid.accessToken);
        setItemId(response.data.plaid.itemId);
        dispatch(setUser(response.data.user))
        navigate("/dashboard"); 

     
        fetchAccounts(response.data.accessToken);
      } catch (error) {
        console.error("Error exchanging public token: ", error);
        // Update the UI to show an error message
        notify("Unable to connect to your bank. Please try again.", 'error');
      }
    },
    [navigate, fetchAccounts]
  );

  const config = {
    token: linkToken,
    onSuccess,
    // Define other callbacks as needed
  };

  

  const { open, ready, error } = usePlaidLink(config);

   

  
  return (
    <>
      <Text color="#131C30" fs="36px" fw="700">
        Hi Marcos!
      </Text>
   
       {proPlan && user?.subscriptionPlan.name === 'Basic' && <Box
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
        </Box>}
    
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
        >
          <Text color="#131C30" fs={{ sm: "25px", xs: "18px" }} fw="700">
            Connect Your Bank!
          </Text>

          <Button
            variant="contained"
            width={{ sm: "165px", xs: "100%" }}
            height="48px"
            onClick={() => ready && open()}
            disabled={!ready}
          >
            Connect Bank
          </Button>
        </Stack>
      </Box>
    </>
  );
}
function Disputes() {
  return (
    <>
      <Text color="#131C30" fs="25px" fw="700">
        Disputes
      </Text>
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
        <Grid container spacing={3}>
          {[
            {
              image: "/assets/images/trans.svg",
              updated: "Feb 28, 2024 ",
            },
            {
              image: "/assets/images/experian.svg",
              updated: "Feb 28, 2024 ",
            },
            {
              image: "/assets/images/equifax.svg",
              updated: "Feb 28, 2024 ",
            },
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
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
