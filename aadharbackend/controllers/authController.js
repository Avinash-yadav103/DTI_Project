const { getUserData } = require("../services/userService");
const firebaseConfig = require("../config/firebaseConfig");


const logout = async (req,res) => {
  try {
    const data = req.body;
    console.log("[Logout request from Clinet] :",data);
    
    if (!data) {
      return res.send(400).json({
        success: false,
        message:"Invalid request MEOW"
      })
    }
    const userID = data.userID;
    let role = data.role;
    if (role === "doctor" || role === "patient") {
      role += "s";
    }

    const { db } = firebaseConfig;
    
    // Check if user exists before updating
    const userDoc = await db.collection(role).doc(userID).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update the loggedIn status
    await db.collection(role).doc(userID).update({ loggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (e) {
    console.log("Error while processing logout request: ", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const login = async (req, res) => {
  try {
    const data = req.body;
    console.log("[ Login data from Client ] : ", data);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // Getting the required data from the request
    const userID = data.userID;
    const role = data.role;
    const password = data.password;

    const valid_roles = ["patients", "doctors", "government"];
    if (!valid_roles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const userData = await getUserData(userID, role, password);
    if (userData) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: userData,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (e) {
    console.log("Error while processing login request: ", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  login ,
   logout
};