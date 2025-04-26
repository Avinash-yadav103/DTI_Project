const fs = require("fs");

const updateEnvFile = (key, value) => {
  const envFilePath = "./.env";
  let envContent = fs.readFileSync(envFilePath, "utf8");

  const keyRegex = new RegExp(`^${key}=.*`, "m");
  if (keyRegex.test(envContent)) {
    // Replace the existing key-value pair
    envContent = envContent.replace(keyRegex, `${key}=${value}`);
  } else {
    // Add the new key-value pair
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(envFilePath, envContent, "utf8");
  console.log(`Updated ${key} in .env file.`);
};

// Helper function to get current timestamp
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

module.exports = {
  updateEnvFile,
  getCurrentTimestamp
};