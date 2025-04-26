const { Web3 } = require("web3");
const fs = require('fs');
const path = require('path');

// Create a function that returns a new patient wallet
const createPatientWallet = async () => {
  try {
    // Initialize Web3 with your blockchain provider
    const web3 = new Web3("http://127.0.0.1:7545"); // Change URL if needed

    // Load contract ABI from file
    const contractAbiPath = path.join(__dirname, '../abi/MedicalRecords.json');
    const contractJson = JSON.parse(fs.readFileSync(contractAbiPath, 'utf8'));
    const contractAbi = contractJson.abi;
    const contractAddress = contractJson.networks['5777'].address; // Change network ID if needed

    // Initialize contract
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const govAccount = accounts[0];

    // 1. Create a new patient wallet
    const newPatient = web3.eth.accounts.create();
    const { address, privateKey } = newPatient;

    console.log("🧾 New Patient Wallet:", address);
    console.log("🔑 Private Key:", privateKey);

    // 2. Fund the patient wallet
    await web3.eth.sendTransaction({
      from: govAccount,
      to: address,
      value: web3.utils.toWei("10", "ether"),
    });

    // 3. Prepare registerWithTracking data
    const data = contract.methods
      .registerWithTracking(1) // role 2 = patient
      .encodeABI();

    const txCount = await web3.eth.getTransactionCount(address);
    const block = await web3.eth.getBlock("latest");
    
    // Handle both EIP-1559 and legacy transactions
    let tx;
    
    if (block.baseFeePerGas) {
      // EIP-1559 transaction
      const baseFee = Number(block.baseFeePerGas);
      const maxPriorityFee = web3.utils.toWei("2", "gwei"); // tip
      const maxFee = baseFee + Number(maxPriorityFee); // max total
      
      tx = {
        to: contractAddress,
        data,
        gas: 200000,
        maxPriorityFeePerGas: maxPriorityFee,
        maxFeePerGas: maxFee,
        nonce: txCount,
        type: 2,
        value: "0x0"
      };
    } else {
      // Legacy transaction
      const gasPrice = await web3.eth.getGasPrice();
      
      tx = {
        to: contractAddress,
        data,
        gas: 200000,
        gasPrice,
        nonce: txCount,
        value: "0x0"
      };
    }

    // 4. Sign and send
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("✅ Patient registered! TxHash:", receipt.transactionHash);

    // Return wallet information and transaction receipt
    return {
      success: true,
      wallet: {
        address,
        privateKey
      },
      transaction: {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      }
    };
  } catch (err) {
    console.error("❌ Error creating wallet:", err.message || err);
    return {
      success: false,
      error: err.message || "Failed to create wallet"
    };
  }
};

// Export the function to be used in your application
module.exports = {
  createPatientWallet
};