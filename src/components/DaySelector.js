// Determine if a day is locked (future day that can't be accessed yet)
const isDayLocked = (day) => {
  // For testing purposes, we're unlocking all days
  // In production, this would be: return day > currentDay;
  return false;
}; 