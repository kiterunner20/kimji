import React, { createContext, useContext, useEffect, useReducer } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

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

// Initial template for our 7-day program with transformative tasks
const generateWeekTemplate = () => {
  return [1, 2, 3, 4, 5, 6, 7].map(day => {
    return {
      day,
      title: getDayTitle(day),
      tasks: [
        // Personal Growth category
        {
          id: createTaskId(day, taskCategories.PERSONAL_GROWTH, 'learn_new_skill'),
          title: "Learn New Skill",
          description: "Spend 15 minutes learning a new skill (language, coding, instrument)",
          completed: false,
          type: "learning",
          category: "afternoon",
          taskCategory: taskCategories.PERSONAL_GROWTH,
          points: categoryPoints[taskCategories.PERSONAL_GROWTH],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.PERSONAL_GROWTH, 'journal_improvements'),
          title: "Journal Improvements",
          description: "Write 3 things you improved today in a journal",
          completed: false,
          type: "reflection",
          category: "evening",
          taskCategory: taskCategories.PERSONAL_GROWTH,
          points: categoryPoints[taskCategories.PERSONAL_GROWTH],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.PERSONAL_GROWTH, 'motivational_content'),
          title: "Motivational Content",
          description: "Listen to a motivational podcast/episode",
          completed: false,
          type: "learning",
          category: "morning",
          taskCategory: taskCategories.PERSONAL_GROWTH,
          points: categoryPoints[taskCategories.PERSONAL_GROWTH],
          reminder: null
        },
        
        // Emotional Health category
        {
          id: createTaskId(day, taskCategories.EMOTIONAL_HEALTH, 'gratitude_reflection'),
          title: "Gratitude Reflection",
          description: "5-minute gratitude reflection (write or verbalize)",
          completed: false,
          type: "gratitude",
          entries: [],
          category: "morning",
          taskCategory: taskCategories.EMOTIONAL_HEALTH,
          points: categoryPoints[taskCategories.EMOTIONAL_HEALTH],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.EMOTIONAL_HEALTH, 'box_breathing'),
          title: "Box Breathing",
          description: "Practice 'box breathing' (4-4-4-4) when stressed",
          completed: false,
          type: "meditation",
          category: "afternoon",
          taskCategory: taskCategories.EMOTIONAL_HEALTH,
          points: categoryPoints[taskCategories.EMOTIONAL_HEALTH],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.EMOTIONAL_HEALTH, 'forgive_annoyance'),
          title: "Forgive Annoyance",
          description: "Forgive one small annoyance from today",
          completed: false,
          type: "kindness",
          category: "evening",
          taskCategory: taskCategories.EMOTIONAL_HEALTH,
          points: categoryPoints[taskCategories.EMOTIONAL_HEALTH],
          reminder: null
        },
        
        // Mental Fitness category
        {
          id: createTaskId(day, taskCategories.MENTAL_FITNESS, 'read_nonfiction'),
          title: "Read Non-Fiction",
          description: "Read 10 pages of a non-fiction book",
          completed: false,
          type: "learning",
          category: "evening",
          taskCategory: taskCategories.MENTAL_FITNESS,
          points: categoryPoints[taskCategories.MENTAL_FITNESS],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.MENTAL_FITNESS, 'solve_puzzle'),
          title: "Solve a Puzzle",
          description: "Solve a brain teaser/puzzle",
          completed: false,
          type: "productivity",
          category: "afternoon",
          taskCategory: taskCategories.MENTAL_FITNESS,
          points: categoryPoints[taskCategories.MENTAL_FITNESS],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.MENTAL_FITNESS, 'creative_ideas'),
          title: "Creative Ideas",
          description: "Write down 3 creative ideas",
          completed: false,
          type: "creativity",
          category: "morning",
          taskCategory: taskCategories.MENTAL_FITNESS,
          points: categoryPoints[taskCategories.MENTAL_FITNESS],
          reminder: null
        },
        
        // Physical Health category
        {
          id: createTaskId(day, taskCategories.PHYSICAL_HEALTH, 'dynamic_stretching'),
          title: "Dynamic Stretching",
          description: "Do 5 minutes of dynamic stretching",
          completed: false,
          type: "workout",
          duration: 0,
          category: "morning",
          taskCategory: taskCategories.PHYSICAL_HEALTH,
          points: categoryPoints[taskCategories.PHYSICAL_HEALTH],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.PHYSICAL_HEALTH, 'nature_walk'),
          title: "Nature Walk",
          description: "Take a 10-minute walk in nature",
          completed: false,
          type: "workout",
          duration: 0,
          category: "afternoon",
          taskCategory: taskCategories.PHYSICAL_HEALTH,
          points: categoryPoints[taskCategories.PHYSICAL_HEALTH],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.PHYSICAL_HEALTH, 'water_intake'),
          title: "Drink Water",
          description: "Drink 8 glasses of water (track with counter)",
          completed: false,
          type: "hydration",
          count: 0,
          target: 8,
          category: "all-day",
          taskCategory: taskCategories.PHYSICAL_HEALTH,
          points: categoryPoints[taskCategories.PHYSICAL_HEALTH],
          reminder: null
        },
        
        // Relationships category
        {
          id: createTaskId(day, taskCategories.RELATIONSHIPS, 'meaningful_conversation'),
          title: "Meaningful Conversation",
          description: "Have 1 meaningful conversation with a loved one",
          completed: false,
          type: "connection",
          category: "evening",
          taskCategory: taskCategories.RELATIONSHIPS,
          points: categoryPoints[taskCategories.RELATIONSHIPS],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.RELATIONSHIPS, 'give_compliments'),
          title: "Give Compliments",
          description: "Compliment 3 people genuinely",
          completed: false,
          type: "kindness",
          category: "afternoon",
          taskCategory: taskCategories.RELATIONSHIPS,
          points: categoryPoints[taskCategories.RELATIONSHIPS],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.RELATIONSHIPS, 'reconnect'),
          title: "Reconnect",
          description: "Message/Call someone you haven't spoken to recently",
          completed: false,
          type: "connection",
          category: "evening",
          taskCategory: taskCategories.RELATIONSHIPS,
          points: categoryPoints[taskCategories.RELATIONSHIPS],
          reminder: null
        },
        
        // Social & Communication category
        {
          id: createTaskId(day, taskCategories.SOCIAL, 'active_listening'),
          title: "Active Listening",
          description: "Practice active listening in 1 conversation",
          completed: false,
          type: "communication",
          category: "all-day",
          taskCategory: taskCategories.SOCIAL,
          points: categoryPoints[taskCategories.SOCIAL],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.SOCIAL, 'share_information'),
          title: "Share Helpful Info",
          description: "Share helpful information with a colleague/friend",
          completed: false,
          type: "kindness",
          category: "afternoon",
          taskCategory: taskCategories.SOCIAL,
          points: categoryPoints[taskCategories.SOCIAL],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.SOCIAL, 'no_interrupting'),
          title: "No Interrupting",
          description: "Avoid interrupting others in discussions",
          completed: false,
          type: "communication",
          category: "all-day",
          taskCategory: taskCategories.SOCIAL,
          points: categoryPoints[taskCategories.SOCIAL],
          reminder: null
        },
        
        // Financial Wellness category
        {
          id: createTaskId(day, taskCategories.FINANCIAL, 'review_expenses'),
          title: "Review Expenses",
          description: "Review daily expenses",
          completed: false,
          type: "expense",
          entries: [],
          category: "evening",
          taskCategory: taskCategories.FINANCIAL,
          points: categoryPoints[taskCategories.FINANCIAL],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.FINANCIAL, 'save_money'),
          title: "Save Money",
          description: "Save $5 (or equivalent) in a 'growth fund'",
          completed: false,
          type: "saving",
          category: "evening",
          taskCategory: taskCategories.FINANCIAL,
          points: categoryPoints[taskCategories.FINANCIAL],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.FINANCIAL, 'financial_literacy'),
          title: "Financial Literacy",
          description: "Research one financial literacy concept",
          completed: false,
          type: "learning",
          category: "afternoon",
          taskCategory: taskCategories.FINANCIAL,
          points: categoryPoints[taskCategories.FINANCIAL],
          reminder: null
        },
        
        // Spiritual/Mindfulness category
        {
          id: createTaskId(day, taskCategories.MINDFULNESS, 'morning_intention'),
          title: "Morning Intention",
          description: "Morning intention setting (write 1 goal)",
          completed: false,
          type: "planning",
          category: "morning",
          taskCategory: taskCategories.MINDFULNESS,
          points: categoryPoints[taskCategories.MINDFULNESS],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.MINDFULNESS, 'evening_reflection'),
          title: "Evening Reflection",
          description: "Evening reflection on daily actions",
          completed: false,
          type: "reflection",
          category: "evening",
          taskCategory: taskCategories.MINDFULNESS,
          points: categoryPoints[taskCategories.MINDFULNESS],
          reminder: null
        },
        {
          id: createTaskId(day, taskCategories.MINDFULNESS, 'mindful_breathing'),
          title: "Mindful Breathing",
          description: "3-minute mindful breathing session",
          completed: false,
          type: "meditation",
          category: "morning",
          taskCategory: taskCategories.MINDFULNESS,
          points: categoryPoints[taskCategories.MINDFULNESS],
          reminder: null
        }
      ]
    };
  });
};

