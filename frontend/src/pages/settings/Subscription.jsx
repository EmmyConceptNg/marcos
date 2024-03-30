import { Box, Grid, Stack } from "@mui/material";
import Button from "../../components/Button";
import Check from "../../components/svgs/Check";
import Text from "../../components/Text";
import { notify } from "../../utils/Index";
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

export function Subscription() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.details);
  const [loadingPlanId, setLoadingPlanId] = useState(null); // Track loading state for each plan
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = () => {
    axios
      .get("/api/subscription/get-plans")
      .then((response) => {
        setPlans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
      });
  };

  const handleUpgrade = (planId) => {
    setLoadingPlanId(planId); // Set loading state for the clicked button
    axios
      .post("/api/subscription/initialize", { planId })
      .then(async (response) => {
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        if (result.error) {
          console.error(result.error.message);
        }
      })
      .catch((error) => {
        console.log(error);
        notify(error.response.data.error, "error");
      })
      .finally(() => {
        setLoadingPlanId(null); 
      });
  };

  return (
    <Grid container spacing={2} justifyContent={"flex-start"} sx={{ mt: 1 }}>
      {plans.map(({ name, description, price, _id }, index) => (
        <Grid
          key={index}
          item
          xs={12}
          md={6}
          xl={4}
          lg={4}
          sx={{ display: "flex", pt: 5 }}
        >
          <Box
            width="100%"
            height="100%"
            bgcolor="#fff"
            border={user.subscriptionPlan._id !== _id && "1px solid #ECECEC"}
            borderRadius="16px"
            sx={{
              boxShadow:
                user.subscriptionPlan._id !== _id
                  ? "0px 4px 20px -4px #1018281A"
                  : " 0px 4px 40.20000076293945px -4px #FF6B0045",

              borderRadius: "16px",
              ...(user.subscriptionPlan._id === _id && {
                border: "1px solid transparent",
                borderImageSource:
                  "linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)",
                borderImageSlice: 1,
              }),
            }}
          >
            <Stack
              spacing={2}
              justifyContent="flex-end"
              sx={{ padding: "35px 32px 0 32px" }}
            >
              {user.subscriptionPlan._id === _id && (
                <Box display="flex" justifyContent="flex-end">
                  <Box
                    px={1}
                    py={0.5}
                    bgcolor="#FF9D4347"
                    borderRadius="7.29px"
                  >
                    <Text
                      background=" linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                      fw="700"
                      fs="14px"
                      sx={{
                        textAlign: "center",
                        mx: "auto",
                      }}
                    >
                      Current Plan
                    </Text>
                  </Box>
                </Box>
              )}
              <Text
                background=" linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                fw="550"
                fs={{ md: "30px", lg: "30px", sm: "30px", xs: "30px" }}
                sx={{
                  textAlign: "center",
                  mx: "auto",
                }}
              >
                {name}
              </Text>
              <Text
                color="#B7B7B7"
                fw="550"
                fs={{ md: "20px", lg: "20px", sm: "20px", xs: "20px" }}
                sx={{
                  textAlign: "center",
                  mx: "auto",
                }}
              >
                {description}
              </Text>
              <Text
                background=" linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                fw="400"
                fs={{ md: "41px", lg: "41px", sm: "41px", xs: "41px" }}
                sx={{
                  textAlign: "center",
                  mx: "auto",
                }}
              >
                ${price}
              </Text>

              <Stack spacing={2}>
                {[
                  "200+ integrations",
                  "Advanced reporting and analytics",
                  "Up to 20 individual users",
                  "40GB individual data each user",
                  "Priority chat and email support",
                ].map((_item, _index) => (
                  <Box
                    display="flex"
                    gap={2}
                    justifyContent="flex-start"
                    key={_index}
                  >
                    <Check />
                    <Text
                      color="#475467"
                      fw="400"
                      fs={{ md: "16px", lg: "16px", sm: "16px", xs: "16px" }}
                      sx={{
                        textAlign: "start",
                      }}
                    >
                      {_item}
                    </Text>
                  </Box>
                ))}
              </Stack>
              <Box p="32px">
                <Button
                  variant="contained"
                  loading={loadingPlanId === _id} // Set loading state for the button based on plan ID
                  width="100%"
                  onClick={() => handleUpgrade(_id)}
                >
                  Upgrade
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
