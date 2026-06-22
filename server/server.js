import express from "express";
import dotenv from "dotenv";
import pool from "./src/database/db.js";
import cors from "cors";
import repositoryRoutes from "./src/repository/repository.routes.js";
import authRoutes from "./src/auth/auth.routes.js";
import aiRoutes from "./src/ai/ai.routes.js";
import chatRoutes from "./src/chat/chat.routes.js";
import billingRoutes from "./src/billing/billing.routes.js";
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Repository Server Running"
  });
});

app.get("/health", async (req, res) => {
  try {
    // const result = await pool.query("create table server_test (name varchar(50));");
    const result = await pool.query("select * from server_test;");

    res.json({
      status: "healthy",
      database: "connected",
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});


app.use("/api/repository", repositoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", billingRoutes);



app.listen(5000, () => {
  console.log("Server is running on port 5000");
});