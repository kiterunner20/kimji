import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaBell, 
  FaPlus, 
  FaCheck, 
  FaRegClock, 
  FaTrophy, 
  FaChevronDown, 
  FaChevronUp,
  FaGraduationCap,
  FaHeartbeat,
  FaBrain,
  FaRunning, 
  FaUsers,
  FaComments,
  FaMoneyBillWave,
  FaPrayingHands,
  FaCalendarAlt, 
  FaLightbulb,
  FaInfoCircle,
  FaGift
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import DaySelector from '../components/DaySelector';
import TaskManager from '../components/TaskManager';

const HomeContainer = styled.div`
  padding: 0.75rem 1rem;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 1.25rem;
  background: linear-gradient(to bottom, 
    var(--gray-50) 0%, 
    rgba(255,255,255,0) 100%
  );
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  
  .dark-mode & {
    background: linear-gradient(to bottom, 
      rgba(55, 65, 81, 0.3) 0%, 
      rgba(17, 24, 39, 0) 100%
    );
  }
`;

const Greeting = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const DayTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Subheading = styled.p`
  color: var(--gray-600);
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--gray-200);
  border-radius: 4px;
  margin: 1.5rem 0;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => {
    if (props.percent >= 80) return 'var(--success)';
    if (props.percent >= 40) return 'var(--warning)';
    return 'var(--primary)';
  }};
  transition: width 0.3s ease;
`;

const TasksSection = styled.div`
  margin-top: 1rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.85) 100%);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  overflow: hidden;
  width: 100%;
  padding-bottom: 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 40%, rgba(99, 102, 241, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05) 0%, transparent 40%);
    z-index: 0;
    border-radius: var(--border-radius-lg);
  }
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.85) 100%);
    
    &::before {
      background-image: 
        radial-gradient(circle at 20% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.08) 0%, transparent 40%);
    }
  }
`;

const QuoteCard = styled.div`
  background-color: var(--primary-light);
  background-image: radial-gradient(
    circle at 10% 20%,
    var(--primary-light) 0%,
    var(--primary-lighter) 90%
  );
  border-radius: var(--border-radius);
  padding: 1.5rem;
  text-align: center;
  margin: 1rem auto;
  position: relative;
  box-shadow: var(--shadow-1);
  max-width: 1200px;
  width: 100%;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--primary-dark);
    background-image: radial-gradient(
      circle at 10% 20%,
      var(--primary-dark) 0%,
      var(--primary-darker) 90%
    );
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Quote = styled.p`
  font-size: 1.1rem;
  font-style: italic;
  margin: 0 0 0.5rem;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const Author = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: var(--primary);
`;

const MilestoneCard = styled.div`
  background-color: white;
  background-image: radial-gradient(
    circle at 90% 10%,
    var(--warning-lighter) 0%,
    white 70%
  );
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-1);
  max-width: 1200px;
  width: 100%;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
    background-image: radial-gradient(
      circle at 90% 10%,
      var(--warning-darker) 0%,
      var(--gray-800) 70%
    );
  }
`;

const MilestoneIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--warning-light);
  color: var(--warning);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--warning-dark);
  }
`;

const MilestoneContent = styled.div`
  flex: 1;
`;

const MilestoneTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const MilestoneDescription = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
    color: var(--gray-400);
  }
`;

const Reminder = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem auto;
  padding: 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  max-width: 500px;
  box-shadow: var(--box-shadow);
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const ReminderIcon = styled.div`
  color: var(--primary);
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const ReminderText = styled.div`
  flex: 1;
  
  p {
    color: var(--gray-700);
    margin: 0;
    
    @media (prefers-color-scheme: dark) {
      color: var(--gray-300);
    }
  }
  
  small {
    color: var(--gray-500);
    display: block;
    margin-top: 0.25rem;
  }
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1rem;
  box-shadow: var(--box-shadow);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.color || 'var(--primary)'};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const AddTaskForm = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin: 2rem 0;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const FormTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: var(--gray-900);
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-700);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-200);
    border-color: var(--gray-600);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-200);
    border-color: var(--gray-600);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M8 11l-6-6h12l-6 6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-200);
    border-color: var(--gray-600);
  }
`;

const PointsRange = styled.div`
  display: flex;
  align-items: center;
`;

const RangeInput = styled.input`
  flex: 1;
  margin-right: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const PointsValue = styled.div`
  min-width: 40px;
  font-weight: 600;
  color: var(--primary);
