import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const workerClient = axios.create({
  baseURL: process.env.Worker,
   headers: {
    "Content-Type": "application/json",
  },
});

export default workerClient;