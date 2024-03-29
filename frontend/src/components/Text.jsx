import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Text({
  fw,
  fs,
  color,
  cursor,
  children,
  lh,
  sx,
  background,
  onClick, to,
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
    <Typography
      sx={{
        fontWeight: fw,
        fontSize: fs,
        color,
        cursor,
        lineHeight: lh,
        ...sx,
        background: background,
        WebkitBackgroundClip: background && "text",
        WebkitTextFillColor: background && "transparent",
      }}
      onClick={handleClick}
    >
      {children}
    </Typography>
  );
}

Text.propTypes = {
  cursor: PropTypes.string,
  fw: PropTypes.string.isRequired,
  fs: PropTypes.string.isRequired,
  color: PropTypes.string,
  to: PropTypes.string,
  text: PropTypes.string,
  lh: PropTypes.string,
  background: PropTypes.string,
  children: PropTypes.node,
  sx: PropTypes.object,
  onClick: PropTypes.func,
};
