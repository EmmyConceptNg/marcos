import { Box, Grid } from '@mui/material';

import { Element } from 'react-scroll';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate()
  return (
    <Element name="home" className="section smooth-scroll">
      <Box>
        <Box
          display={{ md: "flex", lg: "flex", sm: "none", xs: "none" }}
          justifyContent="center"
        >
          <Box
            sx={{
              width: 300,
              height: 300,
              backgroundImage: `url('/assets/images/bg.svg')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "absolute",
            }}
          />
        </Box>
        <Grid
          pl={{ md: "100px", lg: "100px", sm: "14px", xs: "14px" }}
          pr={{ md: "0px", lg: "0px", sm: "14px", xs: "14px" }}
          container
          spacing={{ md: 1, lg: 1, sm: 0, xs: 0 }}
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Grid item xs={12} md={6} lg={6} sx={{ display: "flex", pt: 5 }}>
            <Box sx={{ my: "auto" }} width="100%">
              <Text
                color="#131C30"
                fw="550"
                fs={{ md: "47px", lg: "47px", sm: "30px", xs: "25px" }}
                lh={{ md: "58px", lg: "58px", sm: "40px", xs: "30px" }}
                sx={{
                  mb: "20px",
                  textAlign: {
                    lg: "left",
                    md: "left",
                    sm: "center",
                    xs: "center",
                  },
                }}
              >
                Eleva Tu Puntuaje De Credito FACIL, RAPIDO y EFECTIVO Con ayuda
                de la AI.
              </Text>
              <Text
                color="#131C30"
                fw="300"
                fs={{ md: "20px", lg: "20px", sm: "18px", xs: "15px" }}
                lh={{ md: "28px", lg: "28px", sm: "20px", xs: "20px" }}
                sx={{
                  mb: "30px",
                  textAlign: {
                    lg: "left",
                    md: "left",
                    sm: "center",
                    xs: "center",
                  },
                }}
              >
                CreditoAlfa es el primer software de reparación de crédito
                diseñado por Hispanos para hispanos impulsado por Inteligencia
                Artificial. ¡Únete a la revolución de Credito Alfa y lleva tus
                Finanzas a la cima!
              </Text>
              <Box display="flex" gap="25px">
                <Button
                  sx={{
                    mx: {
                      md: 0,
                      lg: 0,
                      xs: "auto",
                      sm: "auto",
                    },
                  }}
                  rounded
                  width="165px"
                  onClick={() => navigate("/")}
                  variant="contained"
                  size="large"
                >
                  Get Started
                </Button>
                <Button
                  endIcon={<ArrowForwardIos />}
                  sx={{
                    mx: {
                      md: 0,
                      lg: 0,
                      xs: "auto",
                      sm: "auto",
                    },
                  }}
                  color="#333333"
                  width="180px"
                  rounded
                  onClick={() => navigate("/")}
                  variant="outlined"
                  size="large"
                >
                  Chat with Sales
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item md={6} lg={6} sm={12}>
            <Box
              display={{
                md: "flex",
                lg: "flex",
                sm: "none",
                xs: "none",
              }}
              justifyContent="flex-end"
            >
              <Box
                component="img"
                src="/assets/images/hero-img.svg"
                sx={{
                  width: "100%",
                  height: "645px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Element>
  );
}


