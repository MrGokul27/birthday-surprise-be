import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import birthdayRoutes from "./routes/birthday.routes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/birthday", birthdayRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
