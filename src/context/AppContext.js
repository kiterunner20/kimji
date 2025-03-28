import React, { createContext, useContext, useEffect, useReducer } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { generateCustomTaskData } from '../data/transformData';

// Helper to create unique task ID with day prefix
const createTaskId = (day, category, name) => {
  return `day${day}_${category}_${name.toLowerCase().replace(/\s+/g, '_')}`;
};

// Categories for tasks
const taskCategories = {
  PERSONAL_GROWTH: 'personal_growth',
  EMOTIONAL_HEALTH: 'emotional_health',
  MENTAL_FITNESS: 'mental_fitness',
  PHYSICAL_HEALTH: 'physical_health',
  RELATIONSHIPS: 'relationships',
  SOCIAL: 'social',
  FINANCIAL: 'financial',
  MINDFULNESS: 'mindfulness',
};

// Points per category
const categoryPoints = {
  [taskCategories.PHYSICAL_HEALTH]: 15,
  [taskCategories.RELATIONSHIPS]: 12,
  [taskCategories.PERSONAL_GROWTH]: 10,
  [taskCategories.MENTAL_FITNESS]: 10,
  [taskCategories.EMOTIONAL_HEALTH]: 8,
  [taskCategories.SOCIAL]: 8,
  [taskCategories.FINANCIAL]: 8,
  [taskCategories.MINDFULNESS]: 8,
};

// Default reminder times
const defaultReminderTimes = {
  [taskCategories.PHYSICAL_HEALTH]: '07:00',
  [taskCategories.MINDFULNESS]: '07:00',
  [taskCategories.MENTAL_FITNESS]: '13:00',
  [taskCategories.FINANCIAL]: '13:00',
  [taskCategories.PERSONAL_GROWTH]: '13:00',
  [taskCategories.RELATIONSHIPS]: '19:00',
  [taskCategories.EMOTIONAL_HEALTH]: '19:00',
  [taskCategories.SOCIAL]: '19:00',
};

// Initial template for our 21-day program with transformative tasks
const generateWeekTemplate = () => {
  console.log("Generating week template from custom data...");
  
  // Get our custom data
  const customTaskData = generateCustomTaskData();
  console.log(`Generated week template with ${customTaskData.length} days`);
  
  if (customTaskData.length > 0) {
    console.log(`First day has ${customTaskData[0].tasks.length} tasks`);
  }
  
  return customTaskData;
};

// Helper function to get day title
function getDayTitle(day) {
  // Week 1: Foundation
  if (day === 1) return "Foundation";
  if (day === 2) return "Mind";
  if (day === 3) return "Productivity";
  if (day === 4) return "Wellness";
  if (day === 5) return "Growth";
  if (day === 6) return "Connection";
  if (day === 7) return "Reflection";
  
  // Week 2: Expansion
  if (day === 8) return "Adaptation";
  if (day === 9) return "Exploration";
  if (day === 10) return "Consistency";
  if (day === 11) return "Momentum";
  if (day === 12) return "Challenge";
  if (day === 13) return "Breakthrough";
  if (day === 14) return "Integration";
  
  // Week 3: Mastery
  if (day === 15) return "Commitment";
  if (day === 16) return "Discipline";
  if (day === 17) return "Excellence";
  if (day === 18) return "Balance";
  if (day === 19) return "Wisdom";
  if (day === 20) return "Transformation";
  if (day === 21) return "Celebration";
  
  return "Day " + day;
}

// Generate the week template
const weekTemplate = generateWeekTemplate();

// Log the generated week template for debugging
console.log("Generated weekTemplate:", weekTemplate);
console.log("First day tasks:", weekTemplate[0]?.tasks?.length || 0);

// Initial state
const initialState = {
  currentDay: 1,
  weekPlan: null,
  startDate: null,
  darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  workMode: false, // Add workMode state
  theme: 'default', // Default theme
  notifications: true,
  notificationTimes: {
    morning: '07:00',
    afternoon: '13:00',
    evening: '19:00'
  },
  profile: {
    name: '',
    wakeUpTime: '07:00',
    sleepTime: '22:00'
  },
  stats: {
    hydration: [],
    meditation: [],
    workout: [],
    mood: []
  },
  taskHistory: [], // Track completed tasks history
  customTasks: [], // Store user-created tasks
  categoryScores: {}, // Store category-wise scores
};

