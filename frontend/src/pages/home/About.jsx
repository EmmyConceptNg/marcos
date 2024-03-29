import { Box, Grid, Stack } from '@mui/material'
import Text from '../../components/Text';
import { FeaturedIcon } from '../../components/svgs/FeaturedIcon';
import ElectricuteIcon from '../../components/svgs/ElectricuteIcon';
import EffecientIcon from '../../components/svgs/EfficientIcon';


export default function About() {
  return (
    <Box>
      <Box>
        <Text
          color="#131C30"
          fw="550"
          fs={{ md: "48px", lg: "48px", sm: "30px", xs: "20px" }}
          lh={{ md: "50px", lg: "67.2px", sm: "30px", xs: "25px" }}
          sx={{
            mb: "20px",
            textAlign: {
              lg: "center",
              md: "center",
              sm: "center",
              xs: "center",
            },
            mx: { md: "0px", lg: "150px", xl: "350px", sm: "0px", xs: "0px" },
            mt: 10,
          }}
        >
          Te mereces un Credito Asombroso Eleva tu puntuacion hasta 75 puntos.
        </Text>
      </Box>
      <Box mt={7}>
        <Grid container justifyContent="space-between">
          {[
            {
              name: "Rapidez",
              description:
                "Iniciate con solo par de clics, envia por correo las disputas desde la comodidad de tu casa",
            },
            {
              name: "Efectividad",
              description:
                "Resuelva Disputas de manera facil y efectiva. Usamos la tecnologiamas avanzada para que obtengas resultados justos",
            },
            {
              name: "Eficiencia",
              description:
                "Cada carta generada por AI es unica, cientos de variants para una misma disputa",
            },
          ].map((item, index) => (
            <Grid item md={6} lg={3} xl={3} sm={12} xs={12} key={index}>
              <Stack justifyContent="space-between" alignItems="center">
                {index === 0 ? (
                  <FeaturedIcon />
                ) : index === 1 ? (
                  <ElectricuteIcon />
                ) : (
                  <EffecientIcon />
                )}
                <Text
                  color="#131C30"
                  fw="550"
                  fs={{ md: "27px", lg: "27px", sm: "20px", xs: "15px" }}
                  sx={{
                    mb: "20px",
                    textAlign: "center",
                  }}
                >
                  {item?.name}
                </Text>
                <Text
                  color="#475467"
                  fw="400"
                  fs={{ md: "16px", lg: "16px", sm: "15px", xs: "10px" }}
                  sx={{
                    mb: "20px",
                    textAlign: "center",
                  }}
                >
                  {item?.description}
                </Text>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

 
