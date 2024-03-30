import { Box } from "@mui/material";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/home/Header";
import Hero from "./Hero";
import About from "./About";
import Functions from "./Functions";
import Pricing from "./Pricing";
import Reviews from "./Reviews";
import Links from "./Links";
import Footer from "./Footer";




export default function Home(){
    
    return (
      <Box>
        <Helmet>
          <title>Marcos - Home</title>
        </Helmet>
        <Box>
          <Box width="100%" bgcolor="#fff" py={10}>
            <Header />
         <Hero />
         <Box mx={{ md: '100px', xs: '20px' }}>

         <About />
         <Functions />
         
         <Pricing />
         <Reviews />
         <Links  />
         <Footer  />
         </Box>
          </Box>
        </Box>
      </Box>
    );
}