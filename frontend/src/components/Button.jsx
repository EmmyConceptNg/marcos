import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Button({
  onClick,
  to, color,
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
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <LoadingButton
      className={`custom-button-${variant}`}
      loading={loading}
      onClick={handleClick}
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
  height: PropTypes.string,
  variant: PropTypes.string,
  to: PropTypes.string,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
};
