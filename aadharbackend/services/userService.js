const crypto = require("crypto");
const firebaseConfig = require("../config/firebaseConfig");

// Function to get user data for login
const getUserData = async (userID, role, password) => {
  try {
    // Validate inputs
    if (!userID || !role || !password) {
      throw new Error("Missing required parameters: userID, role, or password");
    }

    // Log the input parameters for debugging
    console.log(`Attempting login: userID=${userID}, role=${role}`);
    
    const { db } = firebaseConfig;
    
    // Check if db is properly initialized
    if (!db) {
      console.error("Firestore database is not initialized properly");
      throw new Error("Database not initialized");
    }

    // Hash userID and password to generate user_id
    const hash = crypto.createHash("sha256");
    hash.update(userID + password, "utf8");
    const user_id = hash.digest("hex").substring(0, 10);
    console.log(`Generated user_id: ${user_id}`);

    // Fetch user document from Firestore
    const doc = await db.collection(role).doc(user_id).get();
    if (!doc.exists) {
      console.log(`No document found for userID: ${user_id} in role: ${role}`);

      // Try to find by aadharId (alternative lookup)
      console.log(`Trying alternative lookup by aadharId: ${userID}`);
      const querySnapshot = await db
        .collection(role)
        .where("aadharId", "==", userID)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        console.log(`No document found with aadharId: ${userID}`);
        return null;
      }

      // Use the first matching document
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verify password
      const storedPassword = userData.password || "";
      const hashedInputPassword = crypto
        .createHash("sha256")
        .update(password, "utf8")
        .digest("hex");

      if (storedPassword !== hashedInputPassword) {
        console.log(`Wrong password for aadharId: ${userID} in role: ${role}`);
        return null;
      }

      // Remove sensitive data before returning
      const { password: _, ...userDataWithoutPassword } = userData;
      return userDataWithoutPassword;
    }

    const userData = doc.data();

    // Verify password
    const storedPassword = userData.password || "";
    const hashedInputPassword = crypto
    .createHash("sha256")
    .update(password, "utf8")
    .digest("hex");
    
    if (storedPassword !== hashedInputPassword) {
      console.log(`Wrong password for userID: ${user_id} in role: ${role}`);
      return null;
    }
    
    await db.collection(role).doc(user_id).update({ loggedIn: true });
    // Remove sensitive data before returning
    const { password: _, ...userDataWithoutPassword } = userData;
    // Update the loggedin field to true
    return userDataWithoutPassword;
  } catch (e) {
    console.error(`Error during login: ${e.message}`);
    throw e; // Rethrow to be caught by error middleware
  }
};

module.exports = {
  getUserData
};