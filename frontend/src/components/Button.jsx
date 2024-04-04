import { LoadingButton } from "@mui/lab";
import { Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Button({
  onClick,
  to,
  color,
  type = "submit",
  sx,
  rounded = false,
  startIcon,
  endIcon,
  children,
  width = "165px",
  height = "48px",
  loading = false, // Default set to false assuming not loading
  variant = "text",
  dropdown = false,
  dropdownItems = [],
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    if (dropdown) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LoadingButton
        className={`custom-button-${variant}`}
        loading={loading}
        onClick={(event) => {
          if (dropdown) {
            handleMenuClick(event);
          } else {
            handleClick();
          }
        }}
        type={type}
        startIcon={startIcon}
        endIcon={endIcon}
        sx={{
          ...sx,
          borderRadius: rounded ? "36px" : "6px",
          width,
          height,
          fontSize: "1rem",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          textTransform: "capitalize",
          color: variant === "contained" ? "#fff" : color,
          "&:hover": {
            borderRadius: rounded ? "36px" : "6px",
            color: variant === "contained" ? "#fff" : color,
          },
          "& .MuiLoadingButton-loadingIndicator + span": {
            fontSize: "1rem",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            color: variant === "contained" ? "#fff" : "",
          },
        }}
      >
        {children}
      </LoadingButton>
      {dropdown && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          {dropdownItems.map((item, index) => (
            <MenuItem key={index} onClick={item.onClick}>
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  sx: PropTypes.object,
  type: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.node.isRequired,
  rounded: PropTypes.bool,
  loading: PropTypes.bool,
  dropdown: PropTypes.bool,
  height: PropTypes.string,
  variant: PropTypes.string,
  to: PropTypes.string,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ),
};
