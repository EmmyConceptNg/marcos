import { Box, Checkbox, Stack, Typography } from "@mui/material";

export function InquiryBox({
  bureau,
  inquiries,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
}) {
  const { creditor_name, data } = inquiries;
  const isChecked = checkboxStates?.inquiries?.[bureau]?.[infoIndex] || false;

  return (
    <Box display="flex" flexDirection="row" marginBottom={2}>
      <Box
        border="1px solid #FF9D43"
        borderRadius="10px"
        padding={2}
        width="300px"
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Checkbox
              checked={
                checkboxStates?.inquiries?.[bureau]?.[infoIndex] || false
              }
              onChange={() => onCheckboxChange("inquiries", infoIndex, bureau)}
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <Box>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
              >
                <span style={{ fontWeight: "bold" }}>{creditor_name}</span> -{" "}
                {bureau}
              </Typography>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
              >
                {data.date_of_enquiry}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
