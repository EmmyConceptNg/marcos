


import { Box, Grid, Stack } from "@mui/material";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import CheckIcon from "../../../../components/svgs/CheckIcon";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet";
import { setUser } from "../../../../redux/UserReducer";
import ClientProfile from "./Profile";
import { useState } from "react";

export default function ClientDetails() {
    const [type, setType] = useState('profile')
  return (
    <>
      <Box>
        <Helmet>
          <title>Client</title>
        </Helmet>

        <Stack spacing={3}>
          <Stack direction={{ sm: "row", xs: "column" }} spacing={0}>
            {[
              {
                id: "profile",
                sx: {
                  borderTopLeftRadius: {sm:"10px", xs:0},
                  borderBottomLeftRadius: {sm:"10px", xs:0},
                },
                name: "Profile",

                color: "#FF9D43",
                width: "126px",
              },
              {
                id: "documents",
                name: "Documents",

                color: "#B7B7B7",
                width: "196px",
              },
              {
                id: "disputing",
                name: "Disputing",

                color: "#B7B7B7",
                width: "196px",
              },
              {
                id: "attacks",
                name: "Attacks",

                color: "#B7B7B7",
                width: "196px",
              },
              {
                id: "history",
                name: "History",

                color: "#B7B7B7",
                width: "196px",
              },
              {
                id: "invoices",
                name: "Invoices",

                color: "#B7B7B7",
                width: "196px",
              },
              {
                id: "notes",
                sx: {
                  borderTopRightRadius: {sm:"10px", xs: 0},
                  borderBottomRightRadius: {sm:"10px", xs: 0},
                },
                name: "Notes",

                color: "#B7B7B7",
                width: "128px",
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  ...item.sx,
                  border:
                    type === item.id
                      ? "1px solid #FF9D43"
                      : "1px solid #CDCDCD",
                  width: {md :item.width, sm:'100%'},
                  p: 1,
                  cursor: "pointer",
                }}
                onClick={() => setType(item.id)}
                width={item.width}
                variant="outlined"
                color={item.color}
              >
                <Text
                  fs="18px"
                  sx={{ textAlign: "center" }}
                  fw="550"
                  color={type === item.id ? "#FF9D43" : "#CDCDCD"}
                >
                  {item.name}
                </Text>
              </Box>
            ))}
          </Stack>
          <ClientProfile />
        </Stack>
      </Box>
    </>
  );
}


