const axios = require("axios");
const { updateEnvFile } = require("../utils/envUtils");
require("dotenv").config(); // Correctly load environment variables

// Function to generate a new access token
const generateAccessToken = async () => {
  const url = "https://api.sandbox.co.in/authenticate";
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "x-api-secret": process.env.API_SECRET,
    "x-api-version": "1.0",
  };

  // Validate environment variables
  if (!process.env.API_KEY || !process.env.API_SECRET) {
    throw new Error("API_KEY or API_SECRET is not defined in the environment variables.");
  }

  try {
    console.log("Generating access token...");
    const response = await axios.post(url, {}, { headers });
    const responseData = response.data;

    if (response.status === 200 && responseData.access_token) {
      const newAccessToken = responseData.access_token;
      console.log("Access token generated successfully:", newAccessToken);

      // Update the .env file with the new access token
      updateEnvFile("ACCESS_TOKEN", newAccessToken);

      return newAccessToken;
    } else {
      console.error(
        "Failed to generate access token:",
        responseData.message || "Unknown error"
      );
      throw new Error(
        responseData.message || "Failed to generate access token"
      );
    }
  } catch (error) {
    console.error("Error generating access token:", error.message);

    // Log additional error details if available
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    throw error;
  }
};

module.exports = {
  generateAccessToken,
};