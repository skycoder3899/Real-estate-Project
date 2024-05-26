import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: "160kb" }))
app.use(express.urlencoded({ extended: true, limit: "160kb" }))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter)
import sellerRouter from "./routes/seller.routes.js"
app.use("/api/v1/seller",sellerRouter);
import buyerRouter from "./routes/buyer.routes.js"
app.use("/api/v1/buyer",buyerRouter);



export { app }