import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/User.js";
import subscriptionRoutes from "./routes/Subscription.js";
import plaidController from "./routes/Plaid.js";


/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

/* ROUTES */
app.use('/api/auth', userRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/plaid', plaidController)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("================================================");
    console.log(`============== Connected to MongoDB ==============`);
    
    app.listen(PORT, () => {
      console.log("================================================");
      console.log(`====== Server is running on ${PORT} ==============`);
      console.log("================================================");
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
