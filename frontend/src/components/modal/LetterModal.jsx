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

export default function LetterModal({
  open,
  setOpen,
  letterContent,
  letterPath,
  setLetterPath,
  setLetterContent,
  letterBureau,
  handleSaveLetter,
  selectedLetter,
  user,
}) {
  const handleClose = () => setOpen(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(letterContent);
  const [buyCredit, setBuyCredit] = useState(false);
  const [changingLanguage, setChangingLanguage] = useState(false);

  const dispatch = useDispatch();

  console.log("modal", letterPath);

  const startEditing = () => {
    setIsEditing(true);
    setEditContent(letterContent); // Initialize with current letter content
  };

  const saveEditing = async () => {
    try {
      console.log("Original letterPath:", letterPath);
      console.log("Decoded letterPath:", atob(letterPath));

      const pdfBytes = base64ToUint8Array(letterPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const firstPage = pdfDoc.getPages()[0];
      const { width, height } = firstPage.getSize();

      // Clear existing content before adding new text
      firstPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(1, 1, 1),
      });

      firstPage.drawText(editContent, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      });

      const newPdfBytes = await pdfDoc.save();
      const modifiedBase64 = uint8ArrayToBase64(new Uint8Array(newPdfBytes));

      setLetterContent(editContent); // Update the text content
      await handleSaveLetter(editContent, modifiedBase64); // Save both content and updated PDF
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving editing:", error);
    }
  };

  const changeLanguage = (language) => {
    setChangingLanguage(true);
    axios
      .post("/api/utils/language", { language, letterContent })
      .then((response) => {
        setEditContent(response.data.letterContent);
        setChangingLanguage(false);
      })
      .finally(() => {
        notify(`language changed to ${language} `, "success");
        setChangingLanguage(false);
      });
  };

  const handleNotarize = () => {
    setChangingLanguage(true);
    axios
      .post(`/api/letters/${selectedLetter}/notarize`, { userId: user?._id })
      .then((response) => {
        setLetterPath(response.data.letterPath);
        dispatch(setUser(response.data.user));
        notify(`Letter Notarized`, "success");
      })
      .finally(() => {
        handleClose();
      });
  };

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
            <Text variant="h6">Letter Content for {letterBureau}</Text>
            {!isEditing ? (
              <>
                <iframe
                  src={`data:application/pdf;base64,${letterPath}`}
                  title="PDF Letter"
                  width="100%"
                  height="500px"
                ></iframe>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    color="#131C30"
                  >
                    Cancel
                  </Button>
                  <Stack direction="row" justifyContent="" spacing={2}>
                    <Button variant="contained" onClick={handleNotarize}>
                      Notarize
                    </Button>
                    <Button variant="contained" onClick={startEditing}>
                      Edit
                    </Button>
                  </Stack>
                </Box>
              </>
            ) : (
              <>
                <TextField
                  multiline
                  rows={10}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ marginTop: "20px", marginBottom: "20px" }}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    color="#131C30"
                  >
                    Cancel
                  </Button>
                  <Stack spacing={2} direction="row">
                    <Button
                      variant="outlined"
                      loading={changingLanguage}
                      width="165px"
                      sx={{ mx: 3 }}
                      color="#131C30"
                      dropdown
                      dropdownItems={[
                        {
                          text: "English",
                          onClick: () => changeLanguage("english"),
                        },
                        {
                          text: "Spanish",
                          onClick: () => changeLanguage("spanish"),
                        },
                      ]}
                    >
                      Change Language
                    </Button>
                    <Button variant="contained" onClick={saveEditing}>
                      Save
                    </Button>
                  </Stack>
                </Box>
              </>
            )}
          </Box>
        </Stack>
      </Modal>
      <BuyCreditModal open={buyCredit} setOpen={setBuyCredit} />
    </>
  );
}

LetterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  handleSaveLetter: PropTypes.func,
  setLetterContent: PropTypes.func,
  letterContent: PropTypes.string,
  letterBureau: PropTypes.string,
  selectedLetter: PropTypes.string,
  letterPath: PropTypes.string, // Ensure this is passed as a base64 encoded string
};
