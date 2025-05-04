import { auth } from './firebase';
import { userProfileService, medicalRecordsService, accessControlService } from './firebase-services';

// Helper function to get auth token
async function getAuthToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  return currentUser.getIdToken();
}

export const apiClient = {
  // Medical Records API
  getMedicalRecords: async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/medical-records', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      return data.records;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },
  
  addMedicalRecord: async (recordData) => {
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add record');
      }
      
      const data = await response.json();
      return data.record;
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  },
  
  uploadFiles: async (files) => {
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
      
      const data = await response.json();
      return data.files;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },
  
  // For compatibility with your existing code, implement these client methods
  // that use Firebase directly when the API is not needed
  
  getProfile: async (userId) => {
    if (!userId && auth.currentUser) {
      userId = auth.currentUser.uid;
    }
    
    if (!userId) {
      throw new Error('User ID required');
    }
    
    return userProfileService.getUserProfile(userId);
  },
  
  approveAccess: async (requestId) => {
    return accessControlService.updateRequestStatus(requestId, 'approved');
  },
  
  rejectAccess: async (requestId) => {
    return accessControlService.updateRequestStatus(requestId, 'rejected');
  }
};