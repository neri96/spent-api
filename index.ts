import "dotenv/config";

import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import user from "./routes/user.route";
import transaction from "./routes/transaction.route";
import analytics from "./routes//analytics.route";

import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
    allowedHeaders: ["authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
console.log("CORS origin:", process.env.CLIENT);
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", user);
app.use("/api/transaction", transaction);
app.use("/api/analytics", analytics);

app.use(errorHandler);

const PORT = process.env.PORT || 5111;

mongoose.connect(process.env.MONGO_URI as string);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