`;

const AddButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: var(--transition);
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--secondary);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleFormButton = styled.button`
  background: none;
  border: 2px dashed var(--gray-300);
  border-radius: var(--border-radius);
  width: 100%;
  padding: 1rem;
  color: var(--gray-600);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  margin-top: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background-color: rgba(59, 130, 246, 0.05);
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: var(--gray-600);
    color: var(--gray-400);
    
    &:hover {
      border-color: var(--primary);
      color: var(--primary);
      background-color: rgba(59, 130, 246, 0.1);
    }
  }
`;

const CategorySection = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1.5rem;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background: var(--gray-800);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${props => {
    switch(props.category) {
      case 'personal_growth': return 'rgba(79, 70, 229, 0.1)';
      case 'emotional_health': return 'rgba(236, 72, 153, 0.1)';
      case 'mental_fitness': return 'rgba(16, 185, 129, 0.1)';
      case 'physical_health': return 'rgba(239, 68, 68, 0.1)';
      case 'relationships': return 'rgba(245, 158, 11, 0.1)';
      case 'social': return 'rgba(59, 130, 246, 0.1)';
      case 'financial': return 'rgba(139, 92, 246, 0.1)';
      case 'mindfulness': return 'rgba(91, 33, 182, 0.1)';
      default: return 'var(--gray-100)';
    }
  }};
  border-bottom: ${props => props.isOpen ? '1px solid var(--gray-200)' : 'none'};
  cursor: pointer;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => {
      switch(props.category) {
        case 'personal_growth': return 'rgba(79, 70, 229, 0.2)';
        case 'emotional_health': return 'rgba(236, 72, 153, 0.2)';
        case 'mental_fitness': return 'rgba(16, 185, 129, 0.2)';
        case 'physical_health': return 'rgba(239, 68, 68, 0.2)';
        case 'relationships': return 'rgba(245, 158, 11, 0.2)';
        case 'social': return 'rgba(59, 130, 246, 0.2)';
        case 'financial': return 'rgba(139, 92, 246, 0.2)';
        case 'mindfulness': return 'rgba(91, 33, 182, 0.2)';
        default: return 'var(--gray-700)';
      }
    }};
    border-bottom-color: var(--gray-700);
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => {
    switch(props.category) {
      case 'personal_growth': return '#4F46E5';
      case 'emotional_health': return '#EC4899';
      case 'mental_fitness': return '#10B981';
      case 'physical_health': return '#EF4444';
      case 'relationships': return '#F59E0B';
      case 'social': return '#3B82F6';
      case 'financial': return '#8B5CF6';
      case 'mindfulness': return '#5B21B6';
      default: return 'var(--gray-400)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  color: var(--gray-800);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const CategoryProgress = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-top: 0.25rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const CategoryBadge = styled.span`
  background-color: ${props => {
    if (props.completed) return 'var(--success)';
    return 'var(--gray-200)';
  }};
  color: ${props => props.completed ? 'white' : 'var(--gray-600)'};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
  font-weight: 600;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => {
      if (props.completed) return 'var(--success)';
      return 'var(--gray-700)';
    }};
    color: ${props => props.completed ? 'white' : 'var(--gray-400)'};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  font-size: 1.1rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
    
    &:hover {
      color: var(--primary-light);
    }
  }
`;

const CategoryContent = styled.div`
  padding: ${props => props.isOpen ? '1rem' : '0'};
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  overflow: hidden;
`;

const CategoryProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: var(--gray-200);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const CategoryProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => {
    switch(props.category) {
      case 'personal_growth': return '#4F46E5';
      case 'emotional_health': return '#EC4899';
      case 'mental_fitness': return '#10B981';
      case 'physical_health': return '#EF4444';
      case 'relationships': return '#F59E0B';
      case 'social': return '#3B82F6';
      case 'financial': return '#8B5CF6';
      case 'mindfulness': return '#5B21B6';
      default: return 'var(--primary)';
    }
  }};
  transition: width 0.3s ease;
`;

// Add these new styled components for the simplified task list
const TaskListContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin: 2rem 0;
  padding: ${props => props.isExpanded ? '1.5rem' : '1.5rem 1.5rem 0.5rem 1.5rem'};
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const TaskListTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: ${props => props.isExpanded ? '1rem' : '0'};
  color: var(--gray-900);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${props => props.isExpanded ? '1px solid var(--gray-200)' : 'none'};
  padding-bottom: ${props => props.isExpanded ? '0.5rem' : '0'};
  
  .title-content {
    display: flex;
    align-items: center;
  }
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
    border-bottom-color: ${props => props.isExpanded ? 'var(--gray-700)' : 'none'};
  }
