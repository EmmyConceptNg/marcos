import { Box, Tab, Tabs, styled } from "@mui/material";
import { useState } from "react";
import Text from "../../components/Text";
import Profile from "./Profile";
import Preferences from "./Preferences";
import Security from "./Security";

export default function Settings() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: "100%" }}
      bgcolor="#fff"
      p={{ sm: 3, xs: 1 }}
      borderRadius="15px"
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="settings tabs"
        TabIndicatorProps={{
          sx: {
            backgroundColor: "#FF9D43",
          },
        }}
        sx={{
          ".MuiTabs-indicator": {
            height: "4px",
            borderRadius: "2px",
          },
        }}
      >
        {[
          { label: "Edit Profile" },
          { label: "Preferences" },
          { label: "Security" },
        ].map((item, index) => (
          <SettingsTab key={index} label={item.label} />
        ))}
      </Tabs>
      {value === 0 && (
        <TabPanel index={0}>
          <Profile />
        </TabPanel>
      )}
      {value === 1 && (
        <TabPanel index={1}>
          <Preferences />
        </TabPanel>
      )}
      {value === 2 && (
        <TabPanel index={2}>
          <Security />
        </TabPanel>
      )}
    </Box>
  );
}

const SettingsTab = styled(Tab)({
  textTransform: "none",
  fontWeight: "550",
  fontSize: "16px",
  color: "#B7B7B7",
  "&.Mui-selected": {
    color: "#FF9D43",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 100, 100, 0.1)",
  },
});

function TabPanel(props) {
  const { children, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={false} // The hidden prop is not necessary because we're conditionally rendering the TabPanel already
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>
        <Text>{children}</Text>
      </Box>
    </div>
  );
}
