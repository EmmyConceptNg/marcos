import { Avatar, Box, Grid, Stack, Modal } from "@mui/material";
import { useRef, useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../../api/axios";
import { setUser } from "../../../../redux/UserReducer";
import { notify } from "../../../../utils/Index";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { userDetailsValidation } from "../../../../utils/validation";
import { CheckCircle } from "@mui/icons-material";
import EditIcon from "../../../../components/svgs/EditIcon";

const removeHyphens = (ssn) => ssn.replace(/-/g, "");

export default function AddClientModal({ open, setOpen }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.details);
  const isSSNVerified = user?.ssnVerified ?? "pending";
  const [verifying, setVerifying] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = {
    fullName:  "",
    username:  "",
    email:  "",
    phone:  "",
    dob:  "",
    presentAddress:  "",
    permAddress:  "",
    city:  "",
    postalCode:  "",
    country:  "",
    ssn:  "",
  };

const handleClose = () =>{
    setOpen(false);
}

  const handleSSNChange = async (event, setFieldValue) => {
    const ssnRaw = event.target.value;
    const ssn = removeHyphens(ssnRaw);
    const fullName = event.target.form.fullName.value;
    const dob = event.target.form.dob.value;

    if (ssn.length === 9) {
      setVerifying(true);
      try {
        const response = await axios.post("/api/auth/verify-ssn", {
          userId: user?._id,
          ssn,
          fullName,
          dob,
        });

        dispatch(setUser(response.data.user));

        setFieldValue("fullName", user?.fullName);
        setFieldValue(
          "dob",
          new Date(user?.dob).toISOString().substring(0, 10)
        );

        if (response.data.is_valid === "TRUE") {
          notify(response.data.message, "success");
        } else {
          notify(response.data.message, "warn");
        }
      } catch (error) {
        console.log(error);
        notify(error.response?.data?.error || "Error verifying SSN", "error");
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);

    axios
      .post(`/api/clients/${user?._id}`, values, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data.user);
        notify(response?.data?.message, "success");
        handleClose()
      })
      .catch((error) => {
        console.log(error);
        notify(error?.response?.data?.error, "error");
      })
      .finally(() => actions.setSubmitting(false));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", md: "60%" },
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box mt={3}>
          <ToastContainer />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ md: 2, xs: 3 }}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={userDetailsValidation(isSSNVerified)}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <Grid container spacing={{ md: 5, xs: 0 }}>
                    {verifying && (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: "center", color: "green" }}>
                          Verifying, please wait...
                        </Box>
                      </Grid>
                    )}
                    {[
                      {
                        label: "Full Name",
                        placeholder: "Charlene Reed",
                        required: false,
                        name: "fullName",
                        readOnly: isSSNVerified === "TRUE",
                      },
                      {
                        label: "Date of Birth",
                        placeholder: "1990-01-25",
                        required: false,
                        name: "dob",
                        readOnly: isSSNVerified === "TRUE",
                        type: "date",
                      },
                      {
                        label: "Social Security Number",
                        placeholder: "SSN",
                        required: true,
                        type: "text",
                        name: "ssn",
                        onInput: (e) => handleSSNChange(e, setFieldValue),
                      },
                      {
                        label: "User Name",
                        placeholder: "Charlene Reed",
                        required: false,
                        name: "username",
                      },
                      {
                        label: "Email",
                        placeholder: "charlenereed@gmail.com",
                        type: "email",
                        required: false,
                        name: "email",
                      },
                      {
                        label: "Phone",
                        placeholder: "+1 00 0000 00",
                        type: "tel",
                        required: false,
                        name: "phone",
                      },
                      {
                        label: "Present Address",
                        placeholder: "San Jose, California, USA",
                        required: false,
                        name: "presentAddress",
                      },
                      {
                        label: "Permanent Address",
                        placeholder: "San Jose, California, USA",
                        required: false,
                        name: "permAddress",
                      },
                      {
                        label: "City",
                        placeholder: "San Jose",
                        required: false,
                        name: "city",
                      },
                      {
                        label: "Postal Code",
                        placeholder: "45962",
                        required: false,
                        name: "postalCode",
                      },
                      {
                        label: "Country",
                        placeholder: "USA",
                        required: false,
                        name: "country",
                        defaultValue: "USA",
                      },
                    ].map((item, index) => (
                      <Grid
                        item
                        md={6}
                        xs={12}
                        key={index}
                        mb={{ xs: 5, md: 0 }}
                      >
                        <Box display="flex">
                          <Input
                            name={item.name}
                            readOnly={item?.readOnly}
                            height="45px"
                            label={item.label}
                            required={item.required}
                            placeholder={item.placeholder}
                            aria-label={item.label}
                            type={item.type}
                            defaultValue={item?.defaultValue}
                            onInput={item.onInput}
                          />
                          {item.name === "ssn" && !verifying && (
                            <Box ml={1} position="relative" top="35px">
                              {isSSNVerified === "TRUE" ? (
                                <CheckCircle sx={{ color: "green" }} />
                              ) : isSSNVerified === "FALSE" ? (
                                <CancelIcon sx={{ color: "red" }} />
                              ) : null}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    display="flex"
                    sx={{ justifySelf: "flex-end", gap: 2 }}
                    mt={{ md: 5 }}
                  >
                    <Button
                      type="button"
                      color="gray"
                      variant="outlined"
                      sx={{ ml: "auto" }}
                      onClick={() => handleClose()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      variant="contained"
                      sx={{ ml: "auto" }}
                    >
                      Add Client
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
