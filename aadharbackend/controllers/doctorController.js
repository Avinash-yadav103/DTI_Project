const { db } = require("../config/firebaseConfig");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { Web3 } = require("web3");
const multer = require("multer");
const upload = multer({ dest: "temp/" });

// Initialize Web3 connection
const web3 = new Web3("http://127.0.0.1:7545"); // Change URL if needed

// Load contract ABI and address
const contractAbiPath = path.join(__dirname, '../abi/MedicalRecords.json');
const contractJson = JSON.parse(fs.readFileSync(contractAbiPath, 'utf8'));
const contractAbi = contractJson.abi;
const contractAddress = contractJson.networks['5777'].address;
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Get patients that a doctor has access to
const getPatients = async (req, res) => {
  try {
    const doctorId = req.params.uid || req.query.uid;
    
    if (!doctorId) {
      return res.status(400).json({ 
        success: false,
        message: "Doctor ID is required" 
      });
    }
    
    console.log(`🔍 Fetching patients for doctor: ${doctorId}`);
    
    // Get doctor's document to find wallet address
    const doctorQuerySnapshot = await db.collection('doctors')
                                        .where('userId', '==', doctorId)
                                        .limit(1)
                                        .get();
    
    if (doctorQuerySnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    
    const doctorDoc = doctorQuerySnapshot.docs[0];
    const doctorData = doctorDoc.data();
    const doctorWalletAddress = doctorData.wallet?.address || doctorData.walletAddress;
    
    if (!doctorWalletAddress) {
      return res.status(400).json({
        success: false,
        message: "Doctor has no wallet address"
      });
    }
    
    // Get the patients array from the doctor's document
    const patientsArray = doctorData.patients || [];
    
    if (patientsArray.length === 0) {
      return res.status(200).json({
        success: true,
        patients: [],
        message: "No patients found for this doctor"
      });
    }

    // Handle empty patient IDs that might be in the array
    const validPatientIds = patientsArray.filter(id => id && id.trim() !== '');
    
    if (validPatientIds.length === 0) {
      return res.status(200).json({
        success: true,
        patients: [],
        message: "No valid patient IDs found for this doctor"
      });
    }

    // Fetch patient details from the patients collection by document ID
    const patientRefs = validPatientIds.map(patientId => db.collection("patients").doc(patientId));
    const patientsSnapshot = await db.getAll(...patientRefs);
    
    // Get patient data with wallet addresses
    const patients = [];
    
    // Fixed: db.getAll() returns an array of DocumentSnapshots directly, not a QuerySnapshot
    for (const patientDoc of patientsSnapshot) {
      // Skip non-existent documents
      if (!patientDoc.exists) {
        console.log(`Patient document ${patientDoc.id} does not exist`);
        continue;
      }
      
      const patientData = patientDoc.data();
      patients.push({
        id: patientDoc.id,
        name: patientData.name || 'Unknown',
        age: patientData.age || '',
        gender: patientData.gender || '',
      });
    }
    
    console.log(`✅ Found ${patients.length} patients for doctor ${doctorId}`);
    
    return res.status(200).json({
      success: true,
      patients: patients
    });
  } catch (error) {
    console.error("❌ Error retrieving patients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve patients",
      error: error.message
    });
  }
};
// Add a medical record for a patient - blockchain storage only
const addRecord = async (req, res) => {
  try {
    const { patientId, description, privateKey } = req.body;
    const doctorId = req.params.uid;
    const recordFile = req.file;
    
    if (!patientId || !description || !privateKey || !recordFile) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required parameters: patientId, description, privateKey, recordFile" 
      });
    }
    
    console.log(`📁 Adding record for patient ${patientId} by doctor ${doctorId}`);
    
    // Get doctor wallet address
    const doctorQuerySnapshot = await db.collection('doctors')
                                        .where('userId', '==', doctorId)
                                        .limit(1)
                                        .get();
    
    if (doctorQuerySnapshot.empty) {
      return res.status(404).json({
        success: false, 
        message: "Doctor not found"
      });
    }
    
    const doctorDoc = doctorQuerySnapshot.docs[0];
    const doctorData = doctorDoc.data();
    const doctorWalletAddress = doctorData.wallet?.address || doctorData.walletAddress;
    
    if (!doctorWalletAddress) {
      return res.status(400).json({
        success: false,
        message: "Doctor has no wallet address"
      });
    }
    
    // Get patient wallet address from Firebase
    const patientDoc = await db.collection('patients').doc(patientId).get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    const patientData = patientDoc.data();
    const patientWalletAddress = patientData.walletAddress;
    
    if (!patientWalletAddress) {
      return res.status(400).json({
        success: false,
        message: "Patient has no wallet address"
      });
    }
    
    // Check if doctor has access to this patient on the blockchain
    const hasAccess = await contract.methods.accessControl(patientWalletAddress, doctorWalletAddress).call();
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Doctor does not have access to this patient's records"
      });
    }
    
    // 1. Upload file to IPFS via Pinata
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(recordFile.path));
      
      // Add metadata about the record to help with retrieval
      const pinataMetadata = JSON.stringify({
        name: `Medical Record - ${patientId} - ${new Date().toISOString()}`,
        keyvalues: {
          patientId: patientId,
          doctorId: doctorId,
          description: description.substring(0, 50), // First 50 chars for searchability
          timestamp: new Date().toISOString(),
          fileName: recordFile.originalname
        }
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', pinataOptions);
      
      // Make API call to Pinata using JWT for better security
      const pinataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
          },
        }
      );
      
      const cid = pinataResponse.data.IpfsHash;
      console.log(`📌 File uploaded to IPFS with CID: ${cid}`);
      
      // Clean up temp file
      fs.unlinkSync(recordFile.path);
      
      // 2. Add doctor account to web3 wallet using private key
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      
      // Verify wallet ownership
      if (account.address.toLowerCase() !== doctorWalletAddress.toLowerCase()) {
        return res.status(403).json({
          success: false,
          message: "The private key does not match the doctor's wallet address"
        });
      }
      
      // 3. Add record to blockchain
      console.log(`Adding record to blockchain: Patient=${patientWalletAddress}, CID=${cid}`);
      const receipt = await contract.methods.addRecord(
        patientWalletAddress,
        cid,
        description
      ).send({
        from: account.address,
        gas: 300000
      });
      
      console.log(`✅ Record added to blockchain. Transaction: ${receipt.transactionHash}`);
      
      return res.status(200).json({
        success: true,
        message: "Record added successfully",
        cid,
        viewLink: `https://gateway.pinata.cloud/ipfs/${cid}`,
        transactionHash: receipt.transactionHash,
        blockNumber: String(receipt.blockNumber),
        fileName: recordFile.originalname
      });
    } catch (error) {
      console.error("Error with Pinata or blockchain:", error);
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error("❌ Error adding record:", error);
    
    // Clean up any temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to add record",
      error: error.message
    });
  }
};

module.exports = {
  addRecord,
  getPatients // This must be defined above
};