`;

const TaskListContent = styled.div`
  max-height: ${props => props.isExpanded ? '2000px' : '0'};
  opacity: ${props => props.isExpanded ? '1' : '0'};
  transition: all 0.3s ease;
  overflow: hidden;
  padding: ${props => props.isExpanded ? '1rem 0' : '0'};
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--gray-200);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: var(--gray-700);
  }
`;

const TaskCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${props => props.completed ? 'var(--success)' : 'var(--gray-400)'};
  background-color: ${props => props.completed ? 'var(--success)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    border-color: var(--primary);
    transform: scale(1.05);
  }
`;

const TaskDetails = styled.div`
  flex: 1;
`;

const TaskName = styled.div`
  font-weight: 500;
  color: var(--gray-900);
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const TaskTag = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-right: 0.5rem;
  background-color: ${props => {
    switch(props.category) {
      case 'personal_growth': return 'rgba(79, 70, 229, 0.15)';
      case 'emotional_health': return 'rgba(236, 72, 153, 0.15)';
      case 'mental_fitness': return 'rgba(16, 185, 129, 0.15)';
      case 'physical_health': return 'rgba(239, 68, 68, 0.15)';
      case 'relationships': return 'rgba(245, 158, 11, 0.15)';
      case 'social': return 'rgba(59, 130, 246, 0.15)';
      case 'financial': return 'rgba(139, 92, 246, 0.15)';
      case 'mindfulness': return 'rgba(91, 33, 182, 0.15)';
      default: return 'var(--gray-200)';
    }
  }};
  color: ${props => {
    switch(props.category) {
      case 'personal_growth': return '#4F46E5';
      case 'emotional_health': return '#EC4899';
      case 'mental_fitness': return '#10B981';
      case 'physical_health': return '#EF4444';
      case 'relationships': return '#F59E0B';
      case 'social': return '#3B82F6';
      case 'financial': return '#8B5CF6';
      case 'mindfulness': return '#5B21B6';
      default: return 'var(--gray-700)';
    }
  }};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => {
      switch(props.category) {
        case 'personal_growth': return 'rgba(79, 70, 229, 0.25)';
        case 'emotional_health': return 'rgba(236, 72, 153, 0.25)';
        case 'mental_fitness': return 'rgba(16, 185, 129, 0.25)';
        case 'physical_health': return 'rgba(239, 68, 68, 0.25)';
        case 'relationships': return 'rgba(245, 158, 11, 0.25)';
        case 'social': return 'rgba(59, 130, 246, 0.25)';
        case 'financial': return 'rgba(139, 92, 246, 0.25)';
        case 'mindfulness': return 'rgba(91, 33, 182, 0.25)';
        default: return 'var(--gray-700)';
      }
    }};
  }
`;

const TaskCategoryLabel = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  background-color: ${props => {
    switch (props.category) {
      case 'morning': return '#E0F2FE'; // Light blue
      case 'afternoon': return '#FEF9C3'; // Light yellow
      case 'evening': return '#E0E7FF'; // Light indigo
      case 'all-day': return '#F3E8FF'; // Light purple
      default: return 'var(--gray-200)';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'morning': return '#0369A1'; // Darker blue
      case 'afternoon': return '#A16207'; // Darker yellow
      case 'evening': return '#4338CA'; // Darker indigo
      case 'all-day': return '#7E22CE'; // Darker purple
      default: return 'var(--gray-700)';
    }
  }};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => {
      switch (props.category) {
        case 'morning': return '#0C4A6E'; // Darker blue
        case 'afternoon': return '#713F12'; // Darker yellow
        case 'evening': return '#312E81'; // Darker indigo
        case 'all-day': return '#581C87'; // Darker purple
        default: return 'var(--gray-700)';
      }
    }};
    color: ${props => {
      switch (props.category) {
        case 'morning': return '#BAE6FD'; // Lighter blue
        case 'afternoon': return '#FEF08A'; // Lighter yellow
        case 'evening': return '#C7D2FE'; // Lighter indigo
        case 'all-day': return '#E9D5FF'; // Lighter purple
        default: return 'var(--gray-300)';
      }
    }};
  }
`;

const TaskPoints = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-right: 0.5rem;
  background-color: #ECFDF5; // Light green
  color: #047857; // Darker green
  display: flex;
  align-items: center;
  
  @media (prefers-color-scheme: dark) {
    background-color: #064E3B; // Darker green
    color: #A7F3D0; // Lighter green
  }
  
  svg {
    margin-right: 3px;
    font-size: 0.6rem;
  }
`;

