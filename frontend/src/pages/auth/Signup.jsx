import {
  Box,
  Grid,
  Stack,
} from "@mui/material";
// import { useLocation } from "react-router-dom";



import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { ToastContainer } from "react-toastify";

import axios from "../../api/axios";
import Text from "../../components/Text";
import { notify } from "../../utils/Index";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { setUser } from "../../redux/UserReducer";
import { Formik, Form } from "formik";
import { userValidation } from "../../utils/validation";


export default function Signup() {
    const navigate=useNavigate()
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const workspaceEmail = queryParams.get("email") ?? "";
 

   const initialValues = {
    fullName: '',
    email: '',
    password: '',
  };
  const dispatch = useDispatch();
  

  const handleSignup = (values, actions) => {
    actions.setSubmitting(true);
    
    axios
      .post("/api/auth/register", values, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data.user);
        dispatch(setUser(response.data.user));
        navigate("/verification/link/email");
        // navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        notify(error?.response?.data?.error, "error");
      })
      .finally(() => actions.setSubmitting(false));
  };


  return (
    <Box bgcolor="#fff" maxHeight="100vh">
      <ToastContainer />
      <Grid container spacing={1} justifyContent="space-between">
        <Grid item md={6} lg={6} xs={12} sm={12}>
          <Box display="flex" height={"90vh"}>
            <Stack
              m="auto"
              spacing={2}
              sx={{ width: { lg: "520px", sm: "450px", xs: "320px" } }}
            >
              <Box component="img" src="assets/logo/logo.svg" width="52px" />
              <Text fw="550" fs="36px" color="#131C30">
                Sign Up
              </Text>
              <Text fw="400" fs="16px" color="#667085">
                Start your 30-day free trial.
              </Text>
              <Formik
                initialValues={initialValues}
                validationSchema={userValidation}
                onSubmit={handleSignup}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Stack
                      spacing={7}
                      mt={2}
                      sx={{ width: { lg: "520px", sm: "450px" } }}
                    >
                      <Input
                        label="Name"
                        required
                        placeholder="Enter you name"
                        aria-label="enter your name" name="fullName"
                      />
                      <Input
                        label="Email"
                        required
                        placeholder="Enter you email"
                        aria-label="enter your email" name="email"
                      />
                      <Input
                        label="Password"
                        type="password"
                        endAdornment
                        required
                        placeholder="Enter you password"
                        aria-label="enter your password"
                        name="password"
                      />

                      <Button
                        loading={isSubmitting}
                        width="100%"
                        height="44px"
                        type="submit"
                        variant="contained"
                      >
                        Get Started
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>

              <Box>
                <Box
                  borderRadius="10px"
                  width="100%"
                  height="44px"
                  border="1px solid #D9D9D9"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box component="img" src="assets/icons/google.svg" />
                  <Text fw="550" fs="16px" sx={{ ml: 2 }} color="#344054">
                    Sign up with Google
                  </Text>
                </Box>
              </Box>
              <Box display="flex" justifyContent={"center"}>
                <Text
                  sx={{ textAlign: "center" }}
                  color="#475467"
                  fs="14px"
                  fw="400"
                >
                  Already have an account?
                </Text>
                <Text
                  fs="14px"
                  fw="700"
                  to="/login"
                  sx={{
                    textAlign: "center",
                    marginLeft: 1,
                    color: "#FF9D43",
                    cursor: "pointer",
                  }}
                >
                  Log in
                </Text>
              </Box>
            </Stack>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <Stack
              direction={{ sm: "row", xs: "column" }}
              justifyContent="space-between"
              mx={{ sm: 10, xs: 5 }}
            >
              <Text
                fs="14px"
                fw="400"
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                color="#475467"
              >
                © All rights reserved {new Date().getFullYear()}
              </Text>
              <Text
                fs="14px"
                fw="400"
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                color="#475467"
              >
                help@example-email.com
              </Text>
            </Stack>
          </Box>
        </Grid>
        <Grid
          item
          md={6}
          lg={6}
          xs={12}
          sm={12}
          sx={{
            display: { md: "block", sm: "none", xs: "none" },
          }}
        >
          <Box
            sx={{
              height: "100vh",
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src="assets/images/auth-image.svg"
              alt="Authentication"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
