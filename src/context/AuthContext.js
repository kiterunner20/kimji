import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserData, getWeekData } from '../services/firestore';
import { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, logOut } from '../services/auth';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Load user data from Firestore
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 