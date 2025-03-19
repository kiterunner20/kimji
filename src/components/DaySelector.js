import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

const DaySelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const DayButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 80px;
  margin: 0 0.3rem;
  padding: 0.5rem;
  background-color: ${(props) => 
    props.active ? 'var(--primary)' : props.completed ? 'var(--gray-200)' : 'white'};
  color: ${(props) => (props.active ? 'white' : 'var(--gray-800)')};
  border: 2px solid ${(props) => 
    props.active ? 'var(--primary)' : props.completed ? 'var(--success)' : 'var(--gray-300)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${(props) => 
      props.active ? 'var(--primary)' : props.completed ? 'var(--gray-700)' : 'var(--gray-800)'};
    color: ${(props) => (props.active ? 'white' : 'var(--gray-200)')};
    border-color: ${(props) => 
      props.active ? 'var(--primary)' : props.completed ? 'var(--success)' : 'var(--gray-600)'};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary);
  }
`;

const DayNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const DayName = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CompletionIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => 
    props.completed ? 'var(--success)' : 'transparent'};
`;

const DaySelector = () => {
  const { currentDay, weekPlan, dispatch } = useAppContext();

  const handleDaySelect = (day) => {
    dispatch({ type: 'SET_DAY', payload: day });
  };

  // Calculate completion status for each day
  const getDayCompletionStatus = (day) => {
    if (!weekPlan) return false;
    
    const dayPlan = weekPlan.find(d => d.day === day);
    if (!dayPlan) return false;
    
    // A day is complete if all tasks are completed
    return dayPlan.tasks.every(task => task.completed);
  };

  return (
    <DaySelectorContainer>
      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
        <DayButton
          key={day}
          active={day === currentDay}
          completed={getDayCompletionStatus(day)}
          onClick={() => handleDaySelect(day)}
        >
          <CompletionIndicator completed={getDayCompletionStatus(day)} />
          <DayNumber>{day}</DayNumber>
          <DayName>
            {weekPlan && weekPlan.find(d => d.day === day)?.title.split(' ')[0]}
          </DayName>
        </DayButton>
      ))}
    </DaySelectorContainer>
  );
};

export default DaySelector; 