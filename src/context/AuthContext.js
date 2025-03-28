import React, { createContext, useContext, useState, useEffect } from 'react';
// Import these conditionally to prevent errors if firebase is not configured
let auth, getUserData, getWeekData, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, logOut;
try {
  // Try to import the firebase services
  auth = require('../services/firebase').auth;
  const firestore = require('../services/firestore');
  getUserData = firestore.getUserData;
  getWeekData = firestore.getWeekData;
  const authService = require('../services/auth');
  signInWithGoogle = authService.signInWithGoogle;
  signInWithFacebook = authService.signInWithFacebook;
  signInWithEmail = authService.signInWithEmail;
  signUpWithEmail = authService.signUpWithEmail;
  logOut = authService.logOut;
} catch (error) {
  console.warn("Firebase imports failed, using mock data instead:", error);
  // Provide mock implementations if imports fail
  auth = { onAuthStateChanged: (callback) => callback(null) };
  getUserData = async () => null;
  getWeekData = async () => null;
  signInWithGoogle = async () => ({ uid: 'mock-uid', displayName: 'Mock User' });
  signInWithFacebook = async () => ({ uid: 'mock-uid', displayName: 'Mock User' });
  signInWithEmail = async () => ({ uid: 'mock-uid', displayName: 'Mock User' });
  signUpWithEmail = async () => ({ uid: 'mock-uid', displayName: 'Mock User' });
  logOut = async () => {};
}

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Create a default mock user and user data
  const mockUser = {
    uid: 'mock-user-id',
    displayName: 'Demo User',
    email: 'demo@example.com',
    photoURL: null
  };
  
  const mockUserData = {
    displayName: 'Demo User',
    email: 'demo@example.com',
    photoURL: null,
    shareToken: 'demo-share-token',
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
  };

  const [currentUser, setCurrentUser] = useState(mockUser);
  const [userData, setUserData] = useState(mockUserData);
  const [loading, setLoading] = useState(false); // Set to false initially to avoid loading state
  const [error, setError] = useState(null);

  // Skip the actual authentication process
  useEffect(() => {
    // No need to listen for auth state changes or subscribe to anything
    setLoading(false);
    
    // Return empty function for cleanup
    return () => {};
  }, []);

  // Sign in methods
  const googleSignIn = async () => {
    setError(null);
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const facebookSignIn = async () => {
    setError(null);
    try {
      const user = await signInWithFacebook();
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const emailSignIn = async (email, password) => {
    setError(null);
    try {
      const user = await signInWithEmail(email, password);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const emailSignUp = async (email, password, displayName) => {
    setError(null);
    try {
      const user = await signUpWithEmail(email, password, displayName);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await logOut();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
        return data;
      } catch (err) {
        console.error("Error refreshing user data:", err);
        throw err;
      }
    }
  };

  // Context value
  const value = {
    currentUser,
    userData,
    loading,
    error,
    googleSignIn,
    facebookSignIn,
    emailSignIn,
    emailSignUp,
    signOut,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Remove the loading check */}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 