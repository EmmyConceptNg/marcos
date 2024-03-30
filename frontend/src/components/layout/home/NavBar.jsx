import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { Stack, Box, Popover } from "@mui/material";
import PropTypes from "prop-types";
import Button from "../../Button";
import { ArrowDownward, KeyboardArrowDown } from "@mui/icons-material";
import { useState } from "react";
import ProductComponent from "./ProductComponent";

export default function NavBar({ ffor = "" }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
              dropdown: true,
              component: "",
              name: "Products",
            },
            {
              to: "#",
              dropdown: true,
              component: "",
              name: "Resources",
            },
            {
              to: "pricing",
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
              {nav.dropdown ? (
                <>
                  <Box
                    style={{
                      color: "#475467",
                      cursor: "pointer",
                    }}
                    onClick={handleClick}
                    display="flex"
                  >
                    {nav.name}
                    <KeyboardArrowDown />
                  </Box>
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose} elevation={1}
                    sx={{
                      boxShadow: "0px 18px 34.900001525878906px 0px #00000040",
                      borderRadius: "24px",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <ProductComponent />
                  </Popover>
                </>
              ) : (
                <Box display="flex">
                  {nav?.name}
                  {nav?.dropdown && <KeyboardArrowDown />}
                </Box>
              )}
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
