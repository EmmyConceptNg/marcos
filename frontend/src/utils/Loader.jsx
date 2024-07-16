import { useEffect, useState } from "react";
import { CircularProgress, Box, Fade } from "@mui/material";

export const PageLoader = ({ loading, text }) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoader(false), 1000); // Wait 1 second before hiding the loader
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      {showLoader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5",
            transition: "opacity 1s ease-in-out",
            opacity: loading ? 1 : 0,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Fade in={!loading} timeout={1000}>
          <Box>{/* Your actual page content goes here */}</Box>
        </Fade>
      )}
    </>
  );
};
