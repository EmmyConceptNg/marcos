import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { hasProofOfAddress, hasID, mapToRowsStructure } from "../../../utils/helper";
import ProgressLoader from "../../../components/loader";
import Speedometer from "../../../components/meter";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import { notify } from "../../../utils/Index";
import axios from "../../../api/axios";
import { setUser } from "../../../redux/UserReducer";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function CreditReport() {
  const dispatch = useDispatch()
  const [isUploading, setIsUploading] = useState(false)
  const user = useSelector((state) => state.user.details);
  const [report, setReport] = useState([]);
  const [creditScore, setCreditScore] = useState({
    TUC: "0",
    EXP: "0",
    EQF: "0",
  });

  useEffect(() => {
    // setReport(mapToRowsStructure(user?.creditReport?.creditReportData));
    if (user && user.creditReport && user.creditReport.creditReportData) {
      const summaryData = user.creditReport.creditReportData["summary"];
      setReport(mapToRowsStructure(summaryData));



      //Credit score    
      const creditScoreArray =
        user.creditReport.creditReportData["credit_score"] ||
        user.creditReport.creditReportData["fico®_score"];
      if (creditScoreArray && creditScoreArray.length > 0) {
        const creditScoreObject = creditScoreArray.find(
          (entry) =>
            entry.label === "Credit Score:" || entry.label === "FICO® Score 8:"
        );
        if (creditScoreObject) {
          const creditScoreData = creditScoreObject.data; 
          setCreditScore(creditScoreData);
        } else {
          console.log("Credit Score not found.");
        }
      } else {
        console.log("No credit score data available.");
      }
    } else {
      console.log("Summary data not found");
    }


  }, [user]);

  const navigate = useNavigate()


  const handleUploadFromComputer = () => {
    if (!hasID(user) || !hasProofOfAddress(user)) {
      notify("You need to upload a proof of address and a valid ID", "info");
      setTimeout(() => {
        navigate("/dashboard/settings?proof=true");
      }, 2000);

      return false;
    }
    if(!user.ssn){
      notify('You need to enter your Social Security Number', 'info');
       setTimeout(() => {
         navigate("/dashboard/settings");
       }, 2000);
      return false;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.html";

    fileInput.onchange = async (e) => {
      setIsUploading(true)
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
              dispatch(setUser(response.data.user))
            })
            .catch((error) => {
              notify(error.response?.data.error || 'Error Uploading Credit Report', "error");
            }).finally(() =>{
              setIsUploading(false);
            })
        } else {
          alert("Only PDF and HTML files are allowed.");
        }
      }
    };

    fileInput.click();
  };
  
  return (
    <Box>
      <ToastContainer />
      <Helmet>
        <title>Credit Report</title>
      </Helmet>
      {user?.creditReport ? (
        <Box>
          <Stack direction="row" justifyContent="flex-end" mb={5}>
            <Button
              loading={isUploading}
              variant="contained"
              width="200px"
              dropdown
              dropdownItems={[
                {
                  text: "Upload from Computer",
                  onClick: () => handleUploadFromComputer(),
                },
                {
                  text: "One click Upload (pro)",
                  onClick: () => console.log("Option 2 clicked"),
                },
              ]}
            >
              Upload New Report
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            {[
              { name: "TUC", image: "trans.svg", value: creditScore?.TUC },
              { name: "EXP", image: "experian.svg", value: creditScore?.EXP },
              { name: "EQF", image: "equifax.svg", value: creditScore?.EQF },
            ].map((item, index) => (
              <>
                <ProgressLoader
                  key={index}
                  value={+item.value || 0}
                  image={
                    <Box
                      component="img"
                      src={`/assets/images/${item.image}`}
                      key={index}
                      width={{ xs: "80px", sm: "100px" }}
                    />
                  }
                />
              </>
            ))}
          </Stack>

          <TableContainer sx={{ bgcolor: "#fff", mt: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {["", "trans.svg", "experian.svg", "equifax.svg"].map(
                    (item, index) => (
                      <TableCell key={index}>
                        {index > 0 ? (
                          <Box component="img" src={`/assets/images/${item}`} />
                        ) : (
                          item
                        )}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {report
                  ?.filter((row) =>
                    [
                      "Total Accounts",
                      "Open Accounts",
                      "Closed Accounts",
                      "Collection",
                      "Delinquent",
                      "Derogatory",
                      "Balances",
                      "Payments",
                      "Public Records",
                      "Inquiries(2 years)",
                    ].includes(row.name)
                  )
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ fontSize: "16px", fontWeight: "550" }}
                        component="th"
                        scope="row"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "16px", fontWeight: "400" }}
                        align="left"
                      >
                        {row.trans}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "16px", fontWeight: "400" }}
                        align="left"
                      >
                        {row.experian}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "16px", fontWeight: "400" }}
                        align="left"
                      >
                        {row.equifax}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box
          sx={{ border: "3px dotted #CDCDCD" }}
          height="200px"
          borderRadius="15px"
          display="flex"
          justifyContent="center"
        >
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Text color="#131C30" fs={{ sm: "16px", xs: "16px" }} fw="400">
              You currently do not have any record. Please upload a credit
              record to see disputes
            </Text>
            <Button
              variant="contained"
              width="150px"
              dropdown
              dropdownItems={[
                {
                  text: "Upload from Computer",
                  onClick: () => handleUploadFromComputer(),
                },
                {
                  text: "One click Upload (pro)",
                  onClick: () => console.log("Option 2 clicked"),
                },
              ]}
            >
              Upload
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
