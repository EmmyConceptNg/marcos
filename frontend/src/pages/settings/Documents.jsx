import {
  Box,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  styled,
} from "@mui/material";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Text from "../../components/Text";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import PropTypes from "prop-types";
import { notify } from "../../utils/Index";
import { useState } from "react";
import { setUser } from "../../redux/UserReducer";

export default function Documents() {
  const user = useSelector((state) => state.user.details);

  const dispatch = useDispatch();

  return (
    <Box mt={3}>
      {/* Preferences Form */}
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
        const fileType = file.type;

        const formData = new FormData();
        formData.append("idCard", file);

        await axios
          .post(`/api/auth/upload-id/${user?._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            notify(response.data.success, "success");
            dispatch(setUser(response.data.user));
            //  dispatch(setUser(response.data.user));
          })
          .catch((error) => {
            notify(error.response?.data.error, "error");
          });
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
      >
        {!user?.id ? (
          <Stack spacing={2} justifyContent="center" alignItems="flex-start">
            <Text
              color="#131C30"
              fs={{ sm: "16px", xs: "16px" }}
              sx={{ textAlign: "center" }}
              fw="400"
            >
              Please Upload a valid ID card
            </Text>
            <Button
              variant="contained"
              width="150px"
              onClick={() => handleIDCard()}
            >
              Upload
            </Button>
          </Stack>
        ) : (
          <Box component="img" src={user.id} />
        )}
      </Box>
      {user?.id && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            width="150px"
            height="30px"
            onClick={() => handleIDCard()}
          >
            Replace
          </Button>
        </Box>
      )}
    </Box>
  );
}
function Address({ user }) {
  const dispatch = useDispatch();
  const handleIDCard = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpeg,.jpg";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("address", file);

        await axios
          .post(`/api/auth/upload-address/${user?._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            notify(response.data.success, "success");
            dispatch(setUser(response.data.user));
            //  dispatch(setUser(response.data.user));
          })
          .catch((error) => {
            notify(error.response?.data.error, "error");
          });
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
      >
        {!user?.proofOfAddress ? (
          <Stack spacing={2} justifyContent="center" alignItems="flex-start">
            <Text
              color="#131C30"
              fs={{ sm: "16px", xs: "16px" }}
              sx={{ textAlign: "center" }}
              fw="400"
            >
              Please Upload a proof of address
            </Text>
            <Button
              variant="contained"
              width="150px"
              onClick={() => handleIDCard()}
            >
              Upload
            </Button>
          </Stack>
        ) : (
          <Box component="img" src={user.proofOfAddress} />
        )}
      </Box>
      {user?.proofOfAddress && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            width="150px"
            height="30px"
            onClick={() => handleIDCard()}
          >
            Replace
          </Button>
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

        await axios
          .post(`/api/auth/upload-signature/${user?._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            notify(response.data.success, "success");
            dispatch(setUser(response.data.user));
            //  dispatch(setUser(response.data.user));
          })
          .catch((error) => {
            notify(error.response?.data.error, "error");
          });
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
      >
        {!user?.signaturePath ? (
          <Stack spacing={2} justifyContent="center" alignItems="flex-start">
            <Text
              color="#131C30"
              fs={{ sm: "16px", xs: "16px" }}
              sx={{ textAlign: "center" }}
              fw="400"
            >
              Please Upload a signature
            </Text>
            <Button
              variant="contained"
              width="150px"
              onClick={() => handleSignature()}
            >
              Upload
            </Button>
          </Stack>
        ) : (
          <Box component="img" src={user.signaturePath} />
        )}
      </Box>
      {user?.signaturePath && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            width="150px"
            height="30px"
            onClick={() => handleSignature()}
          >
            Replace
          </Button>
        </Box>
      )}
    </Box>
  );
}

ID.propTypes = {
  user: PropTypes.object,
};
Address.propTypes = {
  user: PropTypes.object,
};
Signature.propTypes = {
  user: PropTypes.object,
};
