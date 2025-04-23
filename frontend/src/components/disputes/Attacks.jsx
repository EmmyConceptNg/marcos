import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import { setUser } from "../../redux/UserReducer";
import { Box, Stack } from "@mui/material";
import Button from "../Button";
import Text from "../Text";
import moment from "moment";
import { RoundMenu } from "./RoundMenu";
import NoBalanceModal from "../modal/NoBalanceModal";
import LetterModal from "../modal/LetterModal";

export function Attacks({
  setType,
  handleAttackNow,
  attacking,
  openNoBalance,
  setOpenNoBalance,
}) {
  const user = useSelector((state) => state.user.details);

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [letterContent, setLetterContent] = useState("");
  const [letterPath, setLetterPath] = useState("");
  const [openLetterModal, setOpenLetterModal] = useState(false);
  const [letterBureau, setLetterBureau] = useState("");
  const [mailing, setMailing] = useState(false);

  const dispatch = useDispatch();

  const handleDownloadAll = async () => {
    try {
      const response = await axios({
        url: `/api/letters/download-all/${user?._id}`,
        method: "GET",
        responseType: "blob", // Important to handle binary data correctly
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "DisputeLetters.zip"); // You can specify a dynamic name for the zip file
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // It's important to revoke the created object URL to avoid memory leaks
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  const handleMailLetters = () => {
    setMailing(true);

    if (!user.balance || user.balance === 0) {
      setOpenNoBalance(true);
      setMailing(false);
    }

    Swal.fire({
      title: "Mail Letter!!!",
      text: "are ready to mail the letteres!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Mail Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(`/api/letters/mail-out/${user?._id}`)
          .then((response) => {
            dispatch(setUser(response.data.user));
            Swal.fire({
              title: "Mailed!",
              text: "Document mailed successfully.",
              icon: "success",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: error.response.data.error || "An error occured",
              icon: "error",
            });
          })
          .finally(() => {
            setMailing(false);
          });
      }
    });
  };

  const handleViewLetter = async (letterId) => {
    try {
      const { data } = await axios.get(`/api/letters/${letterId}`);
      console.log("API Response:", data);
      setLetterContent(data.content); // Assuming the response data contains the letter content
      setLetterPath(data.letterPath); // Assuming the response data contains the letter path (PDF base64)
      setLetterBureau(data.bureau);
      setSelectedLetter(letterId);
      setOpenLetterModal(true);
    } catch (error) {
      console.error("Error fetching letter content:", error);
    }
  };

  const handleSaveLetter = async (updatedContent) => {
    try {
      await axios
        .put(`/api/letters/${selectedLetter}`, {
          content: updatedContent,
          // pdfContent: updatedPdfContent, // Assuming your API expects this field
          userId: user._id,
        })
        .then((response) => {
          dispatch(setUser(response.data.user));
          setOpenLetterModal(false);
        });
    } catch (error) {
      console.error("Error updating letter content:", error);
    }
  };

  return (
    <>
      {!user?.letters?.letterPaths?.length &&
      user?.creditReport[0]?.round < 2 ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button variant="contained" onClick={() => setType("disputing")}>
            Start new dispute
          </Button>
        </Box>
      ) : (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Text fs="20px" fw="550" color="#131C30">
                Credit report was uploaded
              </Text>
              <Text fs="20px" fw="700" color="#131C30">
                {moment(user.creditReport[0].createdAt)
                  .startOf("day")
                  .fromNow()}
              </Text>
            </Stack>

            <RoundMenu
              setType={setType}
              user={user}
              handleAttackNow={handleAttackNow}
              attacking={attacking}
            />
          </Stack>

          <Box sx={{ boxShadow: "0px 1px 3px #131C30", bgcolor: "#fff", p: 4 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Text fs="20px" fw="550" color="#131C30">
                  Documents have been generated
                </Text>
                <Text fs="20px" fw="700" color="#131C30">
                  {`(${user?.letters?.letterPaths?.length || 0} Attachments)`}
                </Text>
              </Stack>
              <Stack direction="row" spacing={2}>
                {user?.letters?.letterPaths?.map((letterPath, index) => (
                  <Button
                    width="100%"
                    key={index}
                    variant="outlined"
                    onClick={() => handleViewLetter(letterPath._id)}
                    color="#131C30"
                  >
                    View Letter {index + 1} - {letterPath.bureau}
                  </Button>
                ))}
                <Button
                  width="100%"
                  variant="outlined"
                  onClick={handleDownloadAll}
                  color="#131C30"
                >
                  Download All
                </Button>
                <Button
                  loading={mailing}
                  width="100%"
                  variant="contained"
                  onClick={handleMailLetters}
                >
                  Mail Them Out
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
      <NoBalanceModal open={openNoBalance} setOpen={setOpenNoBalance} />

      <LetterModal
        user={user}
        open={openLetterModal}
        setOpen={setOpenLetterModal}
        letterBureau={letterBureau}
        letterContent={letterContent}
        letterPath={letterPath}
        setLetterPath={setLetterPath}
        setLetterContent={setLetterContent}
        handleSaveLetter={handleSaveLetter}
        selectedLetter={selectedLetter}
        setSelectedLetter={setSelectedLetter}
      />
    </>
  );
}
