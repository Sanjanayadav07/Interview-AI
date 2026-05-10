import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

console.log("STRIPE SECRET =>", process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://interview-ai-client-seven.vercel.app"
  ],
  credentials: true
}));

app.options("*", cors());
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());


// ✅ Root Route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});


// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

connectDb();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
