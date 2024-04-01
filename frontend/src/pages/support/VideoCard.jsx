import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";



export default function VideoCard() {


  return (
    <Card elevation={0}>
      <CardMedia
        sx={{
          mb: "10px",
          display: { md: "block", lg: "block", xs: "block", sm: "block" },
          position: "relative",
          paddingTop: "56.25%", // 16:9 aspect ratio
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/wnLkl-wLA5Q?si=J8cHmi9uCmD9yALv"
          title=""
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </CardMedia>
    </Card>
  );
}
