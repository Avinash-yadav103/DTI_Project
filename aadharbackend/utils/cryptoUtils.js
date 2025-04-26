const crypto = require("crypto");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const generateUserId = (aadhaarId, password) => {
  return crypto
    .createHash("sha256")
    .update(aadhaarId + password)
    .digest("hex")
    .substring(0, 10);
};

module.exports = {
  hashPassword,
  generateUserId
};