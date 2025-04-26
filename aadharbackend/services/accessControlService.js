const crypto = require('crypto')
const firebaseConfig = require("../config/firebaseConfig.js");
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Initialize Web3 connection
const web3 = new Web3('http://127.0.0.1:7545'); // Change to your provider URL

// Load contract ABI and address
const contractAbiPath = path.join(__dirname, '../abi/MedicalRecords.json');
const contractJson = JSON.parse(fs.readFileSync(contractAbiPath, 'utf8'));
const contractAbi = contractJson.abi;
const contractAddress = contractJson.networks['5777'].address; // Update with your network ID
const contract = new web3.eth.Contract(contractAbi, contractAddress);

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
        //update doctor document
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
const grantAccess = async (patientID, doctorID, privateKey) => {
    try {
        console.log(`Granting doctor ${doctorID} access to patient ${patientID}`);
        
        // Add patient's account to web3 wallet using private key
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        
        // Get doctor's wallet address from Firestore
        let { db } = firebaseConfig;
        
        const doctorQuerySnapshot = await db.collection('doctors')
                                           .where('userId', '==', doctorID)
                                           .limit(1)
                                           .get();
        
        if (doctorQuerySnapshot.empty) {
            throw new Error(`Doctor with ID ${doctorID} not found`);
        }
        
        const doctorDoc = doctorQuerySnapshot.docs[0];
        const doctorData = doctorDoc.data();
        const doctorWalletAddress = doctorData.wallet?.address || doctorData.walletAddress;
        
        if (!doctorWalletAddress) {
            throw new Error(`Doctor ${doctorID} has no wallet address`);
        }
        
        console.log(`Patient wallet address: ${account.address}`);
        console.log(`Doctor wallet address: ${doctorWalletAddress}`);
        
        // Check patient registration
        const patientInfo = await contract.methods.users(account.address).call();
        console.log(`Patient blockchain info:`, patientInfo);
        
        // Check doctor registration
        const doctorInfo = await contract.methods.users(doctorWalletAddress).call();
        console.log(`Doctor blockchain info:`, doctorInfo);
        
        // If doctor is not registered or doesn't have doctor role
        if (!doctorInfo.exists || doctorInfo.role !== 2n) {
            console.log("Doctor not registered correctly on blockchain. Cannot grant access.");
            throw new Error("Doctor is not registered on the blockchain. Please ensure the doctor is registered with the correct role.");
        }
        
        // Call the smart contract to grant access
        const receipt = await contract.methods.grantAccess(doctorWalletAddress)
            .send({
                from: account.address,
                gas: 200000
            });
        
        // Update Firebase
        const firebaseUpdated = await updateDoctorAccess(patientID, doctorID, true);
        
        return {
            success: true,
            message: 'Access granted successfully',
            transactionHash: receipt.transactionHash,
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
const revokeAccess = async (patientID, doctorID, privateKey) => {
    try {
        console.log(`Revoking doctor ${doctorID} access from patient ${patientID}`);
        
        // Add patient's account to web3 wallet using private key
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        
        // Get doctor's wallet address from Firestore
        let { db } = firebaseConfig;
        
        // This returns a QuerySnapshot, not a DocumentSnapshot
        const doctorQuerySnapshot = await db.collection('doctors')
                                           .where('userId', '==', doctorID)
                                           .limit(1)
                                           .get();
        
        // Check if the query returned any documents
        if (doctorQuerySnapshot.empty) {
            throw new Error(`Doctor with ID ${doctorID} not found`);
        }
        
        // Get the first (and only) document from the query
        const doctorDoc = doctorQuerySnapshot.docs[0];
        const doctorData = doctorDoc.data();
        const doctorWalletAddress = doctorData.wallet?.address || doctorData.walletAddress;
        console.log(`Patient wallet address: ${account.address}`);
        console.log(`Doctor wallet address: ${doctorWalletAddress}`);
        
        const patientInfo = await contract.methods.users(account.address).call();
        console.log(`Patient blockchain info:`, patientInfo);
        
        if (!doctorWalletAddress) {
            throw new Error(`Doctor ${doctorID} has no wallet address`);
        }
        
        // Call the smart contract to revoke access
        const receipt = await contract.methods.revokeAccess(doctorWalletAddress)
            .send({
                from: account.address,
                gas: 200000
            });
        
        // Update Firebase
        const firebaseUpdated = await updateDoctorAccess(patientID, doctorID, false);
        
        return {
            success: true,
            message: 'Access revoked successfully',
            transactionHash: receipt.transactionHash,
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