// Theme definitions
export const themes = {
  default: {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#7c3aed', // Default violet
      secondary: '#5b21b6',
      accent: '#c4b5fd',
    }
  },
  btsPink: {
    id: 'btsPink',
    name: 'BTS Pink',
    colors: {
      primary: '#ff0080', // BTS pink
      secondary: '#cc0066',
      accent: '#ffcceb',
    }
  },
  cinnamonSatin: {
    id: 'cinnamonSatin',
    name: 'Cinnamon Satin',
    colors: {
      primary: '#CF6856', // Cinnamon satin pink
      secondary: '#B34E3D',
      accent: '#EECFC1',
    }
  },
  roseMauve: {
    id: 'roseMauve',
    name: 'Rose Mauve',
    colors: {
      primary: '#D36A7E', // Rose/Mauve color
      secondary: '#B05066',
      accent: '#F5C6D0',
    }
  },
  oceanBlue: {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    colors: {
      primary: '#0ea5e9', // Sky blue
      secondary: '#0284c7',
      accent: '#bae6fd',
    }
  },
  emeraldGreen: {
    id: 'emeraldGreen',
    name: 'Emerald Green',
    colors: {
      primary: '#10b981', // Emerald green
      secondary: '#059669',
      accent: '#a7f3d0',
    }
  },
  sunsetOrange: {
    id: 'sunsetOrange',
    name: 'Sunset Orange',
    colors: {
      primary: '#f97316', // Orange
      secondary: '#ea580c',
      accent: '#fed7aa',
    }
  }
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'INIT_DATA':
      return { ...state, ...action.payload };
    
    case 'SET_DAY':
      console.log(`AppContext: Setting day to ${action.payload}, previous day was ${state.currentDay}`);
      
      // Always clone state to ensure React detects the change
      const newDay = Number(action.payload);
      if (isNaN(newDay) || newDay < 1 || newDay > 21) {
        console.error(`Invalid day value: ${action.payload}`);
        return state;
      }
      
      // Force a state change by creating a completely new state object
      const newWeekPlan = state.weekPlan ? [...state.weekPlan] : null;
      
      const newState = { 
        ...state, 
        currentDay: newDay,
        // Force weekPlan to be a new reference to trigger re-renders 
        weekPlan: newWeekPlan,
        // Add a timestamp to ensure state is always different
        lastUpdated: new Date().getTime()
      };
      
      console.log("AppContext: New state created:", { 
        currentDay: newState.currentDay,
        weekPlanLength: newState.weekPlan ? newState.weekPlan.length : 0
      });
      
      // Return the new state object to trigger React context updates
      return newState;
    
    case 'TOGGLE_TASK': {
      const { taskId } = action.payload;
      
      // Extract the day from the task ID (format: day{X}_category_name)
      const dayMatch = taskId.match(/^day(\d+)_/);
      const taskDay = dayMatch ? parseInt(dayMatch[1]) : state.currentDay;
      
      const updatedWeekPlan = state.weekPlan.map(day => {
        // Only update the task in its specific day
        if (day.day === taskDay) {
          return {
            ...day,
            tasks: day.tasks.map(task => {
              if (task.id === taskId) {
                const newCompletedState = !task.completed;
                
                // If task is being marked as complete, add to history
                if (newCompletedState) {
                  const historyEntry = {
                    taskId: task.id,
                    taskTitle: task.title,
                    taskCategory: task.taskCategory || 'uncategorized',
                    dayCompleted: taskDay,
                    dateCompleted: new Date().toISOString(),
                    points: task.points || 10
                  };
                  
                  // We'll handle the history update outside this map function
                  setTimeout(() => {
                    action.payload.dispatch({
                      type: 'ADD_TO_HISTORY',
                      payload: historyEntry
                    });
                  }, 0);
                  
                  // Update category scores
                  setTimeout(() => {
                    if (task.taskCategory) {
                      action.payload.dispatch({
                        type: 'UPDATE_CATEGORY_SCORE',
                        payload: {
                          category: task.taskCategory,
                          points: task.points || 10,
                          isComplete: true
                        }
                      });
                    }
                  }, 0);
                } else {
                  // If task is being unmarked, update category scores
                  setTimeout(() => {
                    if (task.taskCategory) {
                      action.payload.dispatch({
                        type: 'UPDATE_CATEGORY_SCORE',
                        payload: {
                          category: task.taskCategory,
                          points: task.points || 10,
                          isComplete: false
                        }
                      });
                    }
                  }, 0);
                }
                
                return { ...task, completed: newCompletedState };
              }
              return task;
            })
          };
        }
        return day;
      });
      return { ...state, weekPlan: updatedWeekPlan };
    }
    
    case 'UPDATE_CATEGORY_SCORE': {
      const { category, points, isComplete } = action.payload;
      const currentScore = state.categoryScores[category] || 0;
      
      return {
        ...state,
        categoryScores: {
          ...state.categoryScores,
          [category]: isComplete ? currentScore + points : Math.max(0, currentScore - points)
        }
      };
    }
    
    case 'TOGGLE_TASK_COMPLETE': {
      const { dayNumber, taskId, completed } = action.payload;
      
      const updatedWeekPlan = state.weekPlan.map(day => {
        if (day.day === dayNumber) {
          return {
            ...day,
            tasks: day.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, completed };
              }
              return task;
            })
          };
        }
        return day;
      });
      
      return { ...state, weekPlan: updatedWeekPlan };
    }
    
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        taskHistory: [...state.taskHistory, action.payload]
      };
    
    case 'UPDATE_TASK': {
      const { taskId } = action.payload;
      
      // Extract the day from the task ID (format: day{X}_category_name)
      const dayMatch = taskId.match(/^day(\d+)_/);
      const taskDay = dayMatch ? parseInt(dayMatch[1]) : state.currentDay;
      
      const updatedWeekPlan = state.weekPlan.map(day => {
        // Only update the task in its specific day
        if (day.day === taskDay) {
          return {
            ...day,
            tasks: day.tasks.map(task => 
              task.id === taskId 
                ? { ...task, ...action.payload.data }
                : task
            )
          };
        }
        return day;
      });
      return { ...state, weekPlan: updatedWeekPlan };
    }
    
    case 'UPDATE_STATS':
      return { 
        ...state, 
        stats: {
          ...state.stats,
          [action.payload.type]: [
            ...state.stats[action.payload.type],
            {
              date: new Date().toISOString(),
              value: action.payload.value
            }
          ]
        }
      };
    
    case 'ADD_CUSTOM_TASK': {
      // Get the day to add this task to
      const customDay = action.payload.day || state.currentDay;
      const repeatForAllDays = action.payload.repeatForAllDays || false;
      
      // Create a proper task ID that includes the day
      const customTaskCategory = action.payload.taskCategory || 'custom';
      const taskName = action.payload.title.toLowerCase().replace(/\s+/g, '_');
      const taskId = createTaskId(customDay, customTaskCategory, taskName + '_' + Date.now().toString(36));
      
      const customTask = {
        id: taskId,
        title: action.payload.title,
        description: action.payload.description || "",
        completed: false,
        type: "custom",
        category: action.payload.category || "all-day",
        taskCategory: action.payload.taskCategory || 'custom',
        points: action.payload.points || 10,
        reminder: action.payload.reminder || null,
        day: customDay
      };
      
      // Add to custom tasks list
      const updatedCustomTasks = [...state.customTasks, customTask];

      let weekPlanWithCustomTask;
      
      if (repeatForAllDays) {
        // Add the task to all 21 days (or remaining days from the current day)
        const allCustomTasks = [];
        
        weekPlanWithCustomTask = state.weekPlan.map(day => {
          // Only add to days >= the selected day (don't add to past days)
          if (day.day >= customDay) {
            // Create a new task ID specific to this day
            const daySpecificTaskId = createTaskId(day.day, customTaskCategory, taskName + '_' + Date.now().toString(36));
            
            const daySpecificTask = {
              ...customTask,
              id: daySpecificTaskId,
              day: day.day
            };
            
            // Add to our collection of all custom tasks
            allCustomTasks.push(daySpecificTask);
            
            return {
              ...day,
              tasks: [...day.tasks, daySpecificTask]
            };
          }
          return day;
        });
        
        // Update custom tasks list with all the new tasks
        return { 
          ...state, 
          customTasks: [...state.customTasks, ...allCustomTasks],
          weekPlan: weekPlanWithCustomTask
        };
      } else {
        // Only add to the specific day in the week plan (original behavior)
        weekPlanWithCustomTask = state.weekPlan.map(day => {
          if (day.day === customDay) {
            return {
              ...day,
              tasks: [...day.tasks, customTask]
            };
          }
          return day;
        });
        
        return { 
          ...state, 
          customTasks: updatedCustomTasks,
          weekPlan: weekPlanWithCustomTask
        };
      }
    }
    
    case 'DELETE_TASK': {
      const { taskId } = action.payload;
      
      // Extract the day from the task ID (format: day{X}_category_name)
      const dayMatch = taskId.match(/^day(\d+)_/);
      const taskDay = dayMatch ? parseInt(dayMatch[1]) : state.currentDay;
      
      // First check if it's a custom task
      const isCustomTask = state.customTasks.some(task => task.id === taskId);
      
      // Remove from weekPlan - only remove from the specific day
      const weekPlanWithoutTask = state.weekPlan.map(day => {
        // Only filter tasks in the specific day
        if (day.day === taskDay) {
          return {
            ...day,
            tasks: day.tasks.filter(task => task.id !== taskId)
          };
        }
        return day;
      });
      
      // If it's a custom task, also remove from customTasks array
      const filteredCustomTasks = isCustomTask 
        ? state.customTasks.filter(task => task.id !== taskId)
        : state.customTasks;
      
      return {
        ...state,
        weekPlan: weekPlanWithoutTask,
        customTasks: filteredCustomTasks
      };
    }
    
    case 'SET_TASK_REMINDER': {
      const { taskId } = action.payload;
      
      // Extract the day from the task ID (format: day{X}_category_name)
      const dayMatch = taskId.match(/^day(\d+)_/);
      const taskDay = dayMatch ? parseInt(dayMatch[1]) : state.currentDay;
      
      // Only update the reminder for the task in the specific day
      const weekPlanWithReminder = state.weekPlan.map(day => {
        if (day.day === taskDay) {
          return {
            ...day,
            tasks: day.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  reminder: action.payload.reminderTime
                };
              }
              return task;
            })
          };
        }
        return day;
      });
      
      return {
        ...state,
        weekPlan: weekPlanWithReminder
      };
    }
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    case 'TOGGLE_WORK_MODE':
      return { ...state, workMode: !state.workMode };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    
    case 'UPDATE_NOTIFICATION_TIMES':
      return { 
        ...state, 
        notificationTimes: {
          ...state.notificationTimes,
          ...action.payload
        }
      };
    
    case 'UPDATE_PROFILE':
      return { 
        ...state, 
        profile: {
          ...state.profile,
          ...action.payload
        }
      };
    
    case 'RESET_DATA':
      return {
        ...state,
        currentDay: 1,
        weekPlan: generateWeekTemplate(),
        profile: {},
        darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        completedTasks: 0
      };
    
    default:
      return state;
  }
}

