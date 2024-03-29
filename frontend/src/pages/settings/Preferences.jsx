import {
  Box,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  styled,
} from "@mui/material";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Text from "../../components/Text";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import { setUser } from "../../redux/UserReducer";
import { notify } from "../../utils/Index";
import { Form, Formik } from "formik";
import { preferencesValidation } from "../../utils/validation";

export default function Preferences() {
  const user = useSelector((state) => state.user.details);

  const dispatch = useDispatch();
  const initialValues = {
    currency: user?.currency ?? "",
    timeZone: user?.timeZone ?? "",
  };

  const handleUpdate = (values, actions) => {
    actions.setSubmitting(true);

    axios
      .post(`/api/auth/update/${user?._id}`, values, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data.user);
        dispatch(setUser(response.data.user));
        notify(response?.data?.message, "success");
      })
      .catch((error) => {
        console.log(error);
        notify(error?.response?.data?.error, "error");
      })
      .finally(() => actions.setSubmitting(false));
  };
  return (
    <Box mt={3}>
      {/* Preferences Form */}

      <Formik
        initialValues={initialValues}
        validationSchema={preferencesValidation}
        onSubmit={handleUpdate}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid
              container
              spacing={{ sm: 5, xs: 0 }}
              justifyContent="flex-start"
            >
              {[
                {
                  label: "Currency",
                  placeholder: "USD ",
                  required: false,
                  name: "currency",
                },
                {
                  label: "Time Zone",
                  placeholder: "(GMT-12:00) International Date Line West ",
                  required: false,
                  name: "timeZone",
                },
              ].map((item, index) => (
                <Grid item md={6} xs={12} key={index} mb={{ xs: 5, md: 0 }}>
                  <Input name={item.name}
                    height="45px"
                    width="418px"
                    label={item.label}
                    required={item.required}
                    placeholder={item.placeholder}
                    aria-label={item.label}
                  />
                </Grid>
              ))}
            </Grid>

            <Box>
              <Notification />
            </Box>

            <Box display="flex" mt={{ md: 5 }}>
              <Button
                type="submit"
                loading={isSubmitting}
                variant="contained"
                sx={{ ml: "auto" }}
              >
                Save
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

function Notification() {
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#FF9D43" : "#FF9D43",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  return (
    <>
      <Box mt={7} mb={2} display="flex" alignItems="center">
        <Text fw="550" fs="17px" color="#333B69">
          Notification
        </Text>
      </Box>

      <Box display="flex" justifyContent="flex-start" mt={3}>
        <Stack>
          {[
            { name: "I send or receive digita currency" },
            {
              name: "I receive merchant order",
            },
            { name: "There are recommendation for my account" },
          ].map((item) => (
            <>
              <Stack direction="row" alignItems="center">
                <FormControlLabel
                  control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                />

                <Text fs="18px" fw="500" sx={{ cursor: "pointer" }}>
                  {item.name}
                </Text>
              </Stack>
            </>
          ))}
        </Stack>
      </Box>
    </>
  );
}
