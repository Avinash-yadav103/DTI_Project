import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { UserRole, User } from './auth';

// Register a new user
export async function registerUser(
  email: string, 
  password: string, 
  name: string, 
  role: UserRole = 'patient',
  userData: any = {}
): Promise<User> {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update user profile with displayName
    await updateProfile(firebaseUser, {
      displayName: name
    });
    
    // Create user document in Firestore
    const userDoc = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: name,
      role: role,
      createdAt: Timestamp.now(),
      ...userData
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
    
    // Return user in the format expected by the app
    return {
      id: firebaseUser.uid,
      name: name,
      email: firebaseUser.email || '',
      role: role,
      image: firebaseUser.photoURL || undefined
    };
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.message || 'Failed to register');
  }
}

// Sign in an existing user
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    
    const userData = userDoc.data();
    
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || '',
      email: userData.email || firebaseUser.email || '',
      role: userData.role as UserRole,
      image: userData.image || firebaseUser.photoURL || undefined
    };
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.message || 'Failed to login');
  }
}

// Sign out the current user
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout');
  }
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
}

// Get current user
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        unsubscribe();
        
        if (!firebaseUser) {
          resolve(null);
          return;
        }
        
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (!userDoc.exists()) {
            resolve(null);
            return;
          }
          
          const userData = userDoc.data();
          
          resolve({
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || '',
            email: userData.email || firebaseUser.email || '',
            role: userData.role as UserRole,
            image: userData.image || firebaseUser.photoURL || undefined
          });
        } catch (error) {
          reject(error);
        }
      },
      reject
    );
  });
}

// Convert Firebase User to App User
export function convertFirebaseUser(firebaseUser: FirebaseUser, role: UserRole = 'patient'): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    role: role,
    image: firebaseUser.photoURL || undefined
  };
}