import express from "express";
import dotenv from "dotenv";
import pool from "./src/database/db.js";
import cors from "cors";
import repositoryRoutes from "./src/repository/repository.routes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.Client,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});