// Helper function to get day title
function getDayTitle(day) {
  const titles = [
    "Foundation Day",
    "Mind & Body",
    "Productivity Focus",
    "Wellness Wednesday",
    "Growth Day",
    "Connection Day",
    "Reflection & Reset"
  ];
  return titles[day - 1];
}

// Generate the week template
const weekTemplate = generateWeekTemplate();

// Initial state
const initialState = {
  currentDay: 1,
  weekPlan: null,
  startDate: null,
  darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
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

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'INIT_DATA':
      return { ...state, ...action.payload };
    
    case 'SET_DAY':
      return { ...state, currentDay: action.payload };
    
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
      
      // Only add to the specific day in the week plan
      const weekPlanWithCustomTask = state.weekPlan.map(day => {
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
    weekPlan: weekTemplate,
    startDate: new Date().toISOString(),
    categoryScores: {}
  });

  // Initialize or load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await localforage.getItem('transformWeekData');
        
        if (savedData) {
          dispatch({ type: 'INIT_DATA', payload: savedData });
        } else {
          // First time initialization
          const now = new Date();
          dispatch({ 
            type: 'INIT_DATA', 
            payload: { 
              weekPlan: weekTemplate,
              startDate: now.toISOString(),
              taskHistory: [],
              customTasks: [],
              categoryScores: {}
            }
          });
        }
      } catch (error) {
        console.error('Error loading data', error);
        // No need for fallback as we already initialized with weekTemplate
      }
    };

    loadData();
  }, []);

  // Save state changes to storage
  useEffect(() => {
    if (state.weekPlan) {
      localforage.setItem('transformWeekData', state);
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
                new Notification("TransformWeek Reminder", {
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
      
      // Ensure day is within the 7-day program
      const newDay = Math.min(diffDays + 1, 7);
      
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
      ...state, 
      dispatch,
      // Add helper functions that components can use
      calculateDayScore,
      getTasksByCategory,
      taskCategories,
      categoryPoints,
      defaultReminderTimes
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext); 