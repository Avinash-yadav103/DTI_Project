const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if app is already initialized to avoid multiple initializations
    if (admin.apps.length === 0) {
      const serviceAccountPath = path.join(__dirname, "./project-charak-firebase-adminsdk-fbsvc-d9521be673.json");
      const serviceAccount = require(serviceAccountPath);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      console.log("Firebase initialized successfully");
    } else {
      console.log("Firebase already initialized");
    }
    
    return admin.firestore();
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
};

// Initialize Firebase and get the database reference
const db = initializeFirebase();

module.exports = {
  initializeFirebase,
  admin,
  db
};