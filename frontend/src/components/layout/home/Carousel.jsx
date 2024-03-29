import React, { useState } from "react";
import { Box, Grid, IconButton, Paper, Rating, Stack, styled } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Text from "../../Text";
import { ArrowBack, ArrowForward, Star, StarBorder } from "@mui/icons-material";

const CarouselItem = ({ item, active }) => (
  <Grid
    container
    spacing={{ md: 10, lg: 10, xl: 20, sm: 5, xs: 2 }}
    justifyContent="flex-start"
    alignItems="center"
    sx={{ mt: 3 }}
  >
    <Grid
      item
      xs={12}
      sm={12}
      md={6}
      xl={6}
      lg={6}
      sx={{ display: "flex", pt: 5 }}
    >
      <Stack spacing={2}>
        <Stack padding={2}>
          <Text
            color="#131C30"
            fw="550"
            fs={{ md: "30pxpx", lg: "36px", sm: "25px", xs: "20px" }}
            sx={{
              textAlign: { md: "left", lg: "left", sm: "center", xs: "center" },
            }}
          >
            Don’t just take our word for it
          </Text>
          <Text
            color="#475467"
            fw="400"
            fs={{ md: "18px", lg: "20px", sm: "16px", xs: "14px" }}
            sx={{
              textAlign: { md: "left", lg: "left", sm: "center", xs: "center" },
            }}
          >
            Hear from some of our amazing customers who are building faster.
          </Text>
        </Stack>
      </Stack>
    </Grid>
    <Grid item md={6} lg={6} xl={6} xs={12} sm={12}>
      <Box
        height="409.43px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box display="flex" justifyContent="flex-end">
          <Box
            sx={{
              background: "linear-gradient(94.78deg, #FF8126 0%, #F03280 100%)",
            }}
            width="135.04px"
            height="147.09px"
            borderRadius="12.9px"
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          position="absolute"
          bottom="87.02px"
          right="27.74px"
          bgcolor="#F6F9FC"
          border="0.86px solid #DEDEDE"
          borderRadius="9.28px"
          height="239.02px"
          width={{
            xl: "650px",
            lg: "500px",
            md: "300px",
            sm: "650px",
            xs: "320px",
          }}
        >
          <Stack direction="row" spacing={2} mx={5}>
            <Box component="img" src={item.image} />
            <Stack alignItems="flex-start" spacing={0.5}>
              <Box display="flex" gap={1}>
                <GradientRating item={item} />
                <Text
                  color="#475467"
                  fw="400"
                  fs="11.6"
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {`${item.rating} rating`}
                </Text>
              </Box>
              <Text
                color="#131C30"
                fw="500"
                fs="16.24"
                sx={{
                  textAlign: "left",
                }}
              >
                {item.review}
              </Text>
              <Box>
                <Text
                  color="#131C30"
                  fw="700"
                  fs="13.92"
                  sx={{
                    textAlign: "left", mb:0
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  color="#475467"
                  fw="400"
                  fs="9.28"
                  sx={{ mt:0,
                    textAlign: "left",
                  }}
                >
                  {item.position}
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <Box display="flex" alignItems="flex-end">
          <Box
            sx={{
              background: "linear-gradient(94.78deg, #FF8126 0%, #F03280 100%)",
              boxShadow: "0px 4px 43.599998474121094px 0px #0000002B",
            }}
            width="313px"
            height="147px"
            borderRadius="12.9px"
          />
        </Box>
      </Box>
    </Grid>
  </Grid>
);

const CustomCarousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevActiveIndex) =>
      prevActiveIndex - 1 < 0 ? items.length - 1 : prevActiveIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevActiveIndex) =>
      prevActiveIndex + 1 >= items.length ? 0 : prevActiveIndex + 1
    );
  };

  return (
    <Box sx={{ position: "relative" }}>
      {items.map((item, index) => (
        <CarouselItem key={index} item={item} active={index === activeIndex} />
      ))}
      <IconButton
        sx={{
          position: "absolute",
          bottom: { md: "60px", lg: "80px", sm: "400px", xs: "400px" },
          left: "20px",
          transform: "translateY(-50%)",
          backgroundColor: "#F6F9FC",
          borderRadius: "28px",
        }}
        onClick={handlePrev}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        sx={{
          position: "absolute",
          bottom: { md: "60px", lg: "80px", sm: "400px", xs: "400px" },
          right: {md :"600px", lg : '1060px', xl:'1500px', sm : '20px', xs : "20px" },
          transform: "translateY(-50%)",
          backgroundColor: "#F6F9FC",
          borderRadius: "28px",
        }}
        onClick={handleNext}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
};


// Create a unique ID to reference the gradient (important for server-side rendering)
const uniqueId = `rating-gradient-${Math.round(Math.random() * 1e5)}`;

// Styled components for filled and empty stars
const StyledStarIcon = styled(Star)(({ theme }) => ({
  color: `url(#${uniqueId})`, // Reference to the gradient by ID
}));

const StyledStarBorderIcon = styled(StarBorder)(({ theme }) => ({
  color: theme.palette.action.disabled,
}));

 function GradientRating({ item }) {
  return (
    <div>
      <svg width="0" height="0">
        <linearGradient id={uniqueId} gradientTransform="rotate(90)">
          <stop offset="28.5%" stopColor="#FE6433" />
          <stop offset="72.5%" stopColor="#F03280" />
        </linearGradient>
      </svg>
      <Rating
        name="read-only"
        value={item.rating}
        icon={<StyledStarIcon fontSize="inherit" />}
        emptyIcon={<StyledStarBorderIcon fontSize="inherit" />}
        readOnly
      />
    </div>
  );
}

export default function Carousel() {
  const carouselItems = [
    {
      name: "Elisa Grant",
      position: "Legacy Solutions Engineer",
      review:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        rating: 5.0, image : 'assets/images/grant.svg'
    },
    
    
  ];

  return (
    <Box sx={{ width: '100%', overflow: "hidden", margin: "auto", mt: 5 }}>
      <CustomCarousel items={carouselItems} />
    </Box>
  );
}
