import { Box, Card, Divider, Grid, Stack } from "@mui/material";
import Text from "../../components/Text";
import Button from "../../components/Button";
import VideoCard from "./VideoCard";
import BulletPoint from "../../components/svgs/BulletPoint";
import Lists from "./Lists";

export default function Support(){
    return (
      <>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <Stack spacing={5}>
              <Stack
                direction={{ md: "row", xs: "column" }}
                justifyContent="space-between"
              >
                <Box>
                  <Text fw="600" fs="24px" color="#000">
                    Heading exmple is here for now
                  </Text>
                  <Text fw="400" fs="16px" color="#C2C2C2">
                    Posted 10.04.24
                  </Text>
                </Box>
                <Button
                  variant="contained"
                  width={{ md: "161px", xs: "100%" }}
                  height="45px"
                >
                  Leave a review
                </Button>
              </Stack>
              <VideoCard />
              <Divider />

              <Box>
                <Text fw="600" fs="24px" color="#000000" sx={{ mb: 2 }}>
                  Our numbers
                </Text>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BulletPoint />
                  <Text fw="600" fs="16px" color="#475467">
                    100+ Amazing clients reports
                  </Text>
                </Stack>
              </Box>
              <Divider />

              <Box>
                <Text fw="600" fs="24px" color="#000000" sx={{ mb: 2 }}>
                  Description
                </Text>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BulletPoint />
                  <Text fw="400" fs="16px" color="#475467">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse condimentum, tellus eget mollis dictum, tortor
                    nibh vehicula risus, in pulvinar tellus arcu quis lacus. In
                    pulvinar mollis leo vitae pellentesque. Suspendisse potenti.
                    Nam tortor lorem, vulputate vel feugiat suscipit, tincidunt
                    eu nibh. Morbi ornare dictum neque at semper. Aliquam nibh
                    nunc, tempor molestie nulla vitae, ultricies mattis lacus.
                    In ante felis, consectetur ac tempor quis, molestie in orci.
                    Curabitur at eros vel neque iaculis commodo et vel risus.
                    Fusce eleifend turpis nunc, at gravida leo sollicitudin sit
                    amet. Nulla pharetra libero in dignissim posuere.
                    Suspendisse potenti. Donec a fringilla ipsum. Fusce
                    vulputate massa sit amet augue rhoncus pellentesque. Aenean
                    a mattis mi. Nullam vitae nisl vehicula, scelerisque quam
                    id, sollicitudin metus. Donec auctor mauris eget erat
                    facilisis, eget porta justo venenatis. Mauris tortor ex,
                    ultrices ac est a, gravida tincidunt erat. Integer ac ipsum
                    dolor. Donec iaculis ligula a fringilla dapibus. Duis libero
                    enim, auctor quis lacinia ut, tempus eget magna. Sed rutrum
                    neque non orci cursus faucibus nec eu magna. Sed nec dolor
                    id mauris tempus iaculis elementum eget purus. Vestibulum
                    ante ipsum, ultricies id leo et, semper elementum velit.
                    Pellentesque interdum ac nunc et sollicitudin. Aenean
                    sagittis ac mi nec egestas. Vivamus in felis rutrum,
                    sagittis libero ut, maximus ante. Vestibulum imperdiet
                    consequat arcu in consectetur. Nulla at magna fermentum,
                    vulputate turpis a, imperdiet velit. Sed ornare ut orci sed
                    egestas. Nunc quis sollicitudin dolor, ac ullamcorper urna.
                    Suspendisse congue euismod metus, vitae facilisis leo
                    lacinia in. Etiam et mi felis. Integer laoreet tellus et
                    sapien auctor, eu tincidunt arcu venenatis. In in arcu quis
                    purus placerat venenatis quis a enim. Donec urna quam,
                    vehicula at enim vitae, vestibulum pellentesque quam. Donec
                    aliquam placerat convallis. Ut interdum iaculis nulla, et
                    mollis dui maximus eu.
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack spacing={5}>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  width={{ md: "161px", xs: "100%" }}
                  height="45px"
                >
                  Watch now
                </Button>
              </Stack>

              <Box
               p={2}
                bgcolor="#FFFFFF"
                border="1px solid #ECECEC"
                borderRadius="15px"
              >
                <Lists />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </>
    );
}