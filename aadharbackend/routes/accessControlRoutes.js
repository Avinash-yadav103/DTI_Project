const express = require("express");
const {
  retrieveDoctors,
  grantAccess,
  revokeAccess
} = require("../controllers/accessController");

const router = express.Router();

// Routes for doctor access management
router.post("/grant", grantAccess);
router.post("/revoke", revokeAccess);

// Support both URL parameter and query parameter for retrieving doctors
router.get("/doctors/:uid", retrieveDoctors);
router.get("/doctors", retrieveDoctors);

module.exports = router;