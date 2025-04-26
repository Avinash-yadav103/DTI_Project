const { admin, db } = require("../config/firebaseConfig");
const userDataStore = require("../services/userDataStore.js");
const { generateUserId, hashPassword } = require("../utils/cryptoUtils");
const { createPatientWallet } = require("../services/createWallet");

const registerUser = async (req, res) => {
  console.log("Registration request received:", req.body);
  const data = req.body;

  // Validate that required form data exists
  if (!data) {
    return res.status(400).json({
      success: false,
      message: "Missing registration data",
    });
  }

  // Log userDataStore keys
  const keys = Object.keys(userDataStore);
  if (keys.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No verification data found. Please complete OTP verification first.",
    });
  }

  console.log("Available users in userDataStore:", keys);

  const latestAadhar = keys.reduce((latest, key) => {
    const user = userDataStore[key];
    if (
      user.otp_verification_data &&
      user.timestamp > (userDataStore[latest]?.timestamp || 0)
    ) {
      return key;
    }
    return latest;
  }, null);

  console.log("Latest Aadhaar found:", latestAadhar);

  if (!latestAadhar || !userDataStore[latestAadhar]) {
    return res.status(400).json({
      success: false,
      message: "No valid Aadhaar found. Please verify again.",
    });
  }

  const userInfo = userDataStore[latestAadhar];
  const verificationData = userInfo.otp_verification_data;
  const plainPassword = userInfo.password;

  if (!verificationData || !plainPassword) {
    return res.status(400).json({
      success: false,
      message: "Verification or password data missing. Please retry verification.",
    });
  }

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = hashPassword(plainPassword);
    if (!hashedPassword) throw new Error("Hashing returned null");
  } catch (err) {
    console.error("Password hashing failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while securing password.",
    });
  }

  // Wallet generation
  let walletAddress = "", privateKey = "";
  try {
    const result = await createPatientWallet();
    if (result && result.success) {
      walletAddress = result.wallet.address;
      privateKey = result.wallet.privateKey;
    } else {
      throw new Error(result?.error || "Wallet creation failed");
    }
  } catch (error) {
    console.error("Error in wallet creation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate wallet. Please try again.",
    });
  }

  const userId = generateUserId(latestAadhar, plainPassword);

  let vaccines = Array.isArray(data.vaccines)
    ? data.vaccines
    : (data.vaccines || "").split(",").map((v) => v.trim()).filter(Boolean);

  let allergies = Array.isArray(data.allergiesDetails)
    ? data.allergiesDetails
    : (data.allergiesDetails || "").split(",").map((a) => a.trim()).filter(Boolean);
    let conditions = Array.isArray(data.conditions)
      ? data.conditions
      : (data.conditions || "").split(",").map((c) => c.trim()).filter(Boolean);
      
  const userData = {
    id: userId,
    aadharId: latestAadhar,
    password: hashedPassword,
    name: verificationData.name || "",
    gender: verificationData.gender || "",
    dob: verificationData.date_of_birth || "",
    address: verificationData.full_address || "",
    photoUrl: verificationData.photo || "",
    role: "patient",
    height: data.height || "",
    weight: data.weight || "",
    contact: data.emergencyContact || "",
    age: data.age || "",
    currentMedications: data.medications || "",
    walletAddress: walletAddress || "",
    privateKey: privateKey || "",
    medicalDetails: {
      bloodGroup: data.bloodType || "",
      allergies: allergies,
      emergencyContact: data.emergencyContact || "",
    },
    medicalHistory: conditions,
    vaccinationHistory: vaccines,
    loggedIn: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    const docRef = db.collection("patients").doc(userId);
    const doc = await docRef.get();

    if (doc.exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    await docRef.set(userData);
    delete userDataStore[latestAadhar];

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Firestore error:", err);
    return res.status(500).json({
      success: false,
      message: "Database error during registration",
    });
  }
};

module.exports = {
  registerUser,
};