// Helper to get category icon
const getCategoryIcon = (category) => {
  switch(category) {
    case 'personal_growth': return <FaGraduationCap />;
    case 'emotional_health': return <FaHeartbeat />;
    case 'mental_fitness': return <FaBrain />;
    case 'physical_health': return <FaRunning />;
    case 'relationships': return <FaUsers />;
    case 'social': return <FaComments />;
    case 'financial': return <FaMoneyBillWave />;
    case 'mindfulness': return <FaPrayingHands />;
    default: return <FaCheck />;
  }
};

// Helper to get category display name
const getCategoryDisplayName = (category) => {
  switch(category) {
    case 'personal_growth': return 'Personal Growth';
    case 'emotional_health': return 'Emotional Health';
    case 'mental_fitness': return 'Mental Fitness';
    case 'physical_health': return 'Physical Health';
    case 'relationships': return 'Relationships';
    case 'social': return 'Social & Communication';
    case 'financial': return 'Financial Wellness';
    case 'mindfulness': return 'Mindfulness';
    default: return 'Other Tasks';
  }
};

// Add this new component to the bottom of the styled components section
const EmptyStateWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  margin: 1rem 0;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-1);
  border: 1px dashed var(--gray-300);
  
  svg {
    font-size: 2.5rem;
    color: var(--gray-400);
    margin-bottom: 1rem;
  }
  
  h3 {
    margin: 0 0 0.5rem;
    color: var(--gray-700);
  }
  
  p {
    color: var(--gray-500);
    margin: 0 0 1rem;
  }
  
  button {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
    border-color: var(--gray-700);
    
    h3 {
      color: var(--gray-200);
    }
    
    p {
      color: var(--gray-400);
    }
  }
