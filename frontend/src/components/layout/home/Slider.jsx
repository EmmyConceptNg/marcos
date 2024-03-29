import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function CustomSlider() {
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const handleIncrement = () => {
    if (value < 100) {
      setValue(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        value={typeof value === "number" ? value : 0}
        onChange={handleSliderChange}
        aria-labelledby="input-slider"
        min={0}
        max={100}
      />
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <IconButton onClick={handleDecrement} aria-label="decrement">
          <RemoveIcon />
        </IconButton>
        <TextField
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <IconButton onClick={handleIncrement} aria-label="increment">
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
