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
import { Helmet } from "react-helmet";

export default function CreditReport() {
  const rows = [
    { name: "Total accounts", trans: 7, experian: 1, equifax: 5 },
    { name: "Open accounts", trans: 8, experian: 5, equifax: 9 },
    { name: "Closed accounts", trans: 1, experian: 4, equifax: 2 },
    { name: "Collection accounts", trans: "-", experian: "-", equifax: "-" },
    { name: "Delinquent accounts", trans: "-", experian: "-", equifax: "-" },
    { name: "Derogatory accounts", trans: "-", experian: "-", equifax: "-" },
    {
      name: "Total balance",
      trans: "$678,507.00",
      experian: "$587,788.02",
      equifax: "$587,788.02",
    },
    {
      name: "Total payments",
      trans: "$678,507.00",
      experian: "$587,788.02",
      equifax: "$587,788.02",
    },
    { name: "Public records", trans: "-", experian: "-", equifax: "-" },
    { name: "Total inquiries", trans: 7, experian: 0, equifax: 0 },
  ];
  return (
    <Box>
      <Helmet>
        <title>Credit Report</title>
      </Helmet>
      <Stack direction="row" justifyContent="space-between">
        {["transM.svg", "experianM.svg", "equifaxM.svg"].map((item, index) => (
          <Box
            component="img"
            src={`/assets/images/${item}`}
            key={index}
            width={{ xs: "120px", sm: "250px" }}
          />
        ))}
      </Stack>

      <TableContainer sx={{ bgcolor: '#fff', mt:4 }}>
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
            {rows.map((row, index) => (
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
  );
}
