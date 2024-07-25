import { Box, Stack } from "@mui/material";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import StarIcon from "../../../components/svgs/StarIcon";
import { Helmet } from "react-helmet";

export default function Deals(){
    return (
      <>
        <Helmet>
          <title>Deals</title>
        </Helmet>
        <Stack spacing={2}>
          {[
            {
              image: "cushion-ai.png",
              name: "Cushion Ai",
              description:
                "Cushion is your go-to app for organizing, paying, and building credit with your existing bills and Buy Now Pay Later. Simplify Your Bills. Build Credit.",
              link: "https://cushion.sjv.io/JzDdae",
              others: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              ],
            },
            {
              image: "credit-builder.png",
              name: "AWS Credit Builder",
              description:
                "Ava helps build your credit profile - fast. 74% of Ava members see a credit score improvement in less than 7 days.1",
              link: "https://meetava.sjv.io/DK4drq",
              others: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              ],
            },
            {
              image: "self.png",
              name: "Self",
              description:
                "Using Self's Credit Builder Account can get you an average credit score bump of 49 points.",
              link: "https://self.inc/refer/14128289",
              others: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              ],
            },
            {
              image: "boost.png",
              name: "Boost Your Score",
              description: "Credit Boosting Made Easy.",
              link: "https://boostyourscore.pxf.io/angvGo",
              others: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              ],
            },
            {
              image: "cheese.png",
              name: "Cheese Credit Builder",
              description:
                "Stay On Top Of Your Credit By Opening A Credit Builder Account With Cheese",
              link: "https://cheesecreditbuilder.sjv.io/Y9eZ9e",
              others: [
                "Build with all 3 credit bureaus.",
                "No admin or membership fee.",
                "No admin or membership fee.",
              ],
            },
            {
              image: "stellar.png",
              name: "Stellar Fi",
              description:
                "With StellarFi, your bills are paid on time and reported to the major credit bureaus.",
              link: "https://stellarfi.pxf.io/5gro2D",
              others: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              ],
            },
            {
              image: "chime.png",
              name: "Chime",
              description:
                "No monthly fees. 60k+ ATMs. Build credit. Get fee-free overdraft up to $200.¹ Chime is a tech co, not a bank. Banking services provided by bank partners..",
              link: "https://chime.com/r/marcosmartinez121",
              others: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              ],
            },
          ].map(({ image, name, description, link, others }) => (
            <Box
              key={name}
              width="100%"
              height="100%"
              borderRadius="20px"
              bgcolor="#fff"
              py={3}
              px={{ sm: 3, xs: 1 }}
            >
              <Stack
                direction={{ sm: "row", xs: "column" }}
                justifyContent={{ md: "space-evenly", xs: "flex-start" }}
                spacing={{ sm: 4, xs: 2 }}
                alignItems="center"
              >
                <Stack
                  sx={{
                    flexBasis: { sm: "50%" },
                    maxWidth: { sm: "50%" },
                    width: "100%",
                  }}
                  spacing={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Box
                    component="img"
                    src={`/assets/images/${image}`}
                    width="150px"
                  />
                  <Text fs="16px" fw="400" color="#475467">
                    {description}
                  </Text>
                  <Button
                    width={{ xs: "100%", sm: "165px" }}
                    height="45px"
                    variant="contained"
                    onClick={() => window.open(link, "_blank")}
                  >
                    Get offer
                  </Button>
                </Stack>
                <Stack
                  spacing={2}
                  sx={{
                    flexBasis: { sm: "50%" },
                    maxWidth: { sm: "50%" },
                    width: "100%", // Take full width on very small screens
                  }}
                >
                  {others.map((item, index) => (
                    <Stack
                      direction="row"
                      spacing={3}
                      key={index}
                      alignItems="center"
                    >
                      <StarIcon />
                      <Text fw="550" fs="15px" color="#131C30">
                        {item}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </>
    );
}