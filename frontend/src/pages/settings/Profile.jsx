import { Avatar, Box, Grid, Stack } from "@mui/material";
import { useRef } from "react";
import EditIcon from "../../components/svgs/EditIcon";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Form, Formik } from "formik";
import { userDetailsCalidation } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import { setUser } from "../../redux/UserReducer";
import { notify } from "../../utils/Index";

export default function Profile() {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.details)
  const initialValues = {
    fullName: user?.fullName ??'',
    username: user?.username ?? '',
    email : user?.email ?? '',
    phone : user?.phone ?? '',
    dob: user?.dob ?? '',
    presentAddress: user?.presentAddress ?? '',
    permAddress: user?.permAddress ??'',
    city: user?.city ??'',
    postalCode : user?.postalCode ?? '',
    country: user?.country ?? '',
  }

const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    // if (!selectedFile) {
    //   notify("Please select a file first!", "error");
    //   return false;
    // }

    // const formData = new FormData();
    // formData.append("profileImage", selectedFile);

    // try {
    //   axios
    //     .post(`/api/user/${user?._id}/update-profile-image`, formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((response) => {
    //       notify(response.data.message, "success");
    //       dispatch({ type: "SET_USER", payload: response.data.user });

    //       setImage(response.data.filePath);
    //     });
    // } catch (error) {
    //   console.log("Error uploading image:", error);

    //   notify(error.response?.data.error, "error");
    // }
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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ md: 2, xs: 3 }}
        alignItems={{ xs: "center", sm: "flex-start" }}
      >
        <Box display="flex" alignItems="flex-end">
          <Avatar
            sx={{ width: "130px", height: "130px" }}
            src="/assets/images/avatar.svg"
          />
          <Box
            sx={{
              position: "absolute",
              left: { xs: "200px", sm: "160px", md: "450px" },
            }}
          >
            <Box sx={{ cursor: "pointer" }} onClick={handleImageClick}>
              <EditIcon />
            </Box>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </Box>
        </Box>

        {/* Edit Form */}

        <Formik
          initialValues={initialValues}
          validationSchema={userDetailsCalidation}
          onSubmit={handleUpdate}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={{ md: 5, xs: 0 }}>
                {[
                  {
                    label: "Your Name",
                    placeholder: "Charlene Reed ",
                    required: false, name:"fullName"
                  },
                  {
                    label: "User Name",
                    placeholder: "Charlene Reed ",
                    required: false, name: 'username'
                  },
                  {
                    label: "Email",
                    placeholder: "charlenereed@gmail.com",
                    type: "email",
                    required: false, name:'email'
                  },
                  {
                    label: "Phone",
                    placeholder: "+1 00 0000 00",
                    type: "tel",
                    required: false, name:'phone'
                  },
                  
                  {
                    label: "Date of Birth",
                    placeholder: "25 January 1990",
                    required: false, name: 'dob'
                  },
                  {
                    label: "Present Address",
                    placeholder: "San Jose, California, USA",
                    required: false, name: 'presentAddress'
                  },
                  {
                    label: "Permanent Address",
                    placeholder: "San Jose, California, USA",
                    required: false, name: 'permAddress'
                  },
                  {
                    label: "City",
                    placeholder: "San Jose",
                    required: false, name: 'city'
                  },
                  {
                    label: "Postal Code",
                    placeholder: "45962",
                    required: false, name : 'postalCode'
                  },
                  {
                    label: "Country",
                    placeholder: "USA",
                    required: false, name: 'country'
                  },
                ].map((item, index) => (
                  <Grid item md={6} xs={12} key={index} mb={{ xs: 5, md: 0 }}>
                    <Input name={item.name} 
                      height="45px"
                      label={item.label}
                      required={item.required}
                      placeholder={item.placeholder}
                      aria-label={item.label}
                    />
                  </Grid>
                ))}
              </Grid>
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
      </Stack>
    </Box>
  );
}
