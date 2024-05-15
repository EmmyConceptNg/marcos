import { Box, Divider, Modal, Stack } from "@mui/material";
import { useState } from "react";
import Text from "../Text";
import Button from "../Button";
import PropTypes from "prop-types";
import Input from "../Input";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/UserReducer";
import { notify } from "../../utils/Index";
import { Form, Formik } from "formik";
import { amountValidation } from "../../utils/validation";
import { loadStripe } from "@stripe/stripe-js";

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

export default function BuyCreditModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.details);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const initialValues = {
    balance: 0,
  };


  const handleUpdate = (values, actions) => {
    actions.setSubmitting(true);




    axios
      .post("/api/credit/initialize", values)
      .then(async (response) => {
        
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        actions.setSubmitting(true);

        if (result.error) {
          console.error(result.error.message);
        }
      })
      .catch((error) => {
        console.log(error);
        actions.setSubmitting(false);
        notify(error.response.data.error, "error");
      });





    // axios
    //   .post(`/api/auth/update/${user?._id}`, values, {
    //     headers: { "Content-Type": "application/json" },
    //   })
    //   .then((response) => {
    //     dispatch(setUser(response.data.user));
    //     notify(response?.data?.message, "success");
    //     handleClose();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     notify(error?.response?.data?.error, "error");
    //   })
    //   .finally(() => actions.setSubmitting(false));
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
          Buy Additional Credit
        </Text>
        <Divider />

        <Formik
          initialValues={initialValues}
          validationSchema={amountValidation}
          onSubmit={handleUpdate}
        >
          {({ isSubmitting }) => (
            <Form>
              
                <Box mb={4}>
                  <Input
                    type="number"
                    required
                    label="Amount"
                    placeholder="0"
                    aria-label="enter amount"
                    name="balance"
                  />
                </Box>

                <Stack sx={{ mt:5 }}
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
                    Buy Credit
                  </Button>
                </Stack>
              
            </Form>
          )}
        </Formik>
      </Stack>
    </Modal>
  );
}

BuyCreditModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