// Helper functions to be used in the app
const calculateDayScore = (day) => {
  if (!day || !day.tasks || !day.tasks.length) return { score: 0, total: 0, percentage: 0 };
  
  let totalPoints = 0;
  let earnedPoints = 0;
  let categoryTotals = {};
  let categoryEarned = {};
  
  day.tasks.forEach(task => {
    const taskPoints = task.points || 10; // Default 10 points if not specified
    const category = task.taskCategory || 'uncategorized';
    
    // Add to total points
    totalPoints += taskPoints;
    
    // Add to category totals
    if (!categoryTotals[category]) categoryTotals[category] = 0;
    categoryTotals[category] += taskPoints;
    
    if (task.completed) {
      earnedPoints += taskPoints;
      
      // Add to category earned
      if (!categoryEarned[category]) categoryEarned[category] = 0;
      categoryEarned[category] += taskPoints;
    }
  });
  
  // Create category breakdown
  const categoryBreakdown = Object.keys(categoryTotals).map(category => ({
    category,
    earned: categoryEarned[category] || 0,
    total: categoryTotals[category],
    percentage: categoryTotals[category] > 0 
      ? Math.round(((categoryEarned[category] || 0) / categoryTotals[category]) * 100) 
      : 0
  }));
  
  return {
    score: earnedPoints,
    total: totalPoints,
    percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    categories: categoryBreakdown
  };
};

