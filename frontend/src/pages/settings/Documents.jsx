import React, { useState } from "react";
import {
  Box,
  Stack,
  Button as MuiButton,
  TextField,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Modal,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import PropTypes from "prop-types";
import { notify } from "../../utils/Index";
import { setUser } from "../../redux/UserReducer";
import { ToastContainer } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "../../components/Button";
import Text from "../../components/Text";
import DocumentModal from "../../components/modal/DocumentModal";
import DocumentIcon from "../../components/svgs/DocumentIcon";
import EditDocIcon from "../../components/svgs/EditDocIcon";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ReportModal from "../../components/modal/ReportModal";
import { hasID, hasProofOfAddress } from "../../utils/helper";

export default function Documents() {
  const user = useSelector((state) => state.user.details);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState("");

  const navigate = useNavigate();

  const handleDocumetModal = () => {
    setOpenModal(true);
  };

  const fetchReport = async (filePath) => {
    try {
      const response = await axios.get(filePath, { responseType: "blob" });
      const file = response.data;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        setPdfDataUrl(base64data);
      };
    } catch (error) {
      notify("Error fetching PDF data", "error");
      console.log(error);
    }
  };

  const handleReportModal = async () => {
    if (user?.creditReport?.filePath) {
      const fileExtension = user.creditReport.filePath.split(".").pop();
      if (fileExtension === "pdf") {
        await fetchReport(user?.creditReport?.filePath);
        setOpenReport(true);
      } else if (fileExtension === "html") {
        window.open(user.creditReport.filePath, "_blank");
      }
    } else {
      notify("No credit report available", "info");
    }
  };

  const rows = [
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
  ];

  const handleUploadFromComputer = () => {
    if (!hasProofOfAddress(user) || !hasID(user)) {
      notify("You need to upload a proof of address and a valid ID", "info");
      setTimeout(() => {
        navigate("/dashboard/settings?proof=true");
      }, 2000);

      return false;
    }
    if (!user.ssn) {
      notify("You need to enter your Social Security Number", "info");
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 2000);
      return false;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.html";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileType = file.type;
        const validTypes = ["application/pdf", "text/html"];
        if (validTypes.includes(fileType)) {
          const formData = new FormData();
          formData.append("file", file);

          await axios
            .post(`/api/creditreport/upload/${user?._id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              notify(response.data.success, "success");
              dispatch(setUser(response.data.user));
            })
            .catch((error) => {
              notify(
                error.response?.data.error || "Error Uploading Credit Report",
                "error"
              );
            });
        } else {
          alert("Only PDF and HTML files are allowed.");
        }
      }
    };

    fileInput.click();
  };

  return (
    <Box mt={3} px={3} pb={3}>
      <ToastContainer />
      <DocumentModal open={openModal} setOpen={setOpenModal} />
      <ReportModal
        open={openReport}
        setOpen={setOpenReport}
        dataUrl={pdfDataUrl}
      />
      <Stack direction="row" justifyContent="space-between">
        <Text fw="500" fs="24px">
          Identification
        </Text>
        <Button
          width="150px"
          height="44px"
          color="#475467"
          variant="outlined"
          onClick={handleDocumetModal}
        >
          + Add document
        </Button>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid container spacing={2}>
          {user?.documents?.map((document, index) => (
            <Grid item lg={4} md={6} xs={12} key={index}>
              <Doc name={document.name} path={document.path} user={user?._id} />
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Credit report
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {[
                  "Report Date ",
                  "Report ID",
                  "Confirmation No.",
                  "Receipt",
                  "Action",
                ].map((item, index) => (
                  <TableCell key={index}>
                    <Text fs="12px" fw="550" color="#475467">
                      {item}
                    </Text>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      fontSize: "15px",
                      color: "#475467",
                      fontWeight: "550",
                    }}
                    component="th"
                    scope="row"
                  >
                    {moment(user?.creditReport?.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "15px",
                      color: "#475467",
                      fontWeight: "400",
                    }}
                    align="left"
                  >
                    {user?.creditReport?._id?.slice(0, 6)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "15px",
                      color: "#475467",
                      fontWeight: "400",
                    }}
                    align="left"
                  >
                    {moment(user?.creditReport?.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "15px",
                      color: "#475467",
                      fontWeight: "400",
                    }}
                    align="left"
                  >
                    <Box sx={{ cursor: "pointer" }}>
                      <DocumentIcon />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "15px",
                      color: "#475467",
                      fontWeight: "400",
                    }}
                    align="left"
                  >
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ cursor: "pointer" }}>
                        <VisibilityIcon onClick={handleReportModal} />
                      </Box>
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={handleUploadFromComputer}
                      >
                        <EditDocIcon />
                      </Box>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Credit monitoring credentials
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Credit monitoring name"
            value="Charlene Reed"
            fullWidth
          />
          <TextField label="User Name" value="Charlene Reed" fullWidth />
        </Stack>
        <Stack direction="row" spacing={2} mt={2}>
          <TextField
            label="Password"
            type="password"
            value="********"
            fullWidth
          />
          <TextField label="Other" value="charlenereed@gmail.com" fullWidth />
        </Stack>
        <Box mt={2} textAlign="right">
          <MuiButton variant="contained" color="secondary">
            Save
          </MuiButton>
        </Box>
      </Box>
    </Box>
  );
}

const Doc = ({ name, path, user }) => {
  const displayName = name?.replace(/_/g, " ");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/api/utils/remove-document/", { user, path })
          .then((response) => {
            dispatch(setUser(response.data.user));
            Swal.fire({
              title: "Deleted!",
              text: "Document file has been deleted.",
              icon: "success",
            });
          });
      }
    });
  };

  return (
    <>
      <Card sx={{ height: "192px", position: "relative" }}>
        <CardContent>
          <Box
            component="img"
            src={path}
            alt={name}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 1,
              filter: "blur(8px)",
            }}
          />
          <IconButton
            onClick={handleOpen}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </CardContent>
      </Card>
      <Stack p={2} direction="row" justifyContent="space-between">
        <Typography sx={{ textTransform: "capitalize", fontSize: "18px" }}>
          {displayName}
        </Typography>
        <Typography
          onClick={handleDelete}
          sx={{
            textTransform: "capitalize",
            fontSize: "18px",
            color: "#EE4C4C",
            cursor: "pointer",
          }}
        >
          Delete
        </Typography>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            component="img"
            src={path}
            alt={name}
            sx={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Modal>
    </>
  );
};
Doc.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};
