import React, { useState } from 'react';
import styled from 'styled-components';
import { FaWater, FaPlus, FaMinus } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';

// Modern animated container
const TrackerContainer = styled.div`
  margin: 1rem 0;
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  background: linear-gradient(135deg, rgba(72, 202, 228, 0.1), rgba(72, 202, 228, 0.05));
  box-shadow: 0 4px 15px rgba(72, 202, 228, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background: radial-gradient(circle at 30% 30%, rgba(72, 202, 228, 0.1), transparent 60%);
  }
  
  .dark-mode & {
    background: linear-gradient(135deg, rgba(72, 202, 228, 0.15), rgba(72, 202, 228, 0.05));
  }
`;

const TrackerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const TrackerIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #48CAE4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
  box-shadow: 0 3px 8px rgba(72, 202, 228, 0.3);
  animation: float 3s ease-in-out infinite;
`;

const TrackerTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0891b2;
  flex: 1;
  
  .dark-mode & {
    color: #67e8f9;
  }
`;

// Water drops container with 3D perspective
const DropsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  perspective: 1000px;
  position: relative;
  z-index: 1;
`;

// Animated water drop
const WaterDrop = styled.div`
  width: 38px;
  height: 50px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: ${props => props.filled ? 
    'linear-gradient(135deg, #48CAE4, #0891b2)' : 
    'rgba(226, 232, 240, 0.5)'};
  box-shadow: ${props => props.filled ? 
    '0 5px 15px rgba(72, 202, 228, 0.3), inset 0 -5px 10px rgba(0, 0, 0, 0.1)' : 
    '0 2px 5px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  transform: ${props => props.filled ? 
    'translateY(0) rotateX(0) scale(1)' : 
    'translateY(5px) rotateX(20deg) scale(0.95)'};
  opacity: ${props => props.filled ? 1 : 0.6};
  cursor: pointer;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: ${props => props.filled ? 1 : 0};
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: ${props => props.filled ? 
      'translateY(-5px) rotateX(-5deg) scale(1.05)' : 
      'translateY(0) rotateX(10deg) scale(1)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .dark-mode & {
    background: ${props => props.filled ? 
      'linear-gradient(135deg, #48CAE4, #0891b2)' : 
      'rgba(30, 41, 59, 0.5)'};
  }
`;

// Wave animation at the bottom
const WaveAnimation = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%2348CAE4'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%2348CAE4'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%2348CAE4'%3E%3C/path%3E%3C/svg%3E");
  background-size: 1200px 100%;
  animation: wave 15s linear infinite;
  transform-origin: bottom;
  opacity: 0.5;
  
  @keyframes wave {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;

// Counter controls with better visual feedback
const CounterControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const CounterButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.increment ? '#0891b2' : 'rgba(226, 232, 240, 0.9)'};
  color: ${props => props.increment ? 'white' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: ${props => props.increment ? 
    '0 3px 8px rgba(72, 202, 228, 0.3)' : 
    '0 2px 5px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.increment ? 
      '0 5px 15px rgba(72, 202, 228, 0.4)' : 
      '0 4px 10px rgba(0, 0, 0, 0.15)'};
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .dark-mode & {
    background-color: ${props => props.increment ? '#0891b2' : 'rgba(30, 41, 59, 0.8)'};
  }
`;

const CounterValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  min-width: 40px;
  text-align: center;
  position: relative;
  
  &::after {
    content: 'glasses';
    display: block;
    font-size: 0.7rem;
    font-weight: 500;
    color: #64748b;
    text-align: center;
    margin-top: -5px;
  }
  
  .dark-mode & {
    color: #67e8f9;
    
    &::after {
      color: #94a3b8;
    }
  }
`;

// Completion indicator with animation
const CompletionBar = styled.div`
  height: 6px;
  background-color: rgba(226, 232, 240, 0.5);
  border-radius: var(--border-radius-pill);
  margin-top: 1rem;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.value / props.total) * 100}%;
    background: linear-gradient(90deg, #48CAE4, #0891b2);
    border-radius: var(--border-radius-pill);
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .dark-mode & {
    background-color: rgba(30, 41, 59, 0.5);
  }
`;

const CompletionText = styled.div`
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  
  span {
    color: #0891b2;
    font-weight: 600;
  }
  
  .dark-mode & {
    color: #94a3b8;
    
    span {
      color: #67e8f9;
    }
  }
`;

// Interactive water animation on fill
const WaterFillAnimation = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${props => props.percent}%;
  background: linear-gradient(to bottom, rgba(72, 202, 228, 0.3), rgba(72, 202, 228, 0.6));
  border-radius: inherit;
  transition: height 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: -1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: rgba(255, 255, 255, 0.3);
    filter: blur(5px);
  }
`;

const HydrationTracker = ({ task }) => {
  const { dispatch } = useAppContext();
  const [glasses, setGlasses] = useState(task.count);
  const [dropFillAnimation, setDropFillAnimation] = useState(null);
  
  const MAX_GLASSES = task.target;
  
  const handleIncrement = () => {
    if (glasses < MAX_GLASSES) {
      setDropFillAnimation(glasses);
      setGlasses(prev => prev + 1);
      
      // If we've hit the target, mark the task as completed
      if (glasses + 1 >= task.target) {
        dispatch({
          type: 'TOGGLE_TASK',
          payload: { taskId: task.id }
        });
      }
      
      // Create a water splash sound effect
      setTimeout(() => setDropFillAnimation(null), 500);
    }
  };
  
  const handleDecrement = () => {
    if (glasses > 0) {
      setGlasses(prev => prev - 1);
      
      // If we've gone below the target and the task was completed, mark it incomplete
      if (glasses - 1 < task.target && task.completed) {
        dispatch({
          type: 'TOGGLE_TASK',
          payload: { taskId: task.id }
        });
      }
    }
  };
  
  const toggleDrop = (index) => {
    if (index < glasses) {
      // If already filled, unfill it
      setGlasses(index);
    } else {
      // Fill this drop and all before it
      setDropFillAnimation(index);
      setGlasses(index + 1);
      setTimeout(() => setDropFillAnimation(null), 500);
    }
  };
  
  return (
    <TrackerContainer>
      <TrackerHeader>
        <TrackerIcon>
          <FaWater />
        </TrackerIcon>
        <TrackerTitle>Water Intake Tracker</TrackerTitle>
      </TrackerHeader>
      
      <DropsContainer>
        {[...Array(MAX_GLASSES)].map((_, index) => (
          <WaterDrop 
            key={index} 
            filled={index < glasses}
            onClick={() => toggleDrop(index)}
            className={dropFillAnimation === index ? 'sparkle' : ''}
          >
            {dropFillAnimation === index && (
              <WaterFillAnimation percent={100} />
            )}
          </WaterDrop>
        ))}
      </DropsContainer>
      
      <CounterControls>
        <CounterButton 
          onClick={handleDecrement} 
          disabled={glasses === 0}
        >
          <FaMinus />
        </CounterButton>
        
        <CounterValue>{glasses}</CounterValue>
        
        <CounterButton 
          onClick={handleIncrement} 
          disabled={glasses === MAX_GLASSES}
          increment
        >
          <FaPlus />
        </CounterButton>
      </CounterControls>
      
      <CompletionBar value={glasses} total={MAX_GLASSES} />
      <CompletionText>
        <span>{glasses}</span> of {MAX_GLASSES} glasses consumed
      </CompletionText>
      
      <WaveAnimation />
    </TrackerContainer>
  );
};

export default HydrationTracker; 