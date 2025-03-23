import React, { createContext, useContext, useEffect, useReducer } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { generateCustomTaskData } from '../data/transformData';

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