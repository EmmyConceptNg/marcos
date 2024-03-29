import {
  Box,

  Divider,
  FormControlLabel,

  IconButton,
  
  List,
  ListItem,
  
  ListItemText,
  
  Switch,
} from "@mui/material";

import { ArrowBackIos } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Text from "../../components/Text";

export default function Notification() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const navigate = useNavigate();

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#1166EA",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  return (
    <>
      <Box
        borderBottom="1px solid #D9D9D9 "
        mb={3}
        display="flex"
        alignItems="center"
      >
        <Box display={"flex"} gap={2} alignItems="center" sx={{ mb: "20px" }}>
          <IconButton sx={{ my: "auto" }} onClick={() => navigate(-1)}>
            <ArrowBackIos sx={{ color: "#1A1A1A" }} />
          </IconButton>
          <Text fw="600" fs="22px">
            Notification
          </Text>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <List
          sx={{
            border: "1px solid #D9D9D9",
            width: "730px",
            borderRadius: "8px",
            py: 0,
          }}
        >
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#F2F2F2" },
              backgroundColor: "#F2F2F2",
            }}
          >
            <ListItemText
              primary={
                <Text
                  fs="20px"
                  fw="500"
                  sx={{ cursor: "pointer" }}
                  color="#000"
                >
                  Notify me when
                </Text>
              }
            />
          </ListItem>
          <Divider />
          {[
            { name: "Option 1" },
            {
              name: "Option 2",
            },
            { name: "Option 3" },
            { name: "Option 4" },
            { name: "Option 5" },
          ].map((item, index) => (
            <>
              <ListItem
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#F2F2F2" },
                }}
                key={index}
                secondaryAction={
                  <FormControlLabel
                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                  />
                }
              >
                <ListItemText
                  primary={
                    <Text fs="18px" fw="500" sx={{ cursor: "pointer" }}>
                      {item.name}
                    </Text>
                  }
                />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Box>
    </>
  );
}
