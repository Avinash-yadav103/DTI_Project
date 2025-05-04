import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  setDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Medical Records Service
export const medicalRecordsService = {
  // Get records for a patient
  getUserRecords: async (userId: string) => {
    try {
      const recordsRef = collection(db, 'medicalRecords');
      const q = query(recordsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return records;
    } catch (error) {
      console.error('Error getting records:', error);
      throw error;
    }
  },
  
  // Add a new record
  addRecord: async (userId: string, recordData: any) => {
    try {
      const recordWithUserId = {
        ...recordData,
        userId,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, 'medicalRecords'), recordWithUserId);
      return { id: docRef.id, ...recordWithUserId };
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  },
  
  // Upload files and return URLs
  uploadFiles: async (userId: string, files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileRef = ref(storage, `records/${userId}/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        
        return {
          name: file.name,
          type: file.type,
          url,
          size: file.size,
          uploadedAt: Timestamp.now()
        };
      });
      
      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },
  
  // Get a record by ID
  getRecord: async (recordId: string) => {
    try {
      const docRef = doc(db, 'medicalRecords', recordId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Record not found');
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error getting record:', error);
      throw error;
    }
  },
};

// Access Control Service
export const accessControlService = {
  // Request access to a patient's records
  requestAccess: async (doctorId: string, patientId: string) => {
    try {
      const accessRequest = {
        doctorId,
        patientId,
        status: 'pending',
        requestedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, 'accessRequests'), accessRequest);
      return { id: docRef.id, ...accessRequest };
    } catch (error) {
      console.error('Error requesting access:', error);
      throw error;
    }
  },
  
  // Get access requests for a patient
  getPatientRequests: async (patientId: string) => {
    try {
      const requestsRef = collection(db, 'accessRequests');
      const q = query(requestsRef, where('patientId', '==', patientId));
      const querySnapshot = await getDocs(q);
      
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return requests;
    } catch (error) {
      console.error('Error getting access requests:', error);
      throw error;
    }
  },
  
  // Update access request status
  updateRequestStatus: async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const requestRef = doc(db, 'accessRequests', requestId);
      await updateDoc(requestRef, {
        status,
        updatedAt: Timestamp.now(),
      });
      
      return { id: requestId, status };
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  },
};

// User Profile Service
export const userProfileService = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('User profile not found');
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, profileData: any) => {
    try {
      const profileRef = doc(db, 'users', userId);
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: Timestamp.now(),
      });
      
      return { id: userId, ...profileData };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};