import { Box, Divider, Grid, Stack } from "@mui/material";
import Text from "../../components/Text";
import Button from "../../components/Button";
import CheckIcon from "../../components/svgs/CheckIcon";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet";
import { setUser } from "../../redux/UserReducer";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Description, Share, Visibility } from "@mui/icons-material";
import CreateIcon from "../../components/svgs/CreateIcon";
import DesktopIcon from "../../components/svgs/DesktopIcon";
import ProIcon from "../../components/svgs/ProIcon";

export default function BusinessDashboard() {
  return (
    <>
      <Box>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <Stack direction="row" justifyContent="space-between">
          <Text color="#131C30" fs="36px" fw="700">
            Hi Marcos!
          </Text>
          <Button
            variant="contained"
            width={{ sm: "165px", xs: "100%" }}
            height="48px"
            to="#"
          >
            Earn free credits!
          </Button>
        </Stack>
        <Grid container spacing={3} mt={3}>
          <Grid item md={12} lg={8} sm={12} xs={12}>
            <Todo />
          </Grid>
          <Grid item md={12} lg={4} sm={12} xs={12}>
            <Stack spacing={2}>
              <Pro />
              <Report />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function Todo() {
  return (
    <Box borderRadius="10px" bgcolor="#fff" width="100%">
      <Stack spacing={2}>
        <Box pt={2} px={3}>
          <Text fw="550" fs="25px" color="#131C30">
            To-Do List
          </Text>
        </Box>
        <Divider />
        <Box py={2} px={3}>
          <Stack direction={{ sm:"row", xs: 'column' }} spacing={2}>
            {[
              {
                name: "Rounds",
                icon: <Description />,
                color: "#FF9D43",
                width: "126px",
              },
              {
                name: "Missing Documents",
                icon: <Icon icon="fluent:document-error-16-regular" />,
                color: "#B7B7B7",
                width: "196px",
              },
              {
                name: "Add Client",
                icon: <Icon icon="akar-icons:person" />,
                color: "#B7B7B7",
                width: "128px",
              },
            ].map((item, index) => (
              <Button
                key={index}
                width={item.width}
                variant="outlined"
                color= {item.color}
                startIcon={item.icon}
              >
                {item.name}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box sx={{  maxHeight: '500px',
            overflowY: 'auto' }}>
        <Box py={2} px={3}>
          <Box
            display="flex"
            height={{ md: "154px", xs : '100%' }}
            border="1px dashed #DEDEDE"
            borderRadius="15px"
            justifyContent="center"
            alignItems="center" py={2}
          >
            <Stack spacing={1} justifyContent="center" alignItems="center">
              <Box sx={{ cursor: "pointer" }}>
                <CreateIcon />
              </Box>
              <Text
                sx={{ textAlign: "center" }}
                color="#131C30"
                fs="16px"
                fw="550"
              >
                Create new Round
              </Text>
            </Stack>
          </Box>
        </Box>
        {Array(3)
          .fill()
          .map((index) => (
            <Box py={2} px={3} key={index}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="space-between"
                justifyContent="space-between"
                height={{ md:"154px", xs: '100%' }}
                border="1px solid #DEDEDE"
                borderRadius="15px"
                p={2}
              >
                <Stack direction="row" spacing={2}>
                  <Box sx={{ cursor: "pointer" }}>
                    <DesktopIcon />
                  </Box>
                  <Box>
                    <Text color="#131C30" fs="16px" fw="550">
                      Example round name
                    </Text>
                    <Text color="#B7B7B7" fs="14px" fw="400">
                      10.04.2024
                    </Text>
                  </Box>
                </Stack>
                <Text fs="15px" fw="400" color="#475467">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </Text>
              </Box>
            </Box>
          ))}
          </Box>
      </Stack>
    </Box>
  );
}
function Pro(){
  return (
    <Box height="118px" bgcolor="#fff" p={2} borderRadius="10px">
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="space-between" justifyContent="space-between">
          <Text
            fs="20px"
            fw="550"
            background="linear-gradient(90deg, #FF8934 0%, #FF3CD4 100%)"
          >
            Become a Pro
          </Text>
          <Text fs="16px" fw="400" color="#475467">
            Lorem ipsum dolor sit amet, consec adipiscing elit.
          </Text>
        </Stack>
        <ProIcon />
      </Stack>
    </Box>
  );
}

function Report(){
return (
  <Box  bgcolor="#fff" borderRadius="10px">
    <Box
      bgcolor="#131C30"
      height="57px"
      p={3}
      display="flex"
      alignItems="center"
      sx={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
    >
      <Text color="#fff" fw="700" fs="20px">
        February-Reports
      </Text>
    </Box>
    <Box p={3}>
      <Stack spacing={2}>
        <Text fw="700" fs="16px" color="#131C30">
          Weekly Report
        </Text>
        <Text fw="400" fs="16px" color="#475467">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </Text>

        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Button rounded variant="outlined" color="#131C30" height="36px" endIcon={<Share />}>
            Share report
          </Button>
          <Button rounded variant="outlined" color="#131C30" height="36px" endIcon={<Visibility />}>
            View details
          </Button>
        </Stack>
      </Stack>
    </Box>
  </Box>
);
}