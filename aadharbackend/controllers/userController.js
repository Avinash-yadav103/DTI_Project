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

// Add this method to your userController
const updateUserProfile = async (req, res) => {
  try {
    const { aadhaarId, profileData } = req.body;
    
    if (!aadhaarId) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar ID is required'
      });
    }
    
    console.log("Updating profile for user:", aadhaarId);
    console.log("Profile data received:", JSON.stringify(profileData, null, 2));
    
    // Find the user in MongoDB
    const User = require('../models/User'); // Adjust path as needed
    const user = await User.findOne({ aadhaarId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided Aadhaar ID'
      });
    }
    
    // Update basic user fields
    if (profileData.name) user.name = profileData.name;
    if (profileData.email) user.email = profileData.email;
    if (profileData.phone) user.phone = profileData.phone;
    if (profileData.fullAddress) user.fullAddress = profileData.fullAddress;
    if (profileData.dateOfBirth) user.dateOfBirth = profileData.dateOfBirth;
    if (profileData.gender) user.gender = profileData.gender;
    if (profileData.bio) user.bio = profileData.bio;
    
    await user.save();
    console.log("User basic info updated");
    
    // Update medical info if that model exists
    try {
      const MedicalInfo = require('../models/MedicalInfo'); // Adjust path as needed
      let medicalInfo = await MedicalInfo.findOne({ patientId: aadhaarId });
      
      if (medicalInfo && profileData.medicalInfo) {
        // Update existing medical info
        if (profileData.medicalInfo.bloodType) medicalInfo.bloodType = profileData.medicalInfo.bloodType;
        if (profileData.medicalInfo.height) medicalInfo.height = profileData.medicalInfo.height;
        if (profileData.medicalInfo.weight) medicalInfo.weight = profileData.medicalInfo.weight;
        if (profileData.medicalInfo.allergies) medicalInfo.allergies = profileData.medicalInfo.allergies;
        if (profileData.medicalInfo.chronicConditions) medicalInfo.chronicConditions = profileData.medicalInfo.chronicConditions;
        
        // Update emergency contact info
        if (profileData.emergencyContact) {
          medicalInfo.emergencyContact = profileData.emergencyContact;
        }
        
        medicalInfo.updatedAt = Date.now();
        await medicalInfo.save();
        console.log("Medical info updated");
      } else if (profileData.medicalInfo) {
        // Create new medical info
        const newMedicalInfo = new MedicalInfo({
          patientId: aadhaarId,
          bloodType: profileData.medicalInfo.bloodType,
          height: profileData.medicalInfo.height,
          weight: profileData.medicalInfo.weight,
          allergies: profileData.medicalInfo.allergies || [],
          chronicConditions: profileData.medicalInfo.chronicConditions || [],
          emergencyContact: profileData.emergencyContact || {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        
        await newMedicalInfo.save();
        console.log("New medical info created");
      }
    } catch (medicalError) {
      console.error("Error updating medical info:", medicalError);
      // Continue with response even if medical info update fails
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  updateUserProfile
};
