import { Box, Grid, Stack } from "@mui/material";
import Text from "../../components/Text";

export default function Functions (){
    return (
      <Box>
        <Box>
          <Text
            color="#131C30"
            fw="550"
            fs={{ md: "48px", lg: "48px", sm: "30px", xs: "25px" }}
            sx={{
              textAlign: "center",
              mx: { md: "0px", lg: "150px", xl: "350px", sm: "0px", xs: "0px" },
              mt: {md : 20, lg: 20, xl: 20, sm: 10, xs:5},
            }}
          >
            Como Funciona?
          </Text>
          <Text
            color="#475467"
            fw="550"
            fs={{ md: "18px", lg: "18px", sm: "15px", xs: "10px" }}
            sx={{
              textAlign: "center",
              mx: { md: "0px", lg: "150px", xl: "350px", sm: "0px", xs: "0px" },
              mt: 3,
            }}
          >
            Obtén un crédito EXELENTE en solo 3 pasos
          </Text>
        </Box>
        <Grid
          
          container
          spacing={{ md: 10, lg: 10, xl :20, sm :5, xs: 2 }}
          justifyContent="flex-start"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Grid
            item
            xs={12}
            md={6}
            xl={6}
            lg={6}
            sx={{ display: "flex", pt: 5 }}
          >
            <Box display="flex">
              <Stack spacing={0}>
                {[
                  {
                    title: "Importe su reporte de crédito",
                    description:
                      "Simplemente cargue su reporte crediticio desde IdentityIQ, SmartCredit o MyScoreIQ. Usando nuestro sistema de importación de informes crediticios con 1 clic.",
                    color: "#FF9D43",
                  },
                  {
                    title: "Cree una carta de disputa",
                    description:
                      "Deja que nuestra AI haga el trabajo duro por ti, de forma rapida y efectiva.",
                    color: "#F2F4F7",
                  },
                  {
                    title:
                      "Deja que nuestra AI haga el trabajo duro por ti, de forma rapida y efectiva.",
                    description:
                      "Tiene la opción de enviar sus Cartas de Disputa directamente desde nuestro software mediante correo certificado. También puede descargar/imprimir sus cartas de disputa y luego enviarlas por correo desde su oficina postal local.",
                    color: "#F2F4F7",
                  },
                ].map((item, index) => (
                  <Stack
                    key={index}
                    borderLeft={`4px solid ${item?.color}`}
                    padding={2}
                  >
                    <Text
                      color="#131C30"
                      fw="550"
                      fs={{ md: "18px", lg: "20px", sm: "15px", xs: "12px" }}
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      {item?.title}
                    </Text>
                    <Text
                      color="#475467"
                      fw="400"
                      fs={{ md: "14px", lg: "16px", sm: "12px", xs: "10px" }}
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      {item?.description}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid item md={6} lg={6} xl={6} sm={12}>
            <Box>
              <Box
                component="img"
                src="/assets/images/functions.svg"
                sx={{
                  width: "100%",
                  height: "567.12px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
}