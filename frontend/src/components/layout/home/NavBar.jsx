import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { Stack, Box } from "@mui/material";
import PropTypes from "prop-types";
import Button from "../../Button";

export default function NavBar({ ffor = "" }) {
  const navigate = useNavigate();
  return (
    <>
      <Box
        flexGrow={1}
        sx={{
          display: { xs: "block", md: "block", lg: "flex" },
          justifyContent: "flex-start",
        }}
      >
        <Stack
          justifyContent="flex-start"
          spacing={ffor == "mobile" ? 2 : 5}
          sx={{ ml: "30px" }}
          direction={ffor == "mobile" ? "column" : "row"}
          alignItems={ffor == "mobile" ? "start" : "flex-start"}
        >
          {[
            {
              to: "home",
              name: "Home",
            },
            {
              to: "#",
              name: "Products",
            },
            {
              to: "#",
              name: "Resources",
            },
            {
              to: "testimonials",
              name: "Pricing",
            },
          ].map((nav, index) => (
            <Link
              style={{
                color: "#475467",
                cursor: "pointer",
              }}
              to={nav?.to}
              smooth={true}
              duration={500}
              key={index}
            >
              {nav?.name}
            </Link>
          ))}
        </Stack>
      </Box>
      {ffor == "mobile" && <br />}
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "block",
            md: "block",
            lg: "flex",
          },
        }}
      >
        <Stack
          spacing={ffor == "mobile" ? 2 : 1}
          sx={{ mx: "auto" }}
          direction={ffor == "mobile" ? "row" : "row"}
          alignItems={ffor == "mobile" ? "center" : "center"}
        >
          <Button
            to="/login"
            color="#475467"
            sx={{
              
              backgroundPosition: "center",
            }}
          >
            Login
          </Button>
          <Button
            to="/signup"
            variant="contained"
            rounded
            sx={{
              width: `${ffor == "mobile" ? "45%" : "139px"}`,
              backgroundPosition: "center",
            }}
          >
            Sign up
          </Button>
        </Stack>
      </Box>
    </>
  );
}
NavBar.propTypes = {
  ffor: PropTypes.string,
};
