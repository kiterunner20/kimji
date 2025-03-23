import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';

// Styled components with Material Design principles
const DaySelectorWrapper = styled.div`
  width: 100%;
  margin-bottom: var(--spacing-xl);
  background-color: var(--light);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-1);
  overflow: hidden;
  
  .dark-mode & {
    background-color: var(--gray-800);
  }
`;

const WeekTabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: var(--gray-50);
  
  .dark-mode & {
    background-color: var(--gray-900);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const WeekTab = styled.button`
  flex: 1;
  padding: var(--spacing-md) var(--spacing-sm);
  background-color: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--gray-700)'};
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.1px;
  cursor: pointer;
  transition: all var(--duration-md) var(--animation-standard);
  position: relative;
  overflow: hidden;
  min-height: 48px;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'rgba(0,0,0,0.04)'};
  }
  
  .dark-mode & {
    color: ${props => props.active ? 'white' : 'var(--gray-300)'};
    
    &:hover {
      background-color: ${props => props.active ? 'var(--primary-dark)' : 'rgba(255,255,255,0.08)'};
    }
  }
  
  @media (max-width: 768px) {
    text-align: left;
    padding-left: var(--spacing-md);
  }
`;

const WeekTabContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const WeekTabTitle = styled.span`
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const WeekTabSubtitle = styled.span`
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${props => props.active ? '6px' : '5px'};
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'var(--gray-200)'};
  overflow: hidden;
  
  .dark-mode & {
    background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'var(--gray-700)'};
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => 
    props.percent >= 80 ? 'var(--success)' : 
    props.percent >= 40 ? 'var(--warning)' : 
    'var(--info)'
  };
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  ${props => props.percent > 0 && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
  `}
  
  ${props => props.percent >= 100 && `
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent);
      animation: shine 1.5s infinite;
    }
    
    @keyframes shine {
      100% {
        left: 150%;
      }
    }
  `}
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const OverallProgress = styled.div`
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  border-bottom: 1px solid var(--gray-200);
  background-color: ${props => props.percent >= 80 ? 'rgba(16, 185, 129, 0.05)' : 
                       props.percent >= 40 ? 'rgba(245, 158, 11, 0.05)' : 
                       'rgba(99, 102, 241, 0.05)'};
  transition: background-color 1s ease;
  
  .dark-mode & {
    border-bottom-color: var(--gray-700);
    background-color: ${props => props.percent >= 80 ? 'rgba(16, 185, 129, 0.1)' : 
                         props.percent >= 40 ? 'rgba(245, 158, 11, 0.1)' : 
                         'rgba(99, 102, 241, 0.1)'};
  }
`;

const ProgressLabel = styled.span`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--gray-700);
  
  .dark-mode & {
    color: var(--gray-300);
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--gray-200);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .dark-mode & {
    background-color: var(--gray-700);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  }
`;

const DaysContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: var(--spacing-lg) var(--spacing-md);
  padding-left: 50px;
  padding-right: 50px;
  gap: var(--spacing-md);
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
    padding-left: 45px;
    padding-right: 45px;
    gap: var(--spacing-sm);
  }
`;

const DayCard = styled.div`
  min-width: 85px;
  height: 115px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--gray-100)'};
  color: ${props => props.active ? 'white' : 'var(--gray-700)'};
  border-radius: var(--border-radius-lg);
  padding: 0.75rem;
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.active ? 'var(--shadow-2)' : 'none'};
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    transform: ${props => props.locked ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.locked ? 'none' : 'var(--shadow-2)'};
  }
  
  &:active {
    transform: ${props => props.locked ? 'none' : 'translateY(-1px)'};
  }
  
  ${props => props.completed && !props.active && `
    background-color: var(--gray-100);
    border: 1px solid var(--success);
    color: var(--gray-700);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 6px;
      right: 8px;
      font-size: 12px;
      color: var(--success);
      font-weight: bold;
    }
  `}
  
  ${props => props.locked && `
    opacity: 0.7;
    background-color: var(--gray-200);
    color: var(--gray-500);
  `}
  
  .dark-mode & {
    background-color: ${props => props.active ? 'var(--primary)' : 'var(--gray-800)'};
    color: ${props => props.active ? 'white' : 'var(--gray-300)'};
    
    ${props => props.completed && !props.active && `
      background-color: var(--gray-800);
      border: 1px solid var(--success);
      color: var(--gray-300);
    `}
    
    ${props => props.locked && `
      opacity: 0.7;
      background-color: var(--gray-900);
      color: var(--gray-600);
    `}
  }
`;

