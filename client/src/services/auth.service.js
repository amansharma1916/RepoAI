import axios from "axios";
import serverClient from "../apiClient/serverClient";

export const googleAuth = async (credential) => {
  const response = await serverClient.post(
    "/auth/google",
    {
      credential,
    }
  );

  return response.data;
};


export const registerUser = async (userData) => {
  try {
    const response = await serverClient.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};


export const loginUser = async (userData) => {
  try {
    const response = await serverClient.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};