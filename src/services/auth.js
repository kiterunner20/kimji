import { 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, facebookProvider, db } from "./firebase";

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if this is a new user
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create a new user document in Firestore
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        shareToken: generateShareToken(),
        shareSettings: {
          isEnabled: false,
          categories: {
            personal_growth: true,
            emotional_health: true,
            mental_fitness: true,
            physical_health: true,
            relationships: true,
            social: true,
            financial: false,
            mindfulness: true
          },
          dailySummary: false,
          partnerEmail: ''
        }
      });
    } else {
      // Update last login
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    // Similar logic as Google sign-in
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        shareToken: generateShareToken(),
        shareSettings: {
          isEnabled: false,
          categories: {
            personal_growth: true,
            emotional_health: true,
            mental_fitness: true,
            physical_health: true,
            relationships: true,
            social: true,
            financial: false,
            mindfulness: true
          },
          dailySummary: false,
          partnerEmail: ''
        }
      });
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Facebook: ", error);
    throw error;
  }
};

// Sign up with email/password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      displayName,
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      shareToken: generateShareToken(),
      shareSettings: {
        isEnabled: false,
        categories: {
          personal_growth: true,
          emotional_health: true,
          mental_fitness: true,
          physical_health: true,
          relationships: true,
          social: true,
          financial: false,
          mindfulness: true
        },
        dailySummary: false,
        partnerEmail: ''
      }
    });
    
    return user;
  } catch (error) {
    console.error("Error signing up with email: ", error);
    throw error;
  }
};

// Sign in with email/password
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Update last login
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    
    return result.user;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password: ", error);
    throw error;
  }
};

// Generate a random share token
const generateShareToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Update share settings
export const updateShareSettings = async (userId, settings) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { shareSettings: settings }, { merge: true });
  } catch (error) {
    console.error("Error updating share settings: ", error);
    throw error;
  }
};

// Regenerate share token
export const regenerateShareToken = async (userId) => {
  try {
    const newToken = generateShareToken();
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { shareToken: newToken }, { merge: true });
    return newToken;
  } catch (error) {
    console.error("Error regenerating share token: ", error);
    throw error;
  }
}; 