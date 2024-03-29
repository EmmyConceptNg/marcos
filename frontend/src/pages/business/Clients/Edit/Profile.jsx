import { Box, Grid, Stack } from "@mui/material";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import CheckIcon from "../../../../components/svgs/CheckIcon";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet";
import { setUser } from "../../../../redux/UserReducer";
import DesktopIcon from "../../../../components/svgs/DesktopIcon";

export default function ClientProfile() {
  return (
    <>
      <Box>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <Stack spacing={5}>
          <CreditScore />
        </Stack>
      </Box>
    </>
  );
}

function CreditScore() {
  return (
    <>
      <Text color="#131C30" fs="24px" fw="550">
        Credit score ratings
      </Text>

      <Box>
        <Grid container spacing={3}>
          {[
            {
              image: "/assets/images/trans.svg",
              updated: "Feb 28, 2024 ",
            },
            {
              image: "/assets/images/experian.svg",
              updated: "Feb 28, 2024 ",
            },
            {
              image: "/assets/images/equifax.svg",
              updated: "Feb 28, 2024 ",
            },
          ].map((item, index) => {
            return (
              <Grid item key={index} md={4} sm={6} xs={12}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="290px"
                  border="1px solid #ECECEC"
                  p={2}
                  bgcolor="#fff"
                >
                  <Box display="flex" justifyContent="center">
                    <Box component="img" src="/assets/images/meter.svg" />
                  </Box>
                  <Stack justifyContent="center" alignItems="center">
                    <Box display="flex" justifyContent="center">
                      <Box component="img" src={item.image} />
                    </Box>
                    <Text color="#C7C7C7" fs="15px" fw="400">
                      {`Last updated ${item.updated}`}
                    </Text>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Grid container justifyContent="space-between">
        <Grid item md={6} lg={6} sm={12} xs={12} mb={2}>
          <Text color="#131C30" fs="24px" fw="550">
            Personal information
          </Text>
          <Box
            mt={4}
            bgcolor="#fff"
            sx={{
              height: { sm: "290px", xs: "100%" },
              width: { md: "528px", xs: "100%" },
              padding: { xs: 2, md: 3 },
              borderRadius: "6px",
              border: "1px solid #ECECEC",
            }}
          >
            <Grid container spacing={3} justifyContent="space-between">
              {[
                { id: "phone", name: "Phone", value: "325 546 7589" },
                {
                  id: "Address",
                  name: "Address",
                  value: "800 brighton drive avenue",
                },
                {
                  id: "Birthday",
                  name: "Birthday",
                  value: "Feb 28, 2002",
                },
                {
                  id: "Location",
                  name: "Location",
                  value: "Miami,FL",
                },
                {
                  id: "Email",
                  name: "Email",
                  value: "example@gmail.com",
                },
                {
                  id: "ZIP",
                  name: "ZIP",
                  value: "32707",
                },
              ].map(({ id, name, value }) => (
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  key={id}
                  sx={{ width: "100%" }}
                >
                  <Box>
                    <Text color="#131C30" fs="20px" fw="550">
                      {name}
                    </Text>
                    <Text color="#969696" fs="16px" fw="550">
                      {value}
                    </Text>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item md={12} lg={6} sm={12} xs={12}>
          <Text color="#131C30" fs="24px" fw="550">
            Latest activity
          </Text>
          <Box
            mt={4}
            bgcolor="#fff"
            sx={{
              width:  "100%" ,
              padding: {xs:2, md:2},
              borderRadius: "6px",
              border: "1px solid #ECECEC",
            }}
          >
            {Array(3)
              .fill()
              .map((index) => (
                <Box py={1} px={2} key={index}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="space-between"
                    justifyContent="space-between"
                    border="1px solid #DEDEDE"
                    borderRadius="15px"
                    p={1}
                  >
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ cursor: "pointer" }}>
                        <DesktopIcon />
                      </Box>
                      <Box>
                        <Text color="#131C30" fs="16px" fw="550">
                          Mar 23, 2024
                        </Text>
                        <Text color="#B7B7B7" fs="14px" fw="400">
                          Added a new credit report into the system
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
