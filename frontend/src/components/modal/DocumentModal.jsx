import { Box, Divider, Modal, Stack } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/UserReducer";
import { notify } from "../../utils/Index";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { documentValidation } from "../../utils/validation";
import SelectInput from "../Select";
import Input from "../Input";
import Text from "../Text";
import Button from "../Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: "2px 5px 5px #131C30",
  p: 4,
};

export default function DocumentModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const user = useSelector((state) => state.user.details);
  const dispatch = useDispatch();

  const documentOptions = [
    { label: "Proof of Address", value: "proof_of_address" },
    { label: "ID Card", value: "id_card" },
    { label: "Others", value: "others" },
  ];

  const initialValues = {
    name: "",
    customName: "",
    document: null,
  };

  const handleUpdate = (values, actions) => {
    const formData = new FormData();
    formData.append(
      "name",
      values.name === "others" ? values.customName : values.name
    );
    formData.append("document", values.document);

    axios
      .post(`/api/auth/upload-documents/${user?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        notify("Document uploaded successfully", "success");
        dispatch(setUser(response.data.user));
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
        notify("Upload failed", "error");
        actions.setSubmitting(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack spacing={3} sx={style}>
        <Text
          fs="20px"
          fw="700"
          color="green"
          sx={{ textAlign: "center" }}
          id="modal-modal-title"
        >
          Upload New Document
        </Text>
        <Divider />

        <Formik
          initialValues={initialValues}
          validationSchema={documentValidation}
          onSubmit={handleUpdate}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Box mb={4}>
                <SelectInput
                  required
                  label="Document Name"
                  name="name"
                  options={documentOptions}
                  id="document-name"
                  onChange={(event) =>
                    setFieldValue("name", event.target.value)
                  }
                />
              </Box>

              {values.name === "others" && (
                <Box mb={4}>
                  <Field
                    name="customName"
                    placeholder="Provide Document Name"
                    as={Input}
                  />
                  <ErrorMessage
                    name="customName"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Box>
              )}

              <Box>
                <input
                  type="file"
                  accept="image/*"
                  required
                  label="Document"
                  name="document"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    if (file && file.size <= 1 * 1024 * 1024) {
                      setFieldValue("document", file);
                    } else {
                      notify("File size must be less than 1MB", "error");
                      event.target.value = null; // Reset the file input
                    }
                  }}
                />
              </Box>

              <Stack
                sx={{ mt: 5 }}
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  color="#131C30"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  variant="contained"
                  sx={{ ml: "auto" }}
                >
                  Upload Document
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Modal>
  );
}

DocumentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
