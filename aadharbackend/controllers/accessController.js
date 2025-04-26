const { retrieveDoctors, grantAccess, revokeAccess } = require('../services/accessControlService');
const firebaseConfig = require("../config/firebaseConfig.js");

// Controller for retrieving doctors
const retrieveDoctorsController = async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log("🔍 Doctor access request received:", {
      params: req.params,
      query: req.query,
      path: req.path
    });
    
    // Get the user ID from the route parameter or query parameter
    const userID = req.params.uid || req.query.uid;
    
    if (!userID) {
      console.log("❌ Missing user ID in request");
      return res.status(400).json({
        success: false,
        message: "Missing user ID parameter"
      });
    }
    
    console.log(`📋 Retrieving doctors for user: ${userID}`);
    
    // Call the service function to get the doctors
    const doctors = await retrieveDoctors(userID);
    
    console.log(`✅ Found ${doctors.length} doctors for user ${userID}`);
    
    // Return the doctors as a JSON response
    return res.status(200).json({
      success: true,
      doctors: doctors
    });
  } catch (error) {
    console.error("❌ Error retrieving doctors:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: error.message
    });
  }
};

// Controller for granting access to a doctor
const grantAccessController = async (req, res) => {
  try {
    const { patientID, doctorID, privateKey } = req.body;
    
    if (!patientID || !doctorID || !privateKey) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters (patientID, doctorID, privateKey)"
      });
    }
    
    console.log(`🔑 Granting access for doctor ${doctorID} to patient ${patientID}`);
    
    const result = await grantAccess(patientID, doctorID, privateKey);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("❌ Error granting access:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to grant access",
      error: error.message
    });
  }
};

// Controller for revoking access from a doctor
const revokeAccessController = async (req, res) => {
  try {
    const { patientID, doctorID, privateKey } = req.body;
    
    if (!patientID || !doctorID || !privateKey) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters (patientID, doctorID, privateKey)"
      });
    }
    
    console.log(`🔒 Revoking access for doctor ${doctorID} from patient ${patientID}`);
    
    const result = await revokeAccess(patientID, doctorID, privateKey);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("❌ Error revoking access:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to revoke access",
      error: error.message
    });
  }
};

module.exports = {
  retrieveDoctors: retrieveDoctorsController,
  grantAccess: grantAccessController,
  revokeAccess: revokeAccessController
};