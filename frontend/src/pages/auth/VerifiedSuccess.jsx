import { Box, Stack } from "@mui/material";

import Button from "../../components/Button";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";

import CheckSuccessIcon from "../../components/svgs/CheckSuccessIcon";
import Text from "../../components/Text";
import { useNavigate } from "react-router-dom";

export default function VerifiedSuccess() {
  const navigate = useNavigate
  return (
    <Box display="flex" justifyContent="center" component="form" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <CheckSuccessIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Email verified
          </Text>
          <Text fw="400" fs="16px" color="#475467" sx={{ textAlign: "center" }}>
            Your account has been successfully verified. Click below to log in
            magically.
          </Text>
          <Button to="/dashboard"
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
            type="button" to="/login"
            startIcon={<ArrowBack />}
          >
            Back to log in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
