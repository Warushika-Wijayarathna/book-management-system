import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rootRouter from "./routes";
import {errorHandler} from "./middlewares/errorHandler";
import {connectDB} from "./db/mongo";

const app = express()

const port = process.env.PORT || 3000;

dotenv.config()

// unable cors configuration
const corsOperations = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOperations));

app.use(express.json());
// handling JSON requests
app.use(cookieParser());

// calling api endpoints
app.use("/api", rootRouter)
// error handling middleware
app.use(errorHandler)

// connects MongoDB to the app
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
