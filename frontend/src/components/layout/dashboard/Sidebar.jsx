import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { BusinessMenuItems, MenuItems, Settings } from "./MenuItems";
import { useNavigate, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
import Text from "../../Text";
import { formatCurrency } from "../../../utils/helper";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);

  const user = useSelector((state) => state.user.details);

  const handleClick = (_id, link) => {
    setId((prevId) => (_id === prevId ? "" : _id));
    setOpen((prevOpen) => (_id === id ? !prevOpen : true));
    if (_id !== id) {
      navigate(link);
    }
  };

  return (
    <div className="myScrollBox" style={{ overflowY: "scroll" }}>
      <Box>
        <Box display="flex" mt={2}>
          <Box
            component="img"
            src="/assets/logo/logo.svg"
            width="53px"
            height="53px"
            sx={{ ml: 3 }}
          />
        </Box>

        <Box mt={5}>
          {user?.subscriptionPlan.name === "Basic" ||
          user?.subscriptionPlan.name === "Pro"
            ? MenuItems.map((item) => {
                const selected = location.pathname.includes(item?.link);
                return (
                  <Box key={item.id}>
                    <ListItemButton
                      sx={{
                        px: 0,
                        backgroundColor:
                          item.link && item?.link?.includes(location.pathname)
                            ? "transparent !important"
                            : "#fff",
                      }}
                      onClick={() => {
                        item?.modal
                          ? setOpenModal(true)
                          : handleClick(item.id, item?.link);
                      }}
                      selected={
                        item.link && item?.link?.includes(location.pathname)
                      }
                    >
                      <ListItemIcon>
                        {selected && (
                          <Box
                            sx={{
                              borderTopRightRadius: "10px",
                              borderBottomRightRadius: "10px",
                            }}
                            bgcolor="#FF9D43"
                            width="6px"
                          />
                        )}
                        <Box ml={2} py={1} my="auto">
                          <Icon
                            style={{
                              fontSize: "25px",
                              color: selected ? "#FF9D43" : "#B7B7B7",
                            }}
                            icon={item.icon}
                          />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Text
                            fw="550"
                            fs="18px"
                            color={
                              location.pathname.includes(item?.link)
                                ? "#FF9D43"
                                : "#B7B7B7"
                            }
                          >
                            {item.name}
                          </Text>
                        }
                      />
                      {item.group &&
                        (open && id === item.id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        ))}
                    </ListItemButton>
                    {item.group && (
                      <Collapse
                        in={open && id === item.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {item.group.map((_item, index) => (
                            <ListItemButton
                              key={index}
                              sx={{ pl: 9 }}
                              onClick={() => {
                                navigate(_item?.link);
                              }}
                              selected={location.pathname.includes(_item?.link)}
                            >
                              <ListItemText primary={_item.name} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                );
              })
            : user?.subscriptionPlan.name === "Enterprise"
              ? BusinessMenuItems.map((item) => {
                  const selected = location.pathname.includes(item?.link);
                  return (
                    <Box key={item.id}>
                      <ListItemButton
                        sx={{
                          px: 0,
                          backgroundColor:
                            item.link && item?.link?.includes(location.pathname)
                              ? "transparent !important"
                              : "#fff",
                        }}
                        onClick={() => {
                          item?.modal
                            ? setOpenModal(true)
                            : handleClick(item.id, item?.link);
                        }}
                        selected={
                          item.link && item?.link?.includes(location.pathname)
                        }
                      >
                        <ListItemIcon>
                          {selected && (
                            <Box
                              sx={{
                                borderTopRightRadius: "10px",
                                borderBottomRightRadius: "10px",
                              }}
                              bgcolor="#FF9D43"
                              width="6px"
                            />
                          )}
                          <Box ml={2} py={1} my="auto">
                            <Icon
                              style={{
                                fontSize: "25px",
                                color: selected ? "#FF9D43" : "#B7B7B7",
                              }}
                              icon={item.icon}
                            />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Text
                              fw="550"
                              fs="18px"
                              color={
                                location.pathname.includes(item?.link)
                                  ? "#FF9D43"
                                  : "#B7B7B7"
                              }
                            >
                              {item.name}
                            </Text>
                          }
                        />
                        {item.group &&
                          (open && id === item.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          ))}
                      </ListItemButton>
                      {item.group && (
                        <Collapse
                          in={open && id === item.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {item.group.map((_item, index) => (
                              <ListItemButton
                                key={index}
                                sx={{ pl: 9 }}
                                onClick={() => {
                                  navigate(_item?.link);
                                }}
                                selected={location.pathname.includes(
                                  _item?.link
                                )}
                              >
                                <ListItemText primary={_item.name} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      )}
                    </Box>
                  );
                })
              : null}
        </Box>

        <Box mt="">
          <Divider />
          {Settings.map((item) => {
            const selected = location.pathname.includes(item?.link);
            return (
              <Box key={item.id}>
                <ListItemButton
                  sx={{
                    px: 0,
                    backgroundColor:
                      item.link && item?.link?.includes(location.pathname)
                        ? "transparent !important"
                        : "#fff",
                  }}
                  onClick={() => {
                    item?.modal
                      ? setOpenModal(true)
                      : handleClick(item.id, item?.link);
                  }}
                  selected={
                    item.link && item?.link?.includes(location.pathname)
                  }
                >
                  <ListItemIcon>
                    {selected && (
                      <Box
                        sx={{
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px",
                        }}
                        bgcolor="#FF9D43"
                        width="6px"
                      />
                    )}
                    <Box ml={2} py={1} my="auto">
                      <Icon
                        style={{
                          fontSize: "25px",
                          color: selected ? "#FF9D43" : "#B7B7B7",
                        }}
                        icon={item.icon}
                      />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        fw="550"
                        fs="18px"
                        color={
                          location.pathname.includes(item?.link)
                            ? "#FF9D43"
                            : "#B7B7B7"
                        }
                      >
                        {item.name}
                      </Text>
                    }
                  />
                  {item.group &&
                    (open && id === item.id ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                {item.group && (
                  <Collapse
                    in={open && id === item.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.group.map((_item, index) => (
                        <ListItemButton
                          key={index}
                          sx={{ pl: 9 }}
                          onClick={() => {
                            navigate(_item?.link);
                          }}
                          selected={location.pathname.includes(_item?.link)}
                        >
                          <ListItemText primary={_item.name} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Box>

        <Box mt="200px">
          <Box border="1px solid #B7B7B7" m={3} p={2} borderRadius="12px">
            <Stack>
              <Text fs="20px" fw="550" color="#131C30" mb={2}>
                Balance
              </Text>
              <Text fs="20px" fw="700" color="#131C30" mb={2}>
                {formatCurrency(user?.balance || 0, "$") }
              </Text>
            </Stack>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
