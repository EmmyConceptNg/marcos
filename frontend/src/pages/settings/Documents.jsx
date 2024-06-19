import React from "react";
import { Box, Stack, Button as MuiButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios, { getImageUrl } from "../../api/axios";
import PropTypes from "prop-types";
import { notify } from "../../utils/Index";
import { setUser } from "../../redux/UserReducer";
import Text from "../../components/Text";
import { ToastContainer } from "react-toastify";

export default function Documents() {
  const user = useSelector((state) => state.user.details);
  const dispatch = useDispatch();

  return (
    <Box mt={3}>
      <ToastContainer />
      <Stack
        direction={{ sm: "row", xs: "column" }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <ID user={user} />
        <Address user={user} />
        <Signature user={user} />
      </Stack>
    </Box>
  );
}

function ID({ user }) {
  const dispatch = useDispatch();

  const handleIDCard = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpeg,.jpg";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("idCard", file);

        try {
          const response = await axios.post(
            `/api/auth/upload-id/${user?._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          notify(response.data.success, "success");
          dispatch(setUser(response.data.user));
        } catch (error) {
          notify(error.response?.data.error, "error");
        }
      }
    };

    fileInput.click();
  };

  return (
    <Box width="100%">
      <Box
        sx={{ border: "1px solid #CDCDCD" }}
        height="300px"
        width="100%"
        borderRadius="15px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {!user?.id ? (
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Text
              color="#131C30"
              fs={{ sm: "16px", xs: "16px" }}
              sx={{ textAlign: "center" }}
              fw="400"
            >
              Please Upload a valid ID card
            </Text>
            <MuiButton variant="contained" width="150px" onClick={handleIDCard}>
              Upload
            </MuiButton>
          </Stack>
        ) : (
          <img src={user.id} alt="User ID" height="300px" width="100%" />
        )}
      </Box>
      {user?.id && (
        <Box display="flex" justifyContent="center" mt={3}>
          <MuiButton
            variant="contained"
            width="150px"
            height="30px"
            onClick={handleIDCard}
          >
            Replace
          </MuiButton>
        </Box>
      )}
    </Box>
  );
}

function Address({ user }) {
  const dispatch = useDispatch();

  const handleProofOfAddress = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpeg,.jpg";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("address", file);

        try {
          const response = await axios.post(
            `/api/auth/upload-address/${user?._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          notify(response.data.success, "success");
          dispatch(setUser(response.data.user));
        } catch (error) {
          notify(error.response?.data.error, "error");
        }
      }
    };

    fileInput.click();
  };

  return (
    <Box width="100%">
      <Box
        sx={{ border: "1px solid #CDCDCD" }}
        height="300px"
        width="100%"
        borderRadius="15px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {!user?.proofOfAddress ? (
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Text
              color="#131C30"
              fs={{ sm: "16px", xs: "16px" }}
              sx={{ textAlign: "center" }}
              fw="400"
            >
              Please Upload a proof of address
            </Text>
            <MuiButton
              variant="contained"
              width="150px"
              onClick={handleProofOfAddress}
            >
              Upload
            </MuiButton>
          </Stack>
        ) : (
          <img
            src={user.proofOfAddress}
            alt="Proof of Address"
            height="300px"
            width="100%"
          />
        )}
      </Box>
      {user?.proofOfAddress && (
        <Box display="flex" justifyContent="center" mt={3}>
          <MuiButton
            variant="contained"
            width="150px"
            height="30px"
            onClick={handleProofOfAddress}
          >
            Replace
          </MuiButton>
        </Box>
      )}
    </Box>
  );
}

function Signature({ user }) {
  const dispatch = useDispatch();

  const handleSignature = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpeg,.jpg";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("signature", file);

        try {
          const response = await axios.post(
            `/api/auth/upload-signature/${user?._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          notify(response.data.success, "success");
          dispatch(setUser(response.data.user));
        } catch (error) {
          notify(error.response?.data.error, "error");
        }
      }
    };

    fileInput.click();
  };

  return (
    <Box width="100%">
      <Box
        sx={{ border: "1px solid #CDCDCD" }}
        height="300px"
        width="100%"
        borderRadius="15px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {!user?.signaturePath ? (
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Text
              color="#131C30"
              fs={{ sm: "16px", xs: "16px" }}
              sx={{ textAlign: "center" }}
              fw="400"
            >
              Please Upload a signature
            </Text>
            <MuiButton
              variant="contained"
              width="150px"
              onClick={handleSignature}
            >
              Upload
            </MuiButton>
          </Stack>
        ) : (
          <img
            src={user.signaturePath}
            alt="Signature"
            height="300px"
            width="100%"
          />
        )}
      </Box>
      {user?.signaturePath && (
        <Box display="flex" justifyContent="center" mt={3}>
          <MuiButton
            variant="contained"
            width="150px"
            height="30px"
            onClick={handleSignature}
          >
            Replace
          </MuiButton>
        </Box>
      )}
    </Box>
  );
}

ID.propTypes = {
  user: PropTypes.object.isRequired,
};
Address.propTypes = {
  user: PropTypes.object.isRequired,
};
Signature.propTypes = {
  user: PropTypes.object.isRequired,
};