// Get all tasks for a specific category
const getTasksByCategory = (day, category) => {
  if (!day || !day.tasks) {
    console.log('No day or tasks found in getTasksByCategory', { day, category });
    return [];
  }
  
  console.log(`Getting tasks for category: ${category}`, day.tasks);
  const filteredTasks = day.tasks.filter(task => task.taskCategory === category);
  console.log(`Found ${filteredTasks.length} tasks for category ${category}`);
  
  // For debugging, if no tasks are found, return all tasks
  if (filteredTasks.length === 0) {
    console.log(`No tasks found for ${category}, returning all tasks for debugging`);
    return day.tasks;
  }
  
  return filteredTasks;
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // Initialize with weekTemplate directly to ensure we have data immediately
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    weekPlan: weekTemplate || [], // Add fallback to empty array
    startDate: new Date().toISOString(),
    categoryScores: {}
  });

  // Function to reset the application data
  const resetAppData = () => {
    const resetData = {
      currentDay: 1,
      weekPlan: generateWeekTemplate(),
      profile: {},
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      completedTasks: 0
    };
    
    localforage.setItem('kimjiTransformData', resetData)
      .then(() => {
        dispatch({ type: 'RESET_DATA', payload: resetData });
      })
      .catch(error => {
        console.error('Error resetting app data:', error);
      });
  };

  // Create a safe version of state that ensures weekPlan is always an array
  const safeState = {
    ...state,
    weekPlan: state.weekPlan || []
  };

  // Log the initial state for debugging
  useEffect(() => {
    console.log("AppProvider initial state:", state);
    console.log("Initial weekPlan:", state.weekPlan || []);
    console.log("Initial currentDay:", state.currentDay);
  }, []);

  // Initialize or load data from storage
  useEffect(() => {
    const loadSavedData = async () => {
      // Force a reset to use the latest data from transformData.js
      await resetAppData();
      return;
      
      // Original code below (commented out)
      // try {
      //   const savedData = await localforage.getItem('appData');
      //   console.log('Loaded saved data:', savedData);
      //   if (savedData) {
      //     dispatch({ type: 'INITIALIZE', payload: savedData });
      //   } else {
      //     console.log('No saved data found, initializing with default template');
      //     resetAppData();
      //   }
      // } catch (error) {
      //   console.error('Error loading data:', error);
      //   resetAppData();
      // }
    };

    loadSavedData();
  }, []);

  // Add a debug button to window for manual reset if needed
  useEffect(() => {
    window.resetAppData = resetAppData;
    console.log("Debug function added. Run window.resetAppData() in console to reset app data");
    
    return () => {
      delete window.resetAppData;
    };
  }, []);

  // Save state changes to storage and log them
  useEffect(() => {
    if (state.weekPlan) {
      console.log("Saving state to localforage:", state);
      localforage.setItem('kimjiTransformData', state);
    }
  }, [state]);

  // Check for and trigger reminders
  useEffect(() => {
    if (!state.notifications || !state.weekPlan) return;
    
    const checkReminders = () => {
      const now = new Date();
      
      // Check all tasks for the current day
      const todayTasks = state.weekPlan.find(day => day.day === state.currentDay)?.tasks || [];
      
      todayTasks.forEach(task => {
        if (task.reminder) {
          const reminderTime = new Date(task.reminder);
          
          // If the reminder time is now (within a minute)
          const timeDiff = Math.abs(reminderTime - now);
          if (timeDiff < 60000 && !task.completed) { // Within a minute and not completed
            // Show notification
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("Kimji Transform Reminder", {
                  body: `Time for: ${task.title}`,
                  icon: "/favicon.ico"
                });
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
              }
            }
          }
        }
      });
    };
    
    // Check every minute
    const reminderInterval = setInterval(checkReminders, 60000);
    
    return () => clearInterval(reminderInterval);
  }, [state.notifications, state.weekPlan, state.currentDay]);

  // Auto advance to next day at midnight if enabled
  useEffect(() => {
    const checkDay = () => {
      const startDate = new Date(state.startDate);
      const now = new Date();
      const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      
      // Ensure day is within the 21-day program
      const newDay = Math.min(diffDays + 1, 21);
      
      if (newDay !== state.currentDay) {
        dispatch({ type: 'SET_DAY', payload: newDay });
      }
    };

    // Check once when component mounts
    if (state.startDate) {
      checkDay();
    }

    // Check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    
    const midnightTimer = setTimeout(checkDay, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, [state.startDate, state.currentDay]);

  return (
    <AppContext.Provider value={{ 
      ...safeState, 
      dispatch,
      // Add helper functions that components can use
      calculateDayScore,
      getTasksByCategory,
      taskCategories,
      categoryPoints,
      defaultReminderTimes,
      themes,
      toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
      toggleWorkMode: () => dispatch({ type: 'TOGGLE_WORK_MODE' })
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext); 