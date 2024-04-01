import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import Text from "../../components/Text";
import { Box, Checkbox, IconButton, ListItem } from "@mui/material";
import { useState } from "react";
import { Lock } from "@mui/icons-material";

export default function Lists() {
  const [open, setOpen] = useState({});

  const handleClick = (id) => {
    
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <>
      {[1, 2, 3].map((item) => (
        <List
          key={item}
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={() => handleClick(item)}>
            <ListItemText
              primary={
                <Box>
                  <Text fw="600" fs="22px" color="#000">
                    Example Heading
                  </Text>
                  <Text fw="500" fs="18px" color="#000">
                    Example subheading
                  </Text>
                  <Text fw="500" fs="15px" color="#000">
                    10 mins 29 sec
                  </Text>
                </Box>
              }
            />
            {open[item] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open[item]} timeout="auto" unmountOnExit>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {[0, 1, 2, 3].map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                  <ListItem
                    key={value}
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments">
                        <Lock />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(value)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={
                          <Box>
                            <Text fw="600" fs="16px" color="#000">
                              Example subheading
                            </Text>
                            <Text fw="500" fs="15px" color="#999999">
                              10 mins 29 sec
                            </Text>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </List>
      ))}
    </>
  );
}
