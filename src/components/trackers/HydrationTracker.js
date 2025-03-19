import React from 'react';
import styled from 'styled-components';
import { FaPlus, FaMinus, FaWater } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';

const TrackerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const Title = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #48CAE4;
`;

const WaterControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ControlButton = styled.button`
  background-color: ${props => props.disabled ? 'var(--gray-300)' : 'var(--primary)'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.disabled ? 'var(--gray-300)' : 'var(--secondary)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CounterValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #48CAE4;
  margin-bottom: 0.25rem;
`;

const CounterLabel = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: var(--gray-200);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => (props.value / props.max) * 100}%;
  background-color: #48CAE4;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
  text-align: right;
`;

const HydrationTracker = ({ task }) => {
  const { dispatch } = useAppContext();

  const handleIncrement = () => {
    if (task.count < task.target) {
      const newCount = task.count + 1;
      updateHydration(newCount);
      
      // If we've hit the target, mark the task as completed
      if (newCount >= task.target) {
        dispatch({
          type: 'TOGGLE_TASK',
          payload: { taskId: task.id }
        });
      }
    }
  };

  const handleDecrement = () => {
    if (task.count > 0) {
      const newCount = task.count - 1;
      updateHydration(newCount);
      
      // If we've gone below the target and the task was completed, mark it incomplete
      if (newCount < task.target && task.completed) {
        dispatch({
          type: 'TOGGLE_TASK',
          payload: { taskId: task.id }
        });
      }
    }
  };

  const updateHydration = (newCount) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        taskId: task.id,
        data: { count: newCount }
      }
    });
    
    // Also update the stats
    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        type: 'hydration',
        value: newCount * 250 // ml per glass
      }
    });
  };

  return (
    <TrackerContainer>
      <Title>
        <FaWater style={{ marginRight: '8px' }} /> Water Intake Tracker
      </Title>
      
      <WaterControls>
        <ControlButton 
          onClick={handleDecrement}
          disabled={task.count <= 0}
        >
          <FaMinus />
        </ControlButton>
        
        <Counter>
          <CounterValue>{task.count}</CounterValue>
          <CounterLabel>glasses</CounterLabel>
        </Counter>
        
        <ControlButton 
          onClick={handleIncrement}
          disabled={task.count >= task.target}
        >
          <FaPlus />
        </ControlButton>
      </WaterControls>
      
      <ProgressContainer>
        <ProgressBar value={task.count} max={task.target} />
      </ProgressContainer>
      
      <ProgressText>
        {task.count} of {task.target} glasses ({Math.round((task.count / task.target) * 100)}%)
      </ProgressText>
    </TrackerContainer>
  );
};

export default HydrationTracker; 