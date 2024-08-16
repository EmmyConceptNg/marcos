import { Icon } from "@iconify/react";
import { Avatar, Badge, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { EditOutlined, Logout, PersonAdd, PersonOutlined, Settings } from "@mui/icons-material";


import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../api/axios";
import Text from "../../Text";
import SearchInput from "../../Search";
import NotificationIcon from "../../svgs/NotificationIcon";


export default function Nav(){

  const user = useSelector((state) => state.user.details);

  useEffect(() =>{
    if(!user){
      navigate('/login')
    }
  })
  const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const dispatch = useDispatch();
    const handleLogout = () =>{
      dispatch({type : 'LOGOUT' })
      navigate('/login')
      handleClose();
    }
    return (
      <>
        <Box display={{ xs: "none", sm: "flex" }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <SearchInput
              height="50px"
              rounded
              placeholder="search for something"
            />
            <NotificationIcon />

            <Box display="flex" alignItems="center">
              <IconButton
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  onClick={handleClick}
                  sx={{ width: "40px", height: "40px" }}
                  src={user?.image ?? null}
                />
              </IconButton>
            </Box>
          </Stack>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          sx={{ p: 3 }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Box>
              <Text ml={2} fw="600" fs="24px" color="#1A1A1A">
                {user?.fullName ?? ""}
              </Text>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/dashboard/settings");
            }}
          >
            <ListItemIcon>
              <PersonOutlined fontSize="small" />
            </ListItemIcon>
            View my Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Icon
                style={{ fontSize: "20px", color: "#1A1A1A" }}
                icon="material-symbols-light:mode-off-on"
              />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </>
    );
}