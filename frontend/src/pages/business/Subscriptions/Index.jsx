import { Box, Card, CardActions, CardContent, CardMedia, Grid, Stack } from "@mui/material";
import Text from "../../../components/Text";
import { ArrowOutward, FilterList } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import SearchInput from "../../../components/Search";
import { Icon } from "@iconify/react";
import Button from "../../../components/Button";

export default function Subscriptions(){
    
    return (
      <Box>
        <Helmet>
          <title>Subscriptions</title>
        </Helmet>
        <Stack spacing={6}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <SearchInput
              width="320px"
              height="50px"
              placeholder="Search"
              bgcolor="#fff"
            />

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

          <Box>
            <Grid container spacing={3}>
              {[
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
                {
                  icon: "logos:stripe",
                  endDate: "Ending 14.05.24",
                  link: "#",
                },
              ].map((item, index) => (
                <Grid lg={4} md={6} sm={6} xs={12} item key={index}>
                  <Box
                    p={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    borderRadius="15px"
                    height="163px"
                    bgcolor="#fff"
                    sx={{
                      borderLeft: "3px solid #FF9D43 ",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Icon icon={item.icon} style={{ fontSize: "30px" }} />
                      <Text color="#B7B7B7" fw="400" fs="14px">
                        {item.endDate}
                      </Text>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Button
                        height="40px"
                        variant="outlined"
                        sx={{ color: "#333333" }}
                      >
                        Unsubscribed
                      </Button>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor : 'pointer' }}>
                        <Text color="#B7B7B7" fw="400" fs="14px">
                          View details
                        </Text>
                        <ArrowOutward sx={{ color: "#B7B7B7", fontSize: '15px' }} />
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="center">
              {Array(10)
                .fill()
                .map((item, index) => (
                  <Box
                    width="40px"
                    sx={{ cursor: "pointer" }}
                    height="40px"
                    borderRadius="8px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    key={index}
                    bgcolor={index > 0 ? "transparent" : "#fff"}
                  >
                    <Text fw="550" fs="14px" color="#1D2939">
                      {index + 1}
                    </Text>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
}