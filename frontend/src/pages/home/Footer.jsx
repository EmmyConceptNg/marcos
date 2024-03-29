import { Box, Stack } from "@mui/material";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Text from "../../components/Text";
import { Form, Formik } from "formik";
import { newsletterValidation } from "../../utils/validation";

export default function Footer() {

  const initialValues ={
    email :''
  }
  const handleNewsLetter = (values, actions) => {};
  return (
    <Stack
      mt={10}
      direction={{ md: "row", xs: "column" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={newsletterValidation}
        onSubmit={handleNewsLetter}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack
              direction={{ md: "row", xs: "column" }}
              spacing={1}
              alignItems="center"
            >
              <Input
                width="219px"
                name="email"
                placeholder="Enter you email"
                aria-label="enter your email"
              />
              <Button
                type="submit"
                loading={isSubmitting}
                height="44px" width="200px"
                rounded
                variant="contained"
              >
                Get Started
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      <Text fw="400" fs="16px" color="#B7B7B7">
        © 2024 All rights reserved.
      </Text>
    </Stack>
  );
}