`;

const Home = () => {
  const { 
    currentDay, 
    weekPlan, 
    profile, 
    calculateDayScore, 
    taskCategories,
    getTasksByCategory,
    dispatch
  } = useAppContext();
  
  const [dayScore, setDayScore] = useState({ score: 0, total: 0, percentage: 0 });
  // Track the selected day
  const [selectedDay, setSelectedDay] = useState(currentDay || 1);
  
  // Handler for day selection
  const handleDaySelect = (day) => {
    console.log("Home: handleDaySelect called with day", day);
    
    // First update our local state
    setSelectedDay(day);
    
    // Then update the global context
    dispatch({ type: 'SET_DAY', payload: day });
  };
  
  // Log important state for debugging
  useEffect(() => {
    console.log("======== Home Component Debug ========");
    console.log("Home: currentDay from context =", currentDay);
    console.log("Home: selectedDay state =", selectedDay);
    
    // Only update selectedDay from context when component initially mounts
    // This prevents the circular dependency when DaySelector updates currentDay
    if (currentDay !== undefined && currentDay !== selectedDay) {
      const isInitialLoad = !selectedDay; // Only sync on initial load
      console.log("Home: Update from currentDay?", isInitialLoad);
      
      if (isInitialLoad) {
        console.log("Home: Updating selectedDay to match currentDay on initial load:", currentDay);
        setSelectedDay(currentDay);
      } else {
        console.log("Home: Maintaining selectedDay from user selection:", selectedDay);
      }
    } else {
      console.log("Home: No need to update selectedDay, currentDay =", currentDay, "selectedDay =", selectedDay);
    }
    
    // Display weekPlan information
    if (weekPlan && Array.isArray(weekPlan)) {
      console.log("Home: weekPlan exists with", weekPlan.length, "days");
      
      // Check if we can find both days in weekPlan
      const currentDayPlan = weekPlan.find(d => d?.day === currentDay);
      const selectedDayPlan = weekPlan.find(d => d?.day === selectedDay);
      
      console.log("Home: currentDay plan found?", !!currentDayPlan, currentDayPlan ? `(title: ${currentDayPlan.title})` : "");
      console.log("Home: selectedDay plan found?", !!selectedDayPlan, selectedDayPlan ? `(title: ${selectedDayPlan.title})` : "");
    } else {
      console.log("Home: weekPlan is null or undefined");
    }
    console.log("======================================");
  }, [currentDay, weekPlan, selectedDay]);
  
  // Get the current day plan
  const dayPlan = weekPlan?.find(d => d?.day === selectedDay) || null;
  
  // Log the found dayPlan
  useEffect(() => {
    console.log("Current dayPlan:", dayPlan);
    if (dayPlan) {
      console.log("Tasks in dayPlan:", dayPlan.tasks?.length || 0);
    } else {
      console.log("No dayPlan found for day", selectedDay);
    }
  }, [dayPlan, selectedDay]);
  
  // Calculate the score whenever currentDay or weekPlan changes
  useEffect(() => {
    if (dayPlan && typeof calculateDayScore === 'function') {
      const score = calculateDayScore(dayPlan);
      setDayScore(score);
    } else {
      // Set default score if dayPlan is not available
      setDayScore({ score: 0, total: 0, percentage: 0 });
    }
  }, [selectedDay, weekPlan, calculateDayScore, dayPlan]);
  
  // Get motivational quote based on the current day
  const getQuote = () => {
    const quotes = [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Andrew Murphy" },
      { text: "The difference between try and triumph is just a little umph!", author: "Marvin Phillips" },
      { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
      { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
      { text: "Small daily improvements are the key to staggering long-term results.", author: "Anonymous" },
      { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
      { text: "When you feel like quitting, think about why you started.", author: "Anonymous" },
      { text: "Don't limit your challenges. Challenge your limits.", author: "Anonymous" },
      { text: "If it doesn't challenge you, it doesn't change you.", author: "Fred DeVito" },
      { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Anonymous" },
      { text: "Your body hears everything your mind says.", author: "Naomi Judd" },
      { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
      { text: "Once you learn to quit, it becomes a habit.", author: "Vince Lombardi" },
      { text: "Celebrate your small wins. They all add up to the big ones.", author: "Anonymous" }
    ];
    
    // Use the current day as an index, rotating through the quotes
    return quotes[(selectedDay - 1) % quotes.length];
  };
  
  // Get the milestone message for specific days
  const getMilestone = () => {
    if (selectedDay === 7) {
      return {
        title: "Week 1 Complete!",
        description: "Congratulations on completing the first week! You've laid a solid foundation for your transformation.",
        icon: <FaTrophy />
      };
    } else if (selectedDay === 14) {
      return {
        title: "Week 2 Complete!",
        description: "You're two-thirds of the way through! Your dedication is creating lasting change.",
        icon: <FaTrophy />
      };
    } else if (selectedDay === 21) {
      return {
        title: "21-Day Challenge Complete!",
        description: "Incredible! You've completed the full 21-day transformation journey. Take time to reflect on how far you've come.",
        icon: <FaGift />
      };
    }
    
    return null;
  };
  
  // Get week number (1, 2, or 3)
  const getCurrentWeek = () => {
    return Math.ceil(selectedDay / 7);
  };
  
  // Get week theme
  const getWeekTheme = () => {
    const week = getCurrentWeek();
    if (week === 1) return "Foundation";
    if (week === 2) return "Expansion";
    if (week === 3) return "Mastery";
    return "";
  };
  
  const quote = getQuote();
  const milestone = getMilestone();
  const weekTheme = getWeekTheme();
  
  // Add this new function
  const renderEmptyState = () => {
    if (dayPlan && dayPlan.tasks && dayPlan.tasks.length > 0) {
      return null;
    }
    
    return (
      <EmptyStateWrapper>
        <FaCalendarAlt />
        <h3>No Tasks for Day {selectedDay}</h3>
        <p>There are no tasks planned for today. You can add custom tasks or select a different day.</p>
      </EmptyStateWrapper>
    );
  };
  
  return (
    <HomeContainer>
      <WelcomeSection>
        <Greeting>
          {profile.name ? `Hello, ${profile.name}!` : 'Welcome to your transformation!'}
        </Greeting>
        <DayTitle>
          <FaCalendarAlt /> Day {selectedDay}: {dayPlan?.title || ''}
        </DayTitle>
        <Subheading>
          Week {getCurrentWeek()}: {weekTheme} - Build consistent habits in 21 days.
        </Subheading>
        
        <DaySelector onDaySelect={handleDaySelect} />
        
        <ProgressBar>
          <ProgressFill percent={dayScore.percentage} />
        </ProgressBar>
        <Subheading>
          Today's Progress: {dayScore.score}/{dayScore.total} points ({dayScore.percentage}% complete)
        </Subheading>
      </WelcomeSection>
      
      {milestone && (
        <MilestoneCard>
          <MilestoneIcon>
            {milestone.icon}
          </MilestoneIcon>
          <MilestoneContent>
            <MilestoneTitle>{milestone.title}</MilestoneTitle>
            <MilestoneDescription>{milestone.description}</MilestoneDescription>
          </MilestoneContent>
        </MilestoneCard>
      )}
      
      <QuoteCard>
        <QuoteIcon>
          <FaLightbulb />
        </QuoteIcon>
        <Quote>"{quote.text}"</Quote>
        <Author>— {quote.author}</Author>
      </QuoteCard>
      
      <TasksSection>
        <TaskManager selectedDay={selectedDay} />
      </TasksSection>
      
      {renderEmptyState()}
    </HomeContainer>
  );
};

export default Home; 