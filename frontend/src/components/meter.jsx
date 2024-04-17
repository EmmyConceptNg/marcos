import React from "react";
import { Typography, Box } from "@mui/material";

const Speedometer = ({ value }) => {
  // Min-max normalization for the value
  const normalizedValue = Math.min(Math.max(value, 0), 850);
  const valuePercent = (normalizedValue / 850) * 100;

  // Define colors for different zones
  const getColorForZone = (value) => {
    if (value <= 500) return "#ff0000"; // Danger zone
    if (value <= 700) return "#ffa500"; // Warning zone
    if (value <= 800) return "#00ff00"; // Safe zone
    return "#0000ff"; // Perfect zone
  };

  // Stroke color based on the value in a specific zone
  const strokeColor = getColorForZone(normalizedValue);

  // SVG dimensions
  const svgSize = 200;
  const strokeWidth = 10;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = radius * Math.PI * 0.8; // 80% of full circle to simulate the speedometer gap
  const strokeDashoffset = ((100 - valuePercent) / 100) * circumference;

  return (
    <Box
      position="relative"
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-100 ${svgSize / 2} ${svgSize / 2})`} // Start from the bottom
        />
      </svg>
      <Typography variant="h5" component="span" position="absolute">
        {normalizedValue}
      </Typography>
    </Box>
  );
};

export default Speedometer;
