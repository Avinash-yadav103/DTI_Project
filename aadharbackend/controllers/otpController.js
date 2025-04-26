const axios = require("axios");
const userDataStore = require("../services/userDataStore.js");
const { getCurrentTimestamp } = require("../utils/envUtils");

// Controller for sending OTP
const sendOtp = async (req, res) => {
  const { aadhaarId, password } = req.body;

  if (!aadhaarId || aadhaarId.length !== 12 || !/^\d+$/.test(aadhaarId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Aadhaar number" });
  }

  userDataStore[aadhaarId] = {
    password,
    timestamp: getCurrentTimestamp(),
  };

  const url = "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp";
  const headers = {
    Authorization: process.env.ACCESS_TOKEN,
    "x-api-key": process.env.API_KEY,
    "x-api-version": "2.0",
    "Content-Type": "application/json",
  };
  const payload = {
    "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
    aadhaar_number: aadhaarId,
    consent: "y",
    reason: "For KYC",
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const { data } = response.data;

    if (response.status === 200 && data?.reference_id) {
      userDataStore[aadhaarId].reference_id = data.reference_id;
      return res.json({
        success: true,
        reference_id: data.reference_id,
        aadhaarId,
      });
    } else {
      return res
        .status(response.status)
        .json({
          success: false,
          message: response.data.message || "Failed to send OTP",
        });
    }
  } catch (error) {
    console.error("Error in /send-otp:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller for verifying OTP
const verifyOtp = async (req, res) => {
  const { otp, reference_id } = req.body;

  const aadharNumber =
    Object.keys(userDataStore).find(
      (key) => userDataStore[key].reference_id === reference_id
    );

  if (!aadharNumber || !userDataStore[aadharNumber]) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Session expired, please restart the verification process",
      });
  }

  if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP" });
  }

  const url = "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify";
  const headers = {
    Authorization: process.env.ACCESS_TOKEN,
    "x-api-key": process.env.API_KEY,
    "x-api-version": "2.0",
    "Content-Type": "application/json",
  };
  const payload = {
    "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
    reference_id: String(reference_id),
    otp: String(otp),
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const { data } = response.data;

    if (response.status === 200) {
      userDataStore[aadharNumber].otp_verification_data = data;
      return res.json({
        success: true,
        message: "OTP verified successfully",
        name: data.name,
        gender: data.gender,
        dob: data.date_of_birth,
        address: data.full_address,
        photo: data.photo,
      });
    } else {
      return res
        .status(response.status)
        .json({
          success: false,
          message: response.data.message || "Failed to verify OTP",
        });
    }
  } catch (error) {
    console.error("Error in /verify-otp:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};