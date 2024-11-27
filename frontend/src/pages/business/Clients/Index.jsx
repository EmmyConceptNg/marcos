import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserIcon from "../../../components/svgs/UserIcon";
import {
  ArrowDownward,
  ArrowUpward,
  FilterList,
  MoreVert,
} from "@mui/icons-material";
import Text from "../../../components/Text";
import { Helmet } from "react-helmet";
import DesktopIcon from "../../../components/svgs/DesktopIcon";
import SearchInput from "../../../components/Search";
import EditDocIcon from "../../../components/svgs/EditDocIcon";
import DeleteIcon from "../../../components/svgs/DeleteIcon";
import { useEffect, useState } from "react";
import User2Icon from "../../../components/svgs/User2Icon";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../../components/Button";
import AddClientModal from "./Add/Index";
import axios from "../../../api/axios";
import { notify } from "../../../utils/Index";

export default function Clients() {
  const [addUserModal, setAddUserModal] = useState(false);
  const [clients, setClients] = useState([]);
  const user = useSelector((state) => state.user.details);

  const handleAddUser = () => {
    console.log("here");
    setAddUserModal(true);
  };

  useEffect(() => {
    axios
      .get(`/api/clients/${user?._id}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setClients(response.data.clients);
      })
      .catch((error) => {
        console.log(error);
        notify(error?.response?.data?.error, "error");
      });
  }, []);

  return (
    <>
      <AddClientModal open={addUserModal} setOpen={setAddUserModal} />

      <Box>
        <Helmet>
          <title>Clients</title>
        </Helmet>
        <Stack spacing={4}>
          <Grid container spacing={2} justifyContent="space-between">
            {[
              {
                name: "Total customers",
                count: "2,420",
                percentage: "20",
                icon: <UserIcon />,
              },
              {
                name: "Members",
                count: "1,210",
                percentage: "15",
                icon: <UserIcon />,
              },
              {
                name: "Active now",
                count: "316",
                members: ["", "", "", "", ""],
                icon: <DesktopIcon />,
              },
            ].map((item, index) => (
              <Grid lg={4} md={6} sm={6} xs={12} item key={index}>
                <Box
                  width="100%"
                  sx={{ boxShadow: "0px 4px 20px 0px #1018281A" }}
                  px={3}
                  py={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  borderRadius="15px"
                  height="192px"
                  bgcolor="#fff"
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <IconButton>{item.icon}</IconButton>
                    <IconButton>
                      <MoreVert sx={{ color: "#98A2B3" }} />
                    </IconButton>
                  </Stack>

                  <Stack>
                    <Text color="#131C30" fw="550" fs="14px">
                      {item.name}
                    </Text>
                    <Stack direction="row" justifyContent="space-between">
                      <Text color="#475467" fw="550" fs="36px">
                        {item.count}
                      </Text>
                      {item?.percentage ? (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          sx={{ p: 2 }}
                          height="24px"
                          bgcolor="#ECFDF3"
                          borderRadius="16px"
                          spacing={1}
                        >
                          <ArrowUpward
                            sx={{ color: "#12B76A", fontSize: "15px" }}
                          />
                          <Text color="#027A48" fs="14px" fw="500">
                            {item.percentage}%
                          </Text>
                        </Stack>
                      ) : (
                        <AvatarGroup max={5}>
                          {item.members.map((item) => (
                            <Avatar
                              key={item}
                              alt="Remy Sharp"
                              src="/assets/images/avatar.svg"
                            />
                          ))}
                        </AvatarGroup>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box px={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <SearchInput
                width="320px"
                height="50px"
                placeholder="Search"
                bgcolor="#fff"
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => handleAddUser()}
                  width={{ sm: "165px", xs: "100%" }}
                >
                  Add Client
                </Button>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ px: 3, backgroundColor: "#fff" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <FilterList />
                  <Text fs="14px" fw="550" color="#475467" sx={{ mb: 0 }}>
                    Filters
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <DataTable clients={clients} />
        </Stack>
      </Box>
    </>
  );
}

function DataTable({clients}) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.details);
  const [checked, setChecked] = useState([true, false]);

  const handleChange = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };
  const handleChange2 = (event, index) => {
    const updatedChecked = [...checked];
    updatedChecked[index] = event.target.checked;
    setChecked(updatedChecked);
  };

  const colors = [
    {
      id: "active",
      color: "#027A48",
      bg: "#ECFDF3",
    },
    {
      id: "customerData",
      color: "#175CD3",
      bg: "#EFF8FF",
    },
    {
      id: "admin",
      color: "#3538CD",
      bg: "#EEF4FF",
    },
    {
      id: "more",
      color: "#344054",
      bg: "#F2F4F7",
    },
  ];

  const rows = [
    {
      name: "James D.",
      rating: {
        progress: 60,
        percentage: 5,
        positive: true,
      },
      lastContacted: "22 Jan 2022",
      categories: [
        { id: "active", name: "Active" },
        { id: "customerData", name: "Customer Data" },
        { id: "admin", name: "Admin" },
        { id: "more", name: "+4" },
      ],
    },
    {
      name: "James D.",
      rating: {
        progress: 60,
        percentage: 5,
        positive: false,
      },
      lastContacted: "22 Jan 2022",
      categories: [
        { id: "active", name: "Active" },
        { id: "customerData", name: "Customer Data" },
        { id: "admin", name: "Admin" },
        { id: "more", name: "+4" },
      ],
    },
  ];

  return (
    <TableContainer sx={{ bgcolor: "#fff", px: 2, borderRadius: "12px" }}>
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label="clients">
        <TableHead>
          <TableRow>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#FF9D43",
                    "&.Mui-checked": {
                      color: "#FF9D43",
                    },
                  }}
                  checked={checked[0] && checked[1]}
                  indeterminate={checked[0] !== checked[1]}
                  onChange={handleChange}
                />
              }
            />
            {[
              "Client’s name ",
              "Rating",
              "Last Contacted",
              "Categories",
              "Actions",
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
          {clients?.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                sx={{
                  fontSize: "15px",
                  color: "#475467",
                  fontWeight: "550",
                  width: "1px",
                }}
                component="th"
                scope="row"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#FF9D43",
                        "&.Mui-checked": {
                          color: "#FF9D43",
                        },
                      }}
                      checked={checked[index]}
                      onChange={(event) => handleChange2(event, index)}
                    />
                  }
                />
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "15px",
                  color: "#475467",
                  fontWeight: "550",
                  width: "245px",
                }}
                component="th"
                scope="row"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <User2Icon />
                  <Box>{row.fullName || row.username}</Box>
                </Stack>
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "15px",
                  color: "#475467",
                  fontWeight: "400",
                  width: "350px",
                }}
                align="left"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={row?.rating?.progress}
                    sx={{
                      height: "8px",
                      borderRadius: "5px",
                      flexGrow: 1,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#FF9D43",
                      },
                    }}
                  />

                  <Text fs="14px" fw="550" color="#344054">
                    {row?.rating?.progress}
                  </Text>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ p: 2 }}
                    height="22px"
                    bgcolor={row?.rating?.positive ? "#ECFDF3" : "#FEF3F2"}
                    borderRadius="16px"
                    spacing={1}
                  >
                    {row?.rating?.positive ? (
                      <ArrowUpward
                        sx={{ color: "#12B76A", fontSize: "15px" }}
                      />
                    ) : (
                      <ArrowDownward
                        sx={{ fontSize: "15px", color: "#F04438" }}
                      />
                    )}
                    <Text
                      color={row?.rating?.positive ? "#027A48" : "#F04438"}
                      fs="14px"
                      fw="500"
                    >
                      {row?.rating?.percentage}%
                    </Text>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell
                sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                align="left"
              >
                {row?.lastContacted}
              </TableCell>
              <TableCell
                sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                align="left"
              >
                <Stack direction="row" spacing={1}>
                  {row?.categories?.map((item) => {
                    const color = colors.find((color) => color.id === item.id);
                    return (
                      <Stack
                        key={item.direction}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ p: 2 }}
                        height="22px"
                        bgcolor={color.bg}
                        borderRadius="16px"
                        spacing={1}
                      >
                        {item.id === "active" && (
                          <Box
                            bgcolor={color.color}
                            width="6px"
                            height="6px"
                            borderRadius="100%"
                          />
                        )}
                        <Text color={color.color} fs="14px" fw="500">
                          {item.name}
                        </Text>
                      </Stack>
                    );
                  })}
                </Stack>
              </TableCell>
              <TableCell
                sx={{ fontSize: "15px", color: "#475467", fontWeight: "400" }}
                align="left"
              >
                <Stack direction="row" spacing={3}>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>

                  <IconButton onClick={() => navigate(`${user._id}/edit`)}>
                    <EditDocIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
