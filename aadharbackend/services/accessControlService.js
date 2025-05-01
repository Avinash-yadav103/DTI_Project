const firebaseConfig = require("../config/firebaseConfig.js");
const fs = require('fs');
const path = require('path');

// Function to get available doctors with their details
const retrieveDoctors = async (userID) => {
    try {
        let { db } = firebaseConfig;
        // Get patient document using userID
        const userDoc = await db.collection('patients').doc(userID).get();
        
        if (!userDoc.exists) {
            console.log('No patient found with this ID');
            return [];
        }
        
        const userData = userDoc.data();
        let doctorIDs = [];
        
        // Check if doctors field exists and get as array
        if (userData.doctors && Array.isArray(userData.doctors)) {
            doctorIDs = userData.doctors;
            console.log(doctorIDs);
        } else if (userData.doctors) {
            // If doctors exists but not as array, convert to array
            doctorIDs = [userData.doctors];
        } else {
            // If no doctors field exists
            console.log('No doctors assigned to this patient');
            return [];
        }

        // Retrieve doctor details from doctors collection
        const doctorsDetails = [];
        for (const doctorID of doctorIDs) {
            console.log("Looking for doctor with ID:", doctorID);
            const doctorQuerySnapshot = await db.collection('doctors')
                .where('userId', '==', doctorID)
                .limit(1)
                .get();
            
            if (!doctorQuerySnapshot.empty) {
                const doctorData = doctorQuerySnapshot.docs[0].data();
                doctorsDetails.push({
                    id: doctorID,
                    name: doctorData.name || '',
                    specialty: doctorData.department || '',
                    hospital: doctorData.hospital_affiliation || '',
                });
            } else {
                console.log(`No doctor found with ID: ${doctorID}`);
            }
        }
        console.log("In total doctor details:", doctorsDetails);
        
        return doctorsDetails;
    } catch (error) {
        console.log("Error while retrieving available doctors", error);
        return [];
    }
};

// Helper function to update Firebase with access changes
async function updateDoctorAccess(patientID, doctorID, hasAccess) {
    try {
        let { db } = firebaseConfig;
        
        // Update patient document
        const patientRef = db.collection('patients').doc(patientID);
        const patientDoc = await patientRef.get();
        
        if (!patientDoc.exists) {
            console.log(`Patient with ID ${patientID} does not exist`);
            return false;
        }
        
        if (hasAccess) {
            // Grant access - Add doctor to patient's doctors list
            await patientRef.update({
                doctors: firebaseConfig.admin.firestore.FieldValue.arrayUnion(doctorID)
            });
        } else {
            // Revoke access - Remove doctor from patient's doctors list
            await patientRef.update({
                doctors: firebaseConfig.admin.firestore.FieldValue.arrayRemove(doctorID)
            });
        }
        // Update doctor document
        console.log("Looking for doctor with ID:", doctorID);
        const doctorQuerySnapshot = await db.collection('doctors')
            .where('userId', '==', doctorID)
            .limit(1)
            .get();
        
        if (!doctorQuerySnapshot.empty) {
            const doctorDocRef = doctorQuerySnapshot.docs[0].ref;
            if (hasAccess) {
                await doctorDocRef.update({
                    patients: firebaseConfig.admin.firestore.FieldValue.arrayUnion(patientID)
                });
            } else {
                await doctorDocRef.update({
                    patients: firebaseConfig.admin.firestore.FieldValue.arrayRemove(patientID)
                });
            }
        } else {
            console.log(`No doctor found with ID: ${doctorID}`);
        }
        return true;

    } catch (error) {
        console.error('Firebase update error:', error);
        return false;
    }
}

// Grant a doctor access to patient records
const grantAccess = async (patientID, doctorID) => {
    try {
        console.log(`Granting doctor ${doctorID} access to patient ${patientID}`);
        
        // Update Firebase
        const firebaseUpdated = await updateDoctorAccess(patientID, doctorID, true);
        
        return {
            success: true,
            message: 'Access granted successfully',
            firebaseUpdated
        };
    } catch (error) {
        console.error('Error granting access:', error);
        return {
            success: false,
            message: error.message || 'Failed to grant access'
        };
    }
};

// Revoke a doctor's access to patient records
const revokeAccess = async (patientID, doctorID) => {
    try {
        console.log(`Revoking doctor ${doctorID} access from patient ${patientID}`);
        
        // Update Firebase
        const firebaseUpdated = await updateDoctorAccess(patientID, doctorID, false);
        
        return {
            success: true,
            message: 'Access revoked successfully',
            firebaseUpdated
        };
    } catch (error) {
        console.error('Error revoking access:', error);
        return {
            success: false,
            message: error.message || 'Failed to revoke access'
        };
    }
};

module.exports = {
    retrieveDoctors,
    grantAccess,
    revokeAccess
};
