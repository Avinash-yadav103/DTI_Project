import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { UserRole } from '../auth';

// Register a new user
export async function register(
  email: string, 
  password: string, 
  name: string, 
  role: UserRole = 'patient',
  userData: any = {}
) {
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

// Login user
export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      id: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      image: user.photoURL || undefined
    };
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.message || 'Failed to login');
  }
}