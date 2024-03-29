import { Box, Grid, Stack } from "@mui/material";
import Text from "../../components/Text";
import Check from "../../components/svgs/Check";
import Button from "../../components/Button";

export default function Pricing() {
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
            mt: { md: 20, lg: 20, xl: 20, sm: 10, xs: 5 },
          }}
        >
          Mejora tu Credito ya!!
        </Text>
        <Text
          color="#475467"
          fw="550"
          fs={{ md: "18px", lg: "18px", sm: "15px", xs: "12px" }}
          sx={{
            textAlign: "center",
            mx: { md: "0px", lg: "150px", xl: "350px", sm: "0px", xs: "0px" },
            mt: 3,
          }}
        >
          Obtén 30 días de prueba gratis, no hay fees, sistema 100% basado en
          créditos de pago por uso.
        </Text>
      </Box>
      <Grid container spacing={5} justifyContent={"flex-end"} sx={{ mt: 1 }}>
        {[
          {
            name: "self",
            desc: "Do it Yourself",
            amount: "$49.97",
          },
          {
            popular: true,
            name: "Family",
            desc: "Do it Yourself",
            amount: "$49.97",
          },
          {
            name: "Business",
            desc: "Do it Yourself",
            amount: "$49.97",
          },
        ].map((item, index) => (
          <Grid
            key={index}
            item
            xs={12}
            md={6}
            xl={4}
            lg={4}
            sx={{ display: "flex", pt: 5 }}
          >
            <Box
              width="100%"
              height="551px"
              bgcolor="#fff"
              border={!item?.popular && "1px solid #ECECEC"}
              borderRadius="16px"
              sx={{
                boxShadow: !item?.popular
                  ? "0px 4px 20px -4px #1018281A"
                  : " 0px 4px 40.20000076293945px -4px #FF6B0045",

                borderRadius: "16px",
                ...(item?.popular && {
                  border: "1px solid transparent",
                  borderImageSource:
                    "linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)",
                  borderImageSlice: 1,
                }),
              }}
            >
              <Stack spacing={2} justifyContent='flex-end' sx={{ padding: "35px 32px 0 32px" }}>
                <Text
                  background=" linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                  fw="550"
                  fs={{ md: "30px", lg: "30px", sm: "30px", xs: "30px" }}
                  sx={{
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  {item?.name}
                </Text>
                <Text
                  color="#B7B7B7"
                  fw="550"
                  fs={{ md: "20px", lg: "20px", sm: "20px", xs: "20px" }}
                  sx={{
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  {item?.desc}
                </Text>
                <Text
                  background=" linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
                  fw="400"
                  fs={{ md: "41px", lg: "41px", sm: "41px", xs: "41px" }}
                  sx={{
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  {item?.amount}
                </Text>

                <Stack spacing={2}>
                  {[
                    "200+ integrations",
                    "Advanced reporting and analytics",
                    "Up to 20 individual users",
                    "40GB individual data each user",
                    "Priority chat and email support",
                  ].map((_item, _index) => (
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="flex-start"
                      key={_index}
                    >
                      <Check />
                      <Text
                        color="#475467"
                        fw="400"
                        fs={{ md: "16px", lg: "16px", sm: "16px", xs: "16px" }}
                        sx={{
                          textAlign: "start",
                        }}
                      >
                        {_item}
                      </Text>
                    </Box>
                  ))}
                </Stack>
                <Box p="32px">
                  <Button variant="contained" width="100%">
                    Upgrade
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
