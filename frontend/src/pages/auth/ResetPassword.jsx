import { Box, Stack } from "@mui/material";
import LockIcon from "../../components/svgs/LockIcon";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";

export default function ResetPassword() {
  const [sendMailBtn, setSendMailBtn] = useState(false);
  return (
    <Box display="flex" justifyContent="center" component="form" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <LockIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Set new password
          </Text>
          <Text fw="400" fs="16px" sx={{ textAlign: 'center' }} color="#475467">
            Your new password must be different to previously used passwords.
          </Text>
          <Input
            label="Password"
            type="password" description ='Must be at least 8 characters.'
            endAdornment
            required={true}
            placeholder="Enter you password"
            aria-label="enter your password"
          />
          <Input
            label="Confirm Password"
            type="password"
            endAdornment
            required={true}
            placeholder="Enter you password"
            aria-label="enter your password"
          />
          <Button
            loading={sendMailBtn}
            width="100%"
            heigh="44px"
            type="submit"
            variant="contained"
          >
            Get Started
          </Button>
          <Button
            sx={{ color: "#475467" }}
            width="100%"
            heigh="44px"
            type="button"
            startIcon={<ArrowBack />}
          >
            Back to log in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
