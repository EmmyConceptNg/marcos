import { Box, Modal, Stack, TextField } from "@mui/material";
import { useState } from "react";
import Text from "../Text";
import Button from "../Button";
import BuyCreditModal from "./BuyCreditModal";
import PropTypes from "prop-types";
import { PDFDocument, rgb } from "pdf-lib";
import { Api } from "@mui/icons-material";
import axios from "../../api/axios";
import { notify } from "../../utils/Index";
import { setUser } from "../../redux/UserReducer";
import { useDispatch } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  bgcolor: "background.paper",
  boxShadow: "2px 5px 5px #131C30",
  p: 4,
};

// Utility functions for base64 encoding/decoding
const base64ToUint8Array = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const uint8ArrayToBase64 = (uint8Array) => {
  let binaryString = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  return window.btoa(binaryString);
};

export default function ReportModal({
  open,
  setOpen,
  dataUrl,
}) {
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  // console.log(dataUrl);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack spacing={3} sx={style}>
          <Box
            sx={{
              p: 4,
              bgcolor: "white",
              borderRadius: 1,
              mx: "auto",
            }}
          >
            <Text variant="h6">Credit Report</Text>
          </Box>
          <iframe
            src={`data:application/pdf;base64,${dataUrl}`}
            title="PDF Letter"
            width="100%"
            height="500px"
          ></iframe>
        </Stack>
      </Modal>
    </>
  );
}

ReportModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  path: PropTypes.string,
};
