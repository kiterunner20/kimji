import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  height: 5px;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'var(--gray-200)'};
  
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
  transition: width var(--duration-md) var(--animation-standard);
  
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
`;

const OverallProgress = styled.div`
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  border-bottom: 1px solid var(--gray-200);
  
  .dark-mode & {
    border-bottom-color: var(--gray-700);
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
  border-radius: 5px;
  overflow: hidden;
  
  .dark-mode & {
    background-color: var(--gray-700);
  }
`;

const DaysContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: var(--spacing-lg) var(--spacing-md);
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
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.active ? 'var(--shadow-2)' : 'none'};
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-2);
  }
  
  &:active {
    transform: translateY(-1px);
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
  
  .dark-mode & {
    background-color: ${props => props.active ? 'var(--primary)' : 'var(--gray-800)'};
    color: ${props => props.active ? 'white' : 'var(--gray-300)'};
    
    ${props => props.completed && !props.active && `
      background-color: var(--gray-800);
      border: 1px solid var(--success);
      color: var(--gray-300);
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
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: var(--shadow-2);
  opacity: 0.85;
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:focus {
    outline: none;
  }
  
  &.prev {
    left: 10px;
  }
  
  &.next {
    right: 10px;
  }
  
  .dark-mode & {
    background-color: var(--gray-800);
    color: var(--gray-200);
  }
`;

const DaySelector = () => {
  const { currentDay, weekPlan = [], dispatch } = useAppContext();
  const [activeWeek, setActiveWeek] = useState(Math.ceil(currentDay / 7));
  
  // Log important state for debugging
  useEffect(() => {
    console.log("DaySelector component rendering with currentDay:", currentDay);
    if (weekPlan) {
      console.log("WeekPlan exists with length:", weekPlan.length);
    } else {
      console.log("WeekPlan is null or undefined");
    }
  }, [currentDay, activeWeek, weekPlan]);

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
  const handleDaySelect = (day) => {
    console.log(`Button clicked for day ${day}`);
    
    if (dispatch) {
      console.log(`Dispatching SET_DAY action with payload: ${day}`);
      dispatch({ type: 'SET_DAY', payload: day });
      setActiveWeek(Math.ceil(day / 7));
    } else {
      console.error('Dispatch function not available');
    }
  };

  // Handle switching between weeks
  const handleWeekChange = (weekNumber) => {
    setActiveWeek(weekNumber);
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
    if (!weekPlan) return 0;
    
    let completedDays = 0;
    for (let day = startDay; day <= endDay; day++) {
      if (getDayCompletionStatus(day)) {
        completedDays++;
      }
    }
    
    return Math.round((completedDays / (endDay - startDay + 1)) * 100);
  };

  // Calculate overall progress
  const overallProgress = getCompletionPercentage(1, 21);
  const week1Progress = getCompletionPercentage(1, 7);
  const week2Progress = getCompletionPercentage(8, 14);
  const week3Progress = getCompletionPercentage(15, 21);

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
  
  // Auto-scroll to current day on mount
  useEffect(() => {
    setTimeout(() => {
      scrollToDay(currentDay);
    }, 300);
  }, []);
  
  const scrollLeft = () => {
    const container = daysContainerRef.current;
    if (container) {
      container.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    const container = daysContainerRef.current;
    if (container) {
      container.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <DaySelectorWrapper>
      <WeekTabsContainer>
        <WeekTab 
          active={activeWeek === 1} 
          onClick={() => handleWeekChange(1)}
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
      
      <OverallProgress>
        <ProgressLabel>Overall Progress: {overallProgress}%</ProgressLabel>
        <ProgressBarContainer>
          <ProgressBar percent={overallProgress} />
        </ProgressBarContainer>
      </OverallProgress>
      
      <div style={{ position: 'relative' }}>
        <NavigationButton className="prev" onClick={scrollLeft} aria-label="Scroll left">
          <FaChevronLeft />
        </NavigationButton>
        
        <DaysContainer ref={daysContainerRef}>
          {daysToShow.map((day, index) => {
            const isActive = day === currentDay;
            const isCompleted = getDayCompletionStatus(day);
            
            return (
              <DayCard
                key={day}
                active={isActive}
                completed={isCompleted}
                onClick={() => handleDaySelect(day)}
                className="day-card"
                aria-label={`Day ${day}: ${getDayTitle(day)}`}
              >
                <DayNumber>{day}</DayNumber>
                <DayName>{getDayTitle(day)}</DayName>
                <DayDate>{getDateByIndex(day - 1)}</DayDate>
                
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