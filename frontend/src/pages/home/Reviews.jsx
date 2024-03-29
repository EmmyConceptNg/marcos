import { Box, Grid, Stack } from "@mui/material";
import Text from "../../components/Text";
import CustomSlider from "../../components/layout/home/Slider";
import Carousel from "../../components/layout/home/Carousel";

export default function Reviews() {
  return (
    <Box>
      <Box>
        <Text
          color="#131C30"
          fw="550"
          fs={{ md: "48px", lg: "48px", sm: "30px", xs: "25px" }}
          sx={{
            textAlign: "center",
            mx: { md: "0px", lg: "150px", xl: "350px", sm: "0px", xs: "0px" },
            mt: { md: 20, lg: 20, xl: 20, sm: 10, xs: 5 },
          }}
        >
          Reviews
        </Text>
      </Box>
          <Carousel />
    </Box>
  );
}
