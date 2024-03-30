import { Box, Stack } from "@mui/material";

import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";

import CheckSuccessIcon from "../../../components/svgs/CheckSuccessIcon";
import Text from "../../../components/Text";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../utils/Index";
import { setUser } from "../../../redux/UserReducer";


export default function SubscriptionSuccess() {
    const dispatch = useDispatch()
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.details);
  const { planId, sessionId } = useParams();
  const [redirection, setRedirection] = useState(true);
  const [plan, setPlan] = useState(null);
  
  useEffect(() => {
    getPlans();
  }, []);

  useEffect(() => {
    setRedirection(true);
    redirect();
  }, []);

   

   const getPlans = () => {
     axios.get("/api/subscription/get-plans").then((response) => {
       const plans = response.data;
       setPlan(plans.find((plan) => plan._id === planId));
     });
   };
  const redirect = () => {
    setRedirection(true);
    axios
      .post("api/subscription/", {
        sessionId: sessionId,
        planId: planId,
        userId: user._id,
      })
      .then((response) => {
        dispatch(setUser(response.data.user))
        if(plan?.name === 'Basic' || plan?.name === 'Pro'){
          navigate("/dashboard/app");
        }else if (plan?.name === "Enterprise") {
          navigate("/business/app");
        }else{
           setRedirection(false);
          return false
        }
      })
      .catch((error) => {
        notify("error redirecting please proceed to dashbaord", "error");
        console.log(error)
        setRedirection(false);
      });
  };

  return (
    <Box display="flex" justifyContent="center" component="form" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <CheckSuccessIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Subscription Verified
          </Text>
          <Text fw="400" fs="16px" color="#475467" sx={{ textAlign: "center" }}>
            Congratulations! Now you can enjoy the pro features
          </Text>
          <Button
            loading={redirection}
            onClick={() => redirect()}
            width="100%"
            heigh="44px"
            type="button"
            variant="contained"
          >
            Continue
          </Button>
          <Button
            sx={{ color: "#475467" }}
            width="100%"
            heigh="44px"
            type="button"
            loading={redirection}
            onClick={() => redirect()}
            startIcon={<ArrowBack />}
          >
            Back to dashboard
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
