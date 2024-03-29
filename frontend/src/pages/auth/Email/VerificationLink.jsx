import { Box, Stack } from "@mui/material";
import LockIcon from "../../../components/svgs/LockIcon";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import MailIcon from "../../../components/svgs/MailIcon";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";

export default function VerificationLink() {
  const [sendMailBtn, setSendMailBtn] = useState(false);
  const user = useSelector(state => state.user.details)


  const handleResendMail = () =>{
    setSendMailBtn(true);

    axios.get(`/api/auth/email/resend/${user.email}`).then(() => {
      setSendMailBtn(false);
    })
  }


  return (
    <Box display="flex" justifyContent="center" component="form" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <MailIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Check your email
          </Text>
          <Text fw="400" fs="16px" color="#475467" sx={{ textAlign: "center" }}>
            We sent averification link to {user.email}
          </Text>
          <Button
            to="/verification/email"
            width="100%"
            heigh="44px"
            type="submit"
            variant="contained"
          >
            Enter code manually
          </Button>
          <Box display="flex">
            <Text
              sx={{ textAlign: "center" }}
              color="#475467"
              fs="14px"
              fw="400"
            >
              Didn’t receive the email?
            </Text>
            {!sendMailBtn ? (
              <Text
                background="linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                fs="14px"
                fw="700"
                onClick={() => {
                  handleResendMail();
                }}
                sx={{
                  textAlign: "center",
                  marginLeft: 1,
                  color: "#FF9D43",
                  cursor: "pointer",
                }}
              >
                Click to resend
              </Text>
            ) : (
              <Text
                background="linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                fs="14px"
                fw="700"
                sx={{
                  textAlign: "center",
                  marginLeft: 1,
                  color: "#FF9D43",
                  cursor: "pointer",
                }}
              >
                Resending... Please wait
              </Text>
            )}
          </Box>
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
