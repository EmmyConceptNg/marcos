import { Box, Stack } from "@mui/material";
import LockIcon from "../../../components/svgs/LockIcon";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Password ( ){
    const [sendMailBtn, setSendMailBtn] = useState(false)
    const navigate = useNavigate()
    const submit =(e) =>{
      e.preventDefault()
      navigate("/verification/:email/verified");
    }
    return (
      <Box display="flex" justifyContent="center" component="form" mt={10} onSubmit={submit}>
        <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
          <Stack spacing={3} justifyContent="center" alignItems="center">
            
              <LockIcon />
            
            <Text fw="550" fs="30px" color="#131C30">
              Forgot password?
            </Text>
            <Text fw="400" fs="16px" color="#475467">
              No worries, we’ll send you reset instructions.
            </Text>
            <Input
              width="100%"
              label="Email"
              required={true}
              placeholder="Enter you email"
              aria-label="enter your email"
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
             sx= {{ color:"#475467" }}
              width="100%"
              heigh="44px"
              type="button"
              startIcon={<ArrowBack />} to="/login"
            >
              Back to log in
            </Button>
          </Stack>
        </Box>
      </Box>
    );
}