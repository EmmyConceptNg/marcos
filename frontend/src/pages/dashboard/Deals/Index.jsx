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
                "Bills. Utilities. Subscriptions. BNPL. Our AI organizes it all to simplify your expenses and keep you on track. Buh-bye late fees.",
                "Wasting money is the worst. We help you find and cancel unwanted subscriptions, putting more cash back in your stash.",
                "Get more out of every day expenses! Pay bills, subscriptions,and even BNPL with Cushiorfs virtual debit card to build credit.",
                "One app to track all your recurring expenses. Securely link your bank and email. We'll find and neatly organize your recurring bills and Buy Now Pay Later.",
              ],

            },
            {
              image: "credit-builder.png",
              name: "AWS Credit Builder",
              description:
                "Ava helps build your credit profile - fast. 74% of Ava members see a credit score improvement in less than 7 days.1",
              link: "https://meetava.sjv.io/DK4drq",
              others: [
                "Credit Building: Ava Credt Builder helps users build or improve their credit scores by reporting their monthly payments to major credit bureaus, even if they don't have an existing credit history.",
                "No Credit Check: Users can sign up without a credit check, making it accessible for those with poor or no credit history.",
                "Flexible Payments: It offers flexible payment plans, allowing users to choose payment amounts that fit their budgets.",
                "Educational Resources: Provides financial education resources and tools to help users understand credit and manage their finances better.",
              ],
              
            },
            {
              image: "self.png",
              name: "Self",
              description:
                "Using Self's Credit Builder Account can get you an average credit score bump of 49 points.",
              link: "https://self.inc/refer/14128289",
              others: [
                "Credit Score Improvement: Self Credit Builder helps indviduals build or improve their credit score by reporting monthly payments to the major credit bureaus.",
                "Savings Component: As users make monthly payments, the funds accumulate in a certificate of deposit (CD) or savings account, allowing them to save money while building credit.",
                "Low Barrier to Entry: It is accessible to people with poor or no credit history, offering a strai#orward way to start building credit without needng a hiél initial deposit.",
                "Flexible Plans: Self Credit Builder provides various plan options with different amounts and terms, allowing users to choose a plan that fits their budget and financial goals.",
              ],
            },
            {
              image: "boost.png",
              name: "Boost Your Score",
              description: "Credit Boosting Made Easy.",
              link: "https://boostyourscore.pxf.io/angvGo",
              others: [
                "Credit Building: Boost Your Score Credit Builder PROVIDES A SECURED CREDIT CARD and helps indviduals improve their credit scores by reporting their monthly payments to major credit bureaus.",
                "User-Friendly: It is designed to be easy to use, making it accessible for people new to credit building.",
                "Monitoring and Alerts: The service often includes credit monitoring and alerts, keeping users informed about changes to their credit profiles.",
                "Educational Resources: Provides educational materials and tools to help users understand credit scores and how to manage their credit responsibly.",
              ],
            },
            {
              image: "cheese.png",
              name: "Cheese Credit Builder",
              description:
                "Stay On Top Of Your Credit By Opening A Credit Builder Account With Cheese",
              link: "https://cheesecreditbuilder.sjv.io/Y9eZ9e",
              others: [
                "Automatic Savings: Each payment builds savings in a separate account, which can be withdrawn anytime.",
                "No Credit Check: Approval without a credit check, making it accessible for those with poor or no credit history.",
                "Interest-Free: Offers a zero-interest plan, avoiding addtional costs for users.",
                "Monthly Regularly reports to all three major credit bureaus, helping to build or improve credit scores.",
              ],
     
            },
            {
              image: "stellar.png",
              name: "Stellar Fi",
              description:
                "With StellarFi, your bills are paid on time and reported to the major credit bureaus.",
              link: "https://stellarfi.pxf.io/5gro2D",
              others: [
                "Credit Reporting: StellarFi reprts monthly payments directly to all three major credit bureaus (Experian, Equifax, and TransUnion), helping to build credit scores.",
                "Bill Payment Integration: It allows users to link various bill payments, such as rent, utilities, and subscriptions, to be reported as positive payment history.",
                "No Credit Check: StellarFi does not require a credit check for users to enroll, making it accessible to individuals with low or no credit history.",
                "Membership Plans: Offers multiple membership plans with different features and benefits, providing flexibility and catering to various financial needs.",
              ],
            },
            {
              image: "chime.png",
              name: "Chime",
              description:
                "No monthly fees. 60k+ ATMs. Build credit. Get fee-free overdraft up to $200.¹ Chime is a tech co, not a bank. Banking services provided by bank partners..",
              link: "https://chime.com/r/marcosmartinez121",
              others: [
                "No Credit Check: Chime Credit Builder does not require a credt check to apply, making it accessible for individuals with no credt or bad crecit.",
                "Fee-Free: There are no annual fees, interest charges, or maintenance fees associated with the Chime Credit Builder card.",
                "Credit Reporting: Payments made with the Credit Builder card are reported to all three major credit bureaus (Experian, Equifax, and TransUnion), helping to build credit history.",
                "Flexible Spending: The card allows users to spend money that they transfer from their Chime Spending Account, providing control over spending and avoiding debt accumulation.",
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