import axios from "axios";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // Important if using cookies for authentication
});

// For new user registration
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post("/users", userData);
    return data;
  } catch (error) {
    throw error.response?.data?.msg || "Registration failed";
  }
};

// For user login
export const loginUser = async (userData) => {
  try {
    const { data } = await api.post("/auth", userData);
    return data;
  } catch (error) {
    throw error.response?.data?.msg || "Login failed";
  }
};

