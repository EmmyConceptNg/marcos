import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Helmet } from "react-helmet";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import { CloudDownload, Download } from "@mui/icons-material";
import DocumentIcon from "../../../components/svgs/DocumentIcon";
import EditDocIcon from "../../../components/svgs/EditDocIcon";
import { useState } from "react";
import SearchInput from "../../../components/Search";

export default function Reports() {
  const [ tab, setTab ] = useState("View all");
  const rows = [
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
    {
      reportDate: "10.04.2024",
      reportId: "#96816",
      confirmationNo: "1000025",
    },
  ];
  return (
    <Box>
      <Helmet>
        <title>Credit Report</title>
      </Helmet>

      <TableContainer sx={{ bgcolor: "#fff", mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" p={3}>
          <Text fw="550" fs="20px">
            Reports List
          </Text>
          <Button
            variant="outlined"
            width="126px"
            height="40px"
            sx={{ color: "#344054", borderColor: "#D0D5DD" }}
            startIcon={<CloudDownload />}
          >
            Download
          </Button>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" p={3}>
          <Stack direction="row" sx={{ width: { sm: "314px", xs: "100%" } }}>
            {[
              {
                name: "View all",
                sx: {
                  width: "82px",
                  height: "40px",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                  cursor: "pointer",
                  border: "1px solid #D0D5DD",
                },
              },
              {
                name: "Monitored",
                sx: {
                  width: "99px",
                  height: "40px",
                  cursor: "pointer",
                  border: "1px solid #D0D5DD",
                },
              },
              {
                name: "Unmonitored",
                sx: {
                  width: "117px",
                  height: "40px",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  cursor: "pointer",
                  border: "1px solid #D0D5DD",
                },
              },
            ].map((item, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor={tab === item.name ? "#D0D5DD" : "#fff"}
                onClick={() => {
                  setTab(item.name);
                }}
                sx={item.sx}
              >
                <Text fs="14px" fw="550" color="#1D2939">
                  {item.name}
                </Text>
              </Box>
            ))}
          </Stack>
          <SearchInput
            width="320px"
            height="44px"
            placeholder="Search"
            bgcolor="#fff"
          />
        </Stack>
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
                  sx={{ fontSize: "15px", color: "#475467", fontWeight: "550" }}
                  component="th"
                  scope="row"
                >
                  {row.reportDate}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                  align="left"
                >
                  {row.reportId}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                  align="left"
                >
                  {row.confirmationNo}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                  align="left"
                >
                  <Box sx={{ cursor: "pointer" }}>
                    <DocumentIcon />
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                  align="left"
                >
                  <Box sx={{ cursor: "pointer" }}>
                    <EditDocIcon />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
