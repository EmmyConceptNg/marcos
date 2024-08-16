import { Box, Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function Links() {
    return (
      <Stack spacing={2} justifyContent="center" alignItems="center" mt={10}>
        <Box
          component="img"
          src="assets/logo/logo.png"
          width="100px"
        />
        <Box>
          <Grid
            
            container
            spacing={3}
            justifyContent="flex-start"
            alignItems="center"
          >
            {[
              { name: "Overview", link: "/" },
              { name: "Features", link: "/" },
              { name: "Pricing", link: "/" },
              { name: "Careers", link: "/" },
              { name: "Help", link: "/" },
              { name: "Privacy", link: "/" },
            ].map((item, index) => {
              return (
                <Grid item key={index} xs={3} sm={2} md={2}>
                  <Link to={item?.link} style={{ color: "#475467" }}>
                    {item?.name}
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Stack>
    );
}