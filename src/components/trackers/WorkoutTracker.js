import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRunning, FaSave } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';

const TrackerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const Title = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #FB8500;
  display: flex;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--gray-700);
  margin-right: 1rem;
  flex: 1;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
`;

const Input = styled.input`
  width: 70px;
  padding: 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 1rem;
  text-align: center;
  margin-right: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }
`;

const Unit = styled.span`
  font-size: 0.9rem;
  color: var(--gray-600);
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  margin-left: auto;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--secondary);
  }
`;

const WorkoutStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--gray-100);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-top: 1rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const WorkoutTracker = ({ task }) => {
  const [duration, setDuration] = useState(task.duration || 0);
  const { dispatch } = useAppContext();

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        taskId: task.id,
        data: { duration }
      }
    });
    
    // Also update stats
    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        type: 'workout',
        value: duration
      }
    });
    
    // If duration is 30 minutes or more, mark as completed
    if (duration >= 30 && !task.completed) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    } else if (duration < 30 && task.completed) {
      // If duration is less than 30 minutes and was completed, mark as incomplete
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    }
  };

  // Calculate calories burned (very rough estimate)
  const caloriesBurned = Math.round(duration * 8); // Assuming moderate intensity
  
  return (
    <TrackerContainer>
      <Title>
        <FaRunning style={{ marginRight: '8px' }} /> Workout Tracker
      </Title>
      
      <InputGroup>
        <Label>How long did you workout today?</Label>
        <InputWrapper>
          <Input 
            type="number" 
            min="0"
            max="240"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
          />
          <Unit>minutes</Unit>
        </InputWrapper>
      </InputGroup>
      
      <SaveButton onClick={handleSave}>
        <FaSave /> Save Workout
      </SaveButton>
      
      {duration > 0 && (
        <WorkoutStats>
          <StatItem>
            <StatValue>{duration}</StatValue>
            <StatLabel>Minutes</StatLabel>
          </StatItem>
          
          <StatItem>
            <StatValue>{caloriesBurned}</StatValue>
            <StatLabel>Est. Calories</StatLabel>
          </StatItem>
          
          <StatItem>
            <StatValue>{Math.round(duration / 30 * 100)}%</StatValue>
            <StatLabel>of Goal</StatLabel>
          </StatItem>
        </WorkoutStats>
      )}
    </TrackerContainer>
  );
};

export default WorkoutTracker; 