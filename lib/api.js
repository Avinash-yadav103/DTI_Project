// Add this to your existing patientApi object
getProfile: async () => {
  try {
    // Get the user's Aadhaar ID from context or localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const aadhaarId = storedUser?.aadhaarId;
    
    if (!aadhaarId) {
      console.log("No Aadhaar ID found in localStorage, using mock data");
      return MockApi.getProfile();
    }
    
    console.log("Fetching profile data for Aadhaar ID:", aadhaarId);
    
    // Call the MongoDB backend endpoint
    const response = await fetch(`http://localhost:5000/api/users/profile/${aadhaarId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log("MongoDB profile data:", data);
      
      // Format the MongoDB data to match the UI's expected format
      return {
        name: data.user.name,
        id: data.user._id,
        aadhaarId: data.user.aadhaarId,
        email: data.user.email || `${data.user.aadhaarId}@example.com`,
        phone: data.user.phone || "",
        gender: data.user.gender || "",
        dateOfBirth: data.user.dateOfBirth || "",
        address: data.user.fullAddress || "",
        bloodType: data.medical?.bloodType || "Unknown",
        height: data.medical?.height || "",
        weight: data.medical?.weight || ""
      };
    } else {
      console.error("Error in MongoDB response:", data.message);
      throw new Error(data.message || "Failed to get profile data");
    }
  } catch (error) {
    console.error("Error fetching profile from MongoDB:", error);
    console.log("Falling back to mock data");
    return MockApi.getProfile();
  }
}