const DayNumber = styled.span`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-family: var(--font-family-display);
`;

const DayName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const DayDate = styled.span`
  font-size: 0.75rem;
  opacity: 0.85;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &.prev {
    left: 15px;
  }
  
  &.next {
    right: 15px;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    &.prev {
      left: 12px;
    }
    
    &.next {
      right: 12px;
    }
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const LockIcon = styled.div`
  position: absolute;
  top: 6px;
  right: 8px;
  color: var(--gray-500);
  font-size: 14px;
  
  .dark-mode & {
    color: var(--gray-600);
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  
  .dark-mode & {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const TestModeToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);

  label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
`;

const DaySelector = ({ onDaySelect }) => {
  const { currentDay, weekPlan = [], dispatch } = useAppContext();
  const [activeWeek, setActiveWeek] = useState(Math.ceil(currentDay / 7));
  // Add a local state to track the selected day
  const [selectedDayState, setSelectedDayState] = useState(currentDay);
  // Add test mode state
  const [testMode, setTestMode] = useState(false);
  
  // Log important state for debugging
  useEffect(() => {
    console.log("DaySelector component rendering with currentDay:", currentDay);
    console.log("DaySelector component with selectedDayState:", selectedDayState);
    if (weekPlan) {
      console.log("WeekPlan exists with length:", weekPlan.length);
    } else {
      console.log("WeekPlan is null or undefined");
    }
    
    // Sync selectedDayState with currentDay from context
    if (currentDay !== selectedDayState) {
      setSelectedDayState(currentDay);
    }
  }, [currentDay, activeWeek, weekPlan, selectedDayState]);

  // Get an array of days for the active week
  const daysInWeek = 7;
  const firstDayOfWeek = (activeWeek - 1) * daysInWeek + 1;
  const lastDayOfWeek = Math.min(firstDayOfWeek + daysInWeek - 1, 21); // Cap at 21 days
  const daysToShow = Array.from(
    { length: lastDayOfWeek - firstDayOfWeek + 1 },
    (_, i) => firstDayOfWeek + i
  );
  
  // Get the day title based on the day number
  const getDayTitle = (day) => {
    const dayData = Array.isArray(weekPlan) ? weekPlan.find(d => d && d.day === day) : null;
    return dayData?.title || `Day ${day}`;
  };

  // Get week description
  const getWeekDescription = (weekNum) => {
    switch(weekNum) {
      case 1: return "Days 1-7";
      case 2: return "Days 8-14";
      case 3: return "Days 15-21";
      default: return "";
    }
  };

  // Simple direct click handler
  const handleDaySelect = (day, isLocked) => {
    // Don't allow selecting locked days
    if (isLocked) {
      console.log(`Day ${day} is locked and not selectable yet`);
      return;
    }
    
    console.log(`DaySelector: Button clicked for day ${day}`);
    
    // Check if weekPlan exists
    if (!Array.isArray(weekPlan)) {
      console.error('weekPlan is not an array:', weekPlan);
      return;
    }
    
    // Check if the day exists in weekPlan
    const dayPlan = weekPlan.find(d => d && d.day === day);
    if (!dayPlan) {
      console.error(`No day plan found for day ${day}`);
      return;
    }
    
    console.log(`DaySelector: Selected day ${day}: ${dayPlan.title}`);
    console.log(`DaySelector: Tasks for day ${day}:`, dayPlan.tasks?.length);
    
    // Update the local state immediately for UI feedback
    setSelectedDayState(day);
    
    // If onDaySelect prop exists, call it directly
    if (typeof onDaySelect === 'function') {
      console.log(`DaySelector: Using onDaySelect prop callback for day ${day}`);
      onDaySelect(day);
    }
    // Otherwise fall back to using dispatch directly (backward compatibility)
    else if (dispatch) {
      console.log(`DaySelector: Dispatching SET_DAY action with payload: ${day}`);
      dispatch({ type: 'SET_DAY', payload: day });
      setActiveWeek(Math.ceil(day / 7));
      
      // After dispatching, log the current day
      console.log(`DaySelector: Day selection complete. Day ${day} selected.`);
    } else {
      console.error('Neither onDaySelect prop nor dispatch function is available');
    }
  };

  // Handle switching between weeks
  const handleWeekChange = (weekNumber) => {
    setActiveWeek(weekNumber);
    
    // Calculate first day of the selected week and notify parent component
    const firstDayOfWeek = (weekNumber - 1) * daysInWeek + 1;
    
    // If onDaySelect prop exists, call it to update parent component
    if (typeof onDaySelect === 'function') {
      console.log(`DaySelector: Selecting first day of week ${weekNumber}: day ${firstDayOfWeek}`);
      onDaySelect(firstDayOfWeek);
    }
    // Otherwise fall back to using dispatch directly
    else if (dispatch) {
      console.log(`DaySelector: Dispatching SET_DAY action for first day of week ${weekNumber}: ${firstDayOfWeek}`);
      dispatch({ type: 'SET_DAY', payload: firstDayOfWeek });
    }
  };

  // Calculate completion status for each day
  const getDayCompletionStatus = (day) => {
    if (!weekPlan) return false;
    
    const dayPlan = weekPlan.find(d => d.day === day);
    if (!dayPlan) return false;
    
    // A day is complete if all tasks are completed
    return dayPlan.tasks.every(task => task.completed);
  };

  // Get formatted date (Mar 19)
  const getDateByIndex = (index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate percentage of completed days
  const getCompletionPercentage = (startDay, endDay) => {
    if (!weekPlan || weekPlan.length === 0) {
      console.log(`No week plan data available for days ${startDay}-${endDay}`);
      return 0;
    }

    // Filter the days in the specified range
    const daysInRange = weekPlan.filter(day => 
      day.day >= startDay && day.day <= endDay
    );
    
    if (daysInRange.length === 0) {
      console.log(`No days found in range ${startDay}-${endDay}`);
      return 0;
    }

    let totalTasksCount = 0;
    let completedTasksCount = 0;

    // Count all tasks and completed tasks
    daysInRange.forEach(day => {
      const dayTasks = day.tasks || [];
      
      dayTasks.forEach(task => {
        totalTasksCount++;
        
        if (task.completed) {
          completedTasksCount++;
        }
      });
    });

    // Debug logs
    console.log(`Progress for days ${startDay}-${endDay}:`);
    console.log(`- Total tasks: ${totalTasksCount}`);
    console.log(`- Completed tasks: ${completedTasksCount}`);
    
    // Calculate percentage (safeguard against division by zero)
    if (totalTasksCount === 0) {
      console.log(`No tasks found for days ${startDay}-${endDay}`);
      return 0;
    }
    
    const percentage = Math.round((completedTasksCount / totalTasksCount) * 100);
    console.log(`- Completion percentage: ${percentage}%`);
    
    return percentage;
  };

  // Add memoization to prevent unnecessary re-calculation
  const memoizedGetCompletionPercentage = (startDay, endDay) => {
    // Use unique key for this calculation
    const key = `progress-${startDay}-${endDay}`;
    
    // Return from cache if already calculated
    if (progressCache.current[key] !== undefined && !forceProgressUpdate.current) {
      return progressCache.current[key];
    }
    
    const result = getCompletionPercentage(startDay, endDay);
    progressCache.current[key] = result;
    return result;
  };

  // Add these at the component level
  const progressCache = useRef({});
  const forceProgressUpdate = useRef(false);

  // Reset the cache when the weekPlan changes
  useEffect(() => {
    progressCache.current = {};
    forceProgressUpdate.current = true;
    
    // Reset the force update flag after a short delay
    const timer = setTimeout(() => {
      forceProgressUpdate.current = false;
    }, 500);
    
    return () => clearTimeout(timer);
  }, [weekPlan]);

  // Calculate overall progress - use the memoized version
  const overallProgress = memoizedGetCompletionPercentage(1, 21);
  const week1Progress = memoizedGetCompletionPercentage(1, 7);
  const week2Progress = memoizedGetCompletionPercentage(8, 14);
  const week3Progress = memoizedGetCompletionPercentage(15, 21);

  // Add scrolling functionality
  const daysContainerRef = useRef(null);
  
  const scrollToDay = (day) => {
    const container = daysContainerRef.current;
    if (!container) return;
    
    const dayElements = container.querySelectorAll('.day-card');
    if (dayElements.length < day) return;
    
    const dayElement = dayElements[day - 1];
    if (!dayElement) return;
    
    const containerWidth = container.offsetWidth;
    const elementLeft = dayElement.offsetLeft;
    const elementWidth = dayElement.offsetWidth;
    
    // Center the day in the container
    container.scrollTo({
      left: elementLeft - (containerWidth / 2) + (elementWidth / 2),
      behavior: 'smooth'
    });
  };
  
  // Add this function to programmatically scroll to a specific week
  const scrollToActiveWeek = (weekNumber) => {
    const container = daysContainerRef.current;
    if (!container) return;
    
    // Calculate the scroll position based on the week
    let scrollPosition;
    switch (weekNumber) {
      case 1:
        scrollPosition = 0;
        break;
      case 2:
        scrollPosition = container.scrollWidth / 3;
        break;
      case 3:
        scrollPosition = (container.scrollWidth / 3) * 2;
        break;
      default:
        scrollPosition = 0;
    }
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Modify the useEffect to also respond to activeWeek changes
  useEffect(() => {
    scrollToActiveWeek(activeWeek);
  }, [activeWeek]);

  // Add touch swipe functionality to the days container
  useEffect(() => {
    const container = daysContainerRef.current;
    if (!container) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e) => {
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      const SWIPE_THRESHOLD = 75; // Minimum distance required for a swipe
      
      if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
        // Swipe Left -> Go to next day
        scrollRight();
      } else if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
        // Swipe Right -> Go to previous day
        scrollLeft();
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Enhance the scroll functions to update the active week when navigating
  const scrollLeft = () => {
    const container = daysContainerRef.current;
    if (container) {
      container.scrollBy({
        left: -210,
        behavior: 'smooth'
      });
      
      // Update the active week based on scroll direction
      if (activeWeek > 1) {
        setTimeout(() => {
          setActiveWeek(prev => Math.max(prev - 1, 1));
        }, 300);
      }
    }
  };

  const scrollRight = () => {
    const container = daysContainerRef.current;
    if (container) {
      container.scrollBy({
        left: 210,
        behavior: 'smooth'
      });
      
      // Update the active week based on scroll direction
      if (activeWeek < 3) {
        setTimeout(() => {
          setActiveWeek(prev => Math.min(prev + 1, 3));
        }, 300);
      }
    }
  };

  // Determine if a day is locked (future day that can't be accessed yet)
  const isDayLocked = (day) => {
    // In test mode, all days are unlocked
    if (testMode) {
      return false;
    }
    // In regular mode, only current and previous days are unlocked
    return day > currentDay;
  };

  return (
    <DaySelectorWrapper>
      <WeekTabsContainer>
        <WeekTab 
          active={activeWeek === 1} 
          onClick={() => handleWeekChange(1)}
          className="week-tab"
        >
          <WeekTabContent>
            <WeekTabTitle>Week 1: Foundation</WeekTabTitle>
            <WeekTabSubtitle>{getWeekDescription(1)}</WeekTabSubtitle>
          </WeekTabContent>
          <ProgressIndicator active={activeWeek === 1}>
            <ProgressBar percent={week1Progress} />
          </ProgressIndicator>
        </WeekTab>
        <WeekTab 
          active={activeWeek === 2} 
          onClick={() => handleWeekChange(2)}
          className="week-tab"
        >
          <WeekTabContent>
            <WeekTabTitle>Week 2: Expansion</WeekTabTitle>
            <WeekTabSubtitle>{getWeekDescription(2)}</WeekTabSubtitle>
          </WeekTabContent>
          <ProgressIndicator active={activeWeek === 2}>
            <ProgressBar percent={week2Progress} />
          </ProgressIndicator>
        </WeekTab>
        <WeekTab 
          active={activeWeek === 3} 
          onClick={() => handleWeekChange(3)}
          className="week-tab"
        >
          <WeekTabContent>
            <WeekTabTitle>Week 3: Mastery</WeekTabTitle>
            <WeekTabSubtitle>{getWeekDescription(3)}</WeekTabSubtitle>
          </WeekTabContent>
          <ProgressIndicator active={activeWeek === 3}>
            <ProgressBar percent={week3Progress} />
          </ProgressIndicator>
        </WeekTab>
      </WeekTabsContainer>
      
      <OverallProgress percent={overallProgress}>
        <ProgressLabel>
          Overall Progress: {Math.round(overallProgress)}%
          <TestModeToggle>
            <label>
              <input
                type="checkbox"
                checked={testMode}
                onChange={() => setTestMode(!testMode)}
              />
              Test Mode {testMode ? '(All Days Unlocked)' : '(Normal Mode)'}
            </label>
          </TestModeToggle>
        </ProgressLabel>
        <ProgressBarContainer>
          <ProgressBar percent={overallProgress} />
        </ProgressBarContainer>
      </OverallProgress>
      
      <div style={{ position: 'relative', padding: '0 10px' }}>
        <NavigationButton className="prev" onClick={scrollLeft} aria-label="Scroll left">
          <FaChevronLeft />
        </NavigationButton>
        
        <DaysContainer ref={daysContainerRef}>
          {daysToShow.map((day, index) => {
            // Use the local state for determining active status
            const isActive = day === selectedDayState;
            const isCompleted = getDayCompletionStatus(day);
            const isLocked = isDayLocked(day);
            
            return (
              <DayCard
                key={day}
                active={isActive}
                completed={isCompleted}
                locked={isLocked}
                onClick={() => handleDaySelect(day, isLocked)}
                className="day-card"
                aria-label={`Day ${day}: ${getDayTitle(day)}`}
              >
                <DayNumber>{day}</DayNumber>
                <DayName>{getDayTitle(day)}</DayName>
                <DayDate>{getDateByIndex(day - 1)}</DayDate>
                
                {isLocked && (
                  <>
                    <LockIcon>
                      <FaLock />
                    </LockIcon>
                    <LockedOverlay />
                  </>
                )}
                
                <ProgressIndicator active={isActive}>
                  <ProgressBar percent={getCompletionPercentage(day, day)} />
                </ProgressIndicator>
              </DayCard>
            );
          })}
        </DaysContainer>
        
        <NavigationButton className="next" onClick={scrollRight} aria-label="Scroll right">
          <FaChevronRight />
        </NavigationButton>
      </div>
    </DaySelectorWrapper>
  );
};

export default DaySelector; 