import { Box } from "@mui/material";
import Button from "./Button";
import { ArrowForwardIos } from "@mui/icons-material";
import Text from "./Text";

export default function Components (){
    return (
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Button variant="contained" text="Click Me" />
        <Button rounded variant="contained" text="Click Me" />
        <Button variant="outlined" sx={{ color: "#000" }} text="Click Me" />
        <Button
          rounded
          variant="outlined"
          sx={{ color: "#000" }}
          text="Click Me"
          endIcon={<ArrowForwardIos />}
        />
        <Button text="Click Me" sx={{ color: "#000" }} />
        <Text color="#131C30" fs="47px" fw="550" lh="58px">
          Emmy
        </Text>
        <Text color="#475467" fs="20px" fw="300" lh="28px">
          Emmy
        </Text>
      </Box>
    );
}