import React from "react";
import { Typography, Box } from "@mui/material";
import Text from "./Text";

export default function ProgressLoader({ value, image, }) {
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
  const strokeWidth = 15;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = radius * Math.PI * 0.8; // 80% of full circle
  const strokeDashoffset = circumference - (valuePercent / 100) * circumference;

  // SVG text positioning may be trial-and-error to get right, consider these starting points
  const dangerZonePosition = { x: svgSize / 2, y: 20 };
  // Define other zone positions...

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
          transform={`rotate(-100 ${svgSize / 2} ${svgSize / 2})`}
        />
      </svg>
      <Box position="absolute">
        <Text fw={{ xs: "600", sm: "600" }} sx={{ textAlign : 'center' }} fs={{ xs: "24px", sm: "50px" }}>
          {`${normalizedValue}`}
        </Text>
        {image}
      </Box>
    </Box>
  );
}
