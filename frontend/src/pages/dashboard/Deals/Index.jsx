import { Box, Stack } from "@mui/material";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import StarIcon from "../../../components/svgs/StarIcon";
import { Helmet } from "react-helmet";

export default function Deals(){
    return (
      <>
        <Helmet>
          <title>Deals</title>
        </Helmet>
        <Stack spacing={2}>
          {["", "", "", ""].map((item) => (
            <Box
              key={item}
              width="100%"
              height="100%"
              borderRadius="20px"
              bgcolor="#fff"
              py={3}
              px={{ sm: 3, xs: 1 }}
            >
              <Stack
                direction={{ sm: "row", xs: "column" }}
                justifyContent={{ md: "space-evenly", xs: "flex-start" }}
                spacing={{ sm: 4, xs: 2 }}
                alignItems="center"
              >
                <Stack
                  sx={{
                    flexBasis: { sm: "50%" },
                    maxWidth: { sm: "50%" },
                    width: "100%",
                  }}
                  spacing={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Box
                    component="img"
                    src="/assets/images/stellar.svg"
                    width="150px"
                  />
                  <Text fs="16px" fw="400" color="#475467">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore ma.
                  </Text>
                  <Button
                    width={{ xs: "100%", sm: "165px" }}
                    height="45px"
                    variant="contained"
                  >
                    Get offer
                  </Button>
                </Stack>
                <Stack
                  spacing={2}
                  sx={{
                    flexBasis: { sm: "50%" },
                    maxWidth: { sm: "50%" },
                    width: "100%", // Take full width on very small screens
                  }}
                >
                  {[
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  ].map((item, index) => (
                    <Stack direction="row" spacing={3} key={index}>
                      <StarIcon />
                      <Text fw="550" fs="15px" color="#131C30">
                        {item}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </>
    );
}