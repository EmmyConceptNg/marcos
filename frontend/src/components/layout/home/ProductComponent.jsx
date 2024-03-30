import { Box, Stack } from "@mui/material";
import DesktopIcon from "../../svgs/DesktopIcon";
import Text from "../../Text";
import { Icon } from "@iconify/react";

export default function ProductComponent () {
    return (
      <Box
        width={{ sm: "500px", xs: "100%" }}
        bgcolor="#f6f9fc"
      >
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
          <Box>
            {[
              {
                name: "Blog",
                description: "The latest industry news, updates and info",
                icon: "ri:book-line",
              },
              {
                name: "Customer Stories",
                description: "learn how our customers are making big changes",
                icon: "solar:star-fall-bold",
              },
              {
                name: "Video Tutorial",
                description: "Get up an running on new features and techniques",
                icon: "lets-icons:video",
              },
            ].map(({ name, description, icon }) => (
              <Box py={1} px={1} key={name} bgcolor="#fff">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="space-between"
                  justifyContent="space-between"
                  borderRadius="15px"
                  p={1}
                >
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ cursor: "pointer" }}>
                      <Icon icon={icon} style={{ color: "#FF9D43" }} />
                    </Box>
                    <Box>
                      <Text color="#131C30" fs="14px" fw="550">
                        {name}
                      </Text>
                      <Text color="#B7B7B7" fs="12px" fw="400">
                        {description}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            p={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box component="img" src="assets/images/grant.svg" height="150px" />

            <Box>
              <Text
                color="#131C30"
                fs="14px"
                fw="550"
                sx={{ textAlign: "center" }}
              >
                We've just released an update!
              </Text>
              <Text
                color="#B7B7B7"
                fs="12px"
                fw="400"
                sx={{ textAlign: "center" }}
              >
                Check out all the new dashboard view. Pages now load faster.
              </Text>
            </Box>
          </Box>
        </Stack>
      </Box>
    );
}