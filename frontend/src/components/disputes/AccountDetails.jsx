import { Box, Checkbox, Stack, Typography } from "@mui/material";

export function AccountDetails({
  bureau,
  details,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
  onCustomMessageChange,
  customMessage,
  status,
}) {
  const displayDetails = details.map((detail, index) => (
    <Typography
      key={index}
      sx={{ fontSize: "14px", fontWeight: "400", color: "#475467" }}
    >
      {detail}
    </Typography>
  ));

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
                !!checkboxStates?.accounts?.[status]?.[infoIndex]?.[bureau]
              }
              onChange={() =>
                onCheckboxChange("accounts", infoIndex, bureau, status)
              }
              sx={{
                color: "#FF9D43",
                "&.Mui-checked": {
                  color: "#FF9D43",
                },
              }}
            />
            <input
              type="text"
              placeholder="Add a custom message"
              value={customMessage || ""}
              onChange={(event) =>
                onCustomMessageChange(infoIndex, event.target.value)
              }
              style={{
                flexGrow: 1,
                padding: "10px",
                marginLeft: "10px",
                borderRadius: "5px",
                border: "1px solid #CDCDCD",
                background: "#fff",
              }}
            />
          </Stack>
          {displayDetails}
        </Stack>
      </Box>
    </Box>
  );
}
