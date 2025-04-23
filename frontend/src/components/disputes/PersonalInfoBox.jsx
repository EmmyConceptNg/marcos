import { Box, Checkbox, Stack, Typography } from "@mui/material";

export function PersonalInfoBox({
  personalInfo,
  infoIndex,
  onCheckboxChange,
  checkboxStates,
}) {
  const { label, data } = personalInfo;

  // Define the labels you want to display
  const displayLabels = [
    "Name:",
    "Name",
    "Also Known As",
    "Also Known As:",
    "Date of Birth:",
    "Date of Birth",
    "Current Address(es):",
    "Current Address",
    "Current Address:",
    "Previous Address",
    "Previous Address:",
    "Previous Address(es):",
  ];

  // Check if the current label should be displayed
  if (!displayLabels.includes(label)) {
    return null; // Return null if the label is not in the display list
  }

  return (
    <>
      {Object.entries(data).map(([bureau, value]) => {
        const isChecked =
          checkboxStates?.personalInfo?.[infoIndex]?.[bureau] || false;

        return (
          <Box key={bureau} display="flex" flexDirection="row" marginBottom={2}>
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
                      checkboxStates?.personalInfo?.[infoIndex]?.[bureau] ||
                      false
                    }
                    onChange={() =>
                      onCheckboxChange("personalInfo", infoIndex, bureau)
                    }
                    sx={{
                      color: "#FF9D43",
                      "&.Mui-checked": {
                        color: "#FF9D43",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#475467",
                    }}
                  >
                    {label} -{" "}
                    <span style={{ fontWeight: "bold" }}>{value}</span>
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#475467",
                    }}
                  >
                    {bureau}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
