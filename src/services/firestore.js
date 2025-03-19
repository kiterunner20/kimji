import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc, 
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

// User data operations
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
    throw error;
  }
};

// Week data operations
export const saveWeekData = async (userId, weekData) => {
  try {
    const userWeekRef = doc(db, "users", userId, "weekData", "current");
    await setDoc(userWeekRef, {
      weekData,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving week data: ", error);
    throw error;
  }
};

export const getWeekData = async (userId) => {
  try {
    const userWeekRef = doc(db, "users", userId, "weekData", "current");
    const weekSnap = await getDoc(userWeekRef);
    
    if (weekSnap.exists()) {
      return weekSnap.data().weekData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting week data: ", error);
    throw error;
  }
};

// Subscribe to real-time updates (for syncing between devices)
export const subscribeToWeekData = (userId, callback) => {
  try {
    const userWeekRef = doc(db, "users", userId, "weekData", "current");
    return onSnapshot(userWeekRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().weekData);
      } else {
        callback(null);
      }
    });
  } catch (error) {
    console.error("Error subscribing to week data: ", error);
    throw error;
  }
};

// Daily data operations
export const saveDayData = async (userId, day, dayData) => {
  try {
    const dayRef = doc(db, "users", userId, "days", `day${day}`);
    await setDoc(dayRef, {
      day,
      completedTasks: dayData.completedTasks || [],
      scores: dayData.scores || {},
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving day data: ", error);
    throw error;
  }
};

export const getDayData = async (userId, day) => {
  try {
    const dayRef = doc(db, "users", userId, "days", `day${day}`);
    const daySnap = await getDoc(dayRef);
    
    if (daySnap.exists()) {
      return daySnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting day data: ", error);
    throw error;
  }
};

// Task updates
export const updateTaskCompletion = async (userId, day, taskId, completed) => {
  try {
    // Get the current day data
    const dayRef = doc(db, "users", userId, "days", `day${day}`);
    const daySnap = await getDoc(dayRef);
    
    let completedTasks = [];
    if (daySnap.exists()) {
      completedTasks = daySnap.data().completedTasks || [];
    }
    
    // Update the completed tasks array
    if (completed && !completedTasks.includes(taskId)) {
      completedTasks.push(taskId);
    } else if (!completed) {
      completedTasks = completedTasks.filter(id => id !== taskId);
    }
    
    // Save the updated data
    await setDoc(dayRef, {
      day,
      completedTasks,
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating task completion: ", error);
    throw error;
  }
};

// Get user by share token (for partner view)
export const getUserByShareToken = async (token) => {
  try {
    const q = query(collection(db, "users"), where("shareToken", "==", token));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      userData.id = querySnapshot.docs[0].id;
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user by share token: ", error);
    throw error;
  }
};

// Save partner message
export const savePartnerMessage = async (userId, message) => {
  try {
    const messagesRef = collection(db, "users", userId, "partnerMessages");
    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, {
      message,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error("Error saving partner message: ", error);
    throw error;
  }
};

// Get partner messages
export const getPartnerMessages = async (userId) => {
  try {
    const messagesRef = collection(db, "users", userId, "partnerMessages");
    const q = query(messagesRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error("Error getting partner messages: ", error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (userId, messageId) => {
  try {
    const messageRef = doc(db, "users", userId, "partnerMessages", messageId);
    await updateDoc(messageRef, {
      read: true
    });
  } catch (error) {
    console.error("Error marking message as read: ", error);
    throw error;
  }
}; 