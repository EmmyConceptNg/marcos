import { Box, Card, CardActions, CardContent, CardMedia, Grid, Stack } from "@mui/material";
import Text from "../../../components/Text";
import { ArrowOutward } from "@mui/icons-material";
import { Helmet } from "react-helmet";

export default function Learn(){
    
    return (
      <Box>
        <Helmet>
            <title>Learn</title>
        </Helmet>
        <Stack spacing={6}>
          <Text fs="20px" fw="550" color="#101828">
            All blog posts
          </Text>

          <Box>
            <Grid container spacing={3}>
              {[
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking", "finance"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking", "finance"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking", "finance"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking"],
                },
                {
                  title: "Lorem ipsum dolor",
                  author: "Alec Whitten",
                  date: "17 Jan 2022",
                  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  image: "blog-img.svg",
                  tags: ["banking", "finance"],
                },
              ].map((item, index) => (
                <Grid lg={3} md={3} sm={6} xs={12} item key={index}>
                  <Card
                    sx={{
                      maxWidth: "348.67px",
                      borderRadius: "15px",
                      bgcolor: "transparent",
                    }}
                    elevation={0}
                  >
                    <CardMedia
                      component="img"
                      height="240px"
                      image={`/assets/images/${item.image}`}
                      alt={item.title}
                    />
                    <CardContent>
                      <Text fw="550" fs="14px" color="#B7B7B7">
                        {item.author} • {item.date}
                      </Text>
                      <Stack direction="row" justifyContent="space-between">
                        <Text fw="550" fs="24px" color="#131C30">
                          {item.title}
                        </Text>
                        <ArrowOutward />
                      </Stack>
                      <Text fw="400" fs="16px" color="#B7B7B7">
                        {item.desc}
                      </Text>
                    </CardContent>

                    <CardActions>
                      {item.tags.map((tag, _index) => (
                        <Box
                          key={_index}
                          bgcolor="#FFF5EB"
                          sx={{
                            cursor: "pointer",
                            padding: "2px 10px 2px 10px",
                          }}
                        >
                          <Text fw="400" fs="16px" color="#FF9D43">
                            {tag}
                          </Text>
                        </Box>
                      ))}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="center">
              {Array(10)
                .fill()
                .map((item, index) => (
                  <Box width="40px" sx={{ cursor : 'pointer' }} height="40px" borderRadius='8px' display="flex" justifyContent="center" alignItems="center" key={index} bgcolor={index > 0 ? "transparent" : "#fff"}>
                    <Text fw="550" fs="14px" color="#1D2939">
                       {index + 1}
                    </Text>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
}