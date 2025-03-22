import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  FaPlus, 
  FaTrash, 
  FaPencilAlt, 
  FaBell, 
  FaCheck, 
  FaLightbulb,
  FaGraduationCap,
  FaHeartbeat,
  FaBrain,
  FaUsers,
  FaMoneyBillWave,
  FaPrayingHands,
  FaTimesCircle,
  FaBellSlash,
  FaChevronRight,
  FaClock,
  FaBook,
  FaDumbbell,
  FaGlassCheers,
  FaEllipsisV,
  FaListUl,
  FaRegStickyNote,
  FaLink,
  FaStar,
  FaSmile,
  FaInfoCircle
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import CategoryTaskList from './CategoryTaskList';

const TaskManagerContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  font-family: 'Poppins', 'Montserrat', sans-serif;
  letter-spacing: -0.5px;
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary);
    font-size: 1.5rem;
  }
  
  .dark-mode & {
    color: var(--gray-100);
  }
`;

const TaskFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0 24px;
  padding: 4px 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--gray-300);
    border-radius: 3px;
  }
  
  .dark-mode &::-webkit-scrollbar-thumb {
    background-color: var(--gray-600);
  }

  @media (max-width: 768px) {
    padding-bottom: 8px;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--light)'};
  color: ${props => props.active ? 'white' : 'var(--gray-700)'};
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(124, 58, 237, 0.2)' : 'none'};
  
  svg {
    margin-right: 10px;
    font-size: 1.1rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'rgba(0,0,0,0.05)'};
    transform: translateY(-2px);
  }
  
  .dark-mode & {
    background-color: ${props => props.active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
    color: ${props => props.active ? 'white' : 'var(--gray-300)'};
  }
`;

const TaskList = styled.div`
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  margin-bottom: 0;
  overflow: hidden;
  box-shadow: var(--shadow-2);
  transition: all 0.3s ease;
  position: relative;
  border-left: 5px solid ${props => 
    props.category === 'personal_growth' ? 'var(--indigo)' :
    props.category === 'emotional_health' ? 'var(--pink)' :
    props.category === 'mental_fitness' ? 'var(--purple)' :
    props.category === 'physical_health' ? 'var(--emerald)' :
    props.category === 'relationships' ? 'var(--blue)' :
    props.category === 'social' ? 'var(--secondary)' :
    props.category === 'financial' ? 'var(--amber)' :
    props.category === 'mindfulness' ? 'var(--primary)' :
    'var(--gray-300)'
  };
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: ${props => {
      const baseColor = 
        props.category === 'personal_growth' ? 'rgba(99, 102, 241, 0.08)' :
        props.category === 'emotional_health' ? 'rgba(236, 72, 153, 0.08)' :
        props.category === 'mental_fitness' ? 'rgba(139, 92, 246, 0.08)' :
        props.category === 'physical_health' ? 'rgba(16, 185, 129, 0.08)' :
        props.category === 'relationships' ? 'rgba(59, 130, 246, 0.08)' :
        props.category === 'social' ? 'rgba(14, 165, 233, 0.08)' :
        props.category === 'financial' ? 'rgba(245, 158, 11, 0.08)' :
        props.category === 'mindfulness' ? 'rgba(124, 58, 237, 0.08)' :
        'rgba(107, 114, 128, 0.08)';
      return `linear-gradient(to bottom, ${baseColor}, transparent)`;
    }};
    pointer-events: none;
    z-index: 0;
  }
  
  .dark-mode & {
    background-color: var(--gray-800);
    border-left-color: ${props => 
      props.category === 'personal_growth' ? 'var(--indigo)' :
      props.category === 'emotional_health' ? 'var(--pink)' :
      props.category === 'mental_fitness' ? 'var(--purple)' :
      props.category === 'physical_health' ? 'var(--emerald)' :
      props.category === 'relationships' ? 'var(--blue)' :
      props.category === 'social' ? 'var(--secondary)' :
      props.category === 'financial' ? 'var(--amber)' :
      props.category === 'mindfulness' ? 'var(--primary)' :
      'var(--gray-600)'
    };
    
    &::before {
      background: ${props => {
        const baseColor = 
          props.category === 'personal_growth' ? 'rgba(99, 102, 241, 0.12)' :
          props.category === 'emotional_health' ? 'rgba(236, 72, 153, 0.12)' :
          props.category === 'mental_fitness' ? 'rgba(139, 92, 246, 0.12)' :
          props.category === 'physical_health' ? 'rgba(16, 185, 129, 0.12)' :
          props.category === 'relationships' ? 'rgba(59, 130, 246, 0.12)' :
          props.category === 'social' ? 'rgba(14, 165, 233, 0.12)' :
          props.category === 'financial' ? 'rgba(245, 158, 11, 0.12)' :
          props.category === 'mindfulness' ? 'rgba(124, 58, 237, 0.12)' :
          'rgba(107, 114, 128, 0.12)';
        return `linear-gradient(to bottom, ${baseColor}, transparent)`;
      }};
    }
  }
`;

const TaskContent = styled.div`
  padding: 20px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .task-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: ${props => props.hasDescription ? '12px' : '8px'};
  }
`;

const TaskTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  flex: 1;
  color: ${props => props.completed ? 'var(--gray-500)' : 'var(--gray-900)'};
  
  h4 {
    margin: 0;
    font-size: 1.05rem;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    color: ${props => props.completed ? 'var(--gray-500)' : 'var(--gray-900)'};
    word-break: break-word;
    cursor: pointer;
  }
  
  .dark-mode & {
    color: ${props => props.completed ? 'var(--gray-500)' : 'var(--gray-100)'};
    
    h4 {
      color: ${props => props.completed ? 'var(--gray-500)' : 'var(--gray-100)'};
    }
  }
`;

const TaskDescription = styled.div`
  font-size: 0.95rem;
  color: ${props => props.completed ? 'var(--gray-500)' : 'var(--gray-700)'};
  margin-top: ${props => props.completed ? 0 : '4px'};
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
  
  .dark-mode & {
    color: ${props => props.completed ? 'var(--gray-600)' : 'var(--gray-400)'};
  }
`;

const TaskCheckbox = styled.div`
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 13px;
  border: 2px solid ${props => props.completed ? 'var(--success)' : 'var(--gray-400)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  cursor: pointer;
  background-color: ${props => props.completed ? 'var(--success)' : 'transparent'};
  color: white;
  transition: all 0.2s ease;
  margin-top: 2px;
  
  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-100)'};
  }
  
  svg {
    font-size: 14px;
  }
  
  .dark-mode & {
    border-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-500)'};
    
    &:hover {
      background-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-700)'};
    }
  }
`;

const TaskProgress = styled.div`
  margin-top: auto;
  padding-top: 12px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
  
  .dark-mode & {
    background-color: var(--gray-700);
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.completed ? '100%' : '0%'};
  background-color: var(--success);
  transition: width 0.3s ease;
`;

const TaskStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--gray-600);
  
  .dark-mode & {
    color: var(--gray-400);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 14px 16px;
  padding-bottom: ${props => props.isExpanded ? '14px' : '14px'};
  border-bottom: ${props => props.isExpanded ? '1px solid var(--gray-200)' : 'none'};
  background: ${props => props.isExpanded ? 'rgba(240,240,250,0.5)' : 'transparent'};
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    
    & > div:last-child {
      margin-top: 8px;
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .dark-mode & {
    border-bottom-color: var(--gray-700);
    background: ${props => props.isExpanded ? 'rgba(30,30,40,0.5)' : 'transparent'};
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch(props.category) {
      case 'personal_growth': return 'linear-gradient(45deg, #6366F1, #8B5CF6)';
      case 'emotional_health': return 'linear-gradient(45deg, #EC4899, #F472B6)';
      case 'mental_fitness': return 'linear-gradient(45deg, #10B981, #34D399)';
      case 'physical_health': return 'linear-gradient(45deg, #EF4444, #F87171)';
      case 'relationships': return 'linear-gradient(45deg, #F59E0B, #FBBF24)';
      default: return 'linear-gradient(45deg, var(--gray-500), var(--gray-400))';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 1rem;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryTasks = styled.div`
  margin-top: ${props => props.isExpanded ? '12px' : '0'};
  padding: ${props => props.isExpanded ? '0 16px 16px' : '0'};
  height: ${props => props.isExpanded ? 'auto' : '0'};
  overflow: hidden;
  opacity: ${props => props.isExpanded ? '1' : '0'};
  transition: all 0.3s ease;
`;

const ToggleIcon = styled.div`
  color: var(--gray-500);
  transition: transform 0.3s ease;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0)'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  
  .dark-mode & {
    color: var(--gray-400);
  }
`;

const TaskItemCard = styled.div`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: ${props => props.completed ? 'var(--gray-50)' : 'white'};
  border: 1px solid var(--gray-200);
  position: relative;
  box-shadow: ${props => props.completed ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${props => {
      if (props.completed) return 'var(--success)';
      return 'var(--primary)';
    }};
    opacity: ${props => props.completed ? 0.5 : 0.7};
  }
  
  .dark-mode & {
    background-color: ${props => props.completed ? 'var(--gray-700)' : 'var(--gray-800)'};
    border-color: var(--gray-700);
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-top: 4px;
  
  svg {
    margin-right: 4px;
    font-size: 0.8rem;
  }
  
  .dark-mode & {
    color: var(--gray-400);
  }
`;

const ProgressDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  font-size: 0.875rem;
  color: var(--gray-600);
  
  @media (max-width: 480px) {
    margin-right: 0;
    flex: 1;
  }
`;

const CircularProgress = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
`;

const ProgressText = styled.span`
  position: relative;
  z-index: 2;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => {
    if (props.percentage === 0) return 'var(--gray-500)';
    if (props.percentage === 100) return 'var(--success)';
    if (props.percentage < 25) return 'var(--error)';
    if (props.percentage < 50) return 'var(--warning)';
    if (props.percentage < 75) return 'var(--amber)';
    return 'var(--primary)';
  }};
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: ${props => props.active ? 'var(--primary)' : 'var(--gray-500)'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--gray-100);
    color: ${props => {
      if (props.intent === 'delete') return 'var(--error)';
      if (props.intent === 'edit') return 'var(--warning)';
      if (props.intent === 'add') return 'var(--success)';
      return 'var(--primary)';
    }};
  }
`;

const TaskMenuButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: var(--gray-500);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--gray-100);
    color: var(--gray-700);
  }
`;

const TaskMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 4px 0;
  z-index: 100;
  min-width: 150px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: all 0.2s ease;
`;

const TaskMenuItem = styled.div`
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--gray-100);
    color: ${props => {
      if (props.intent === 'delete') return 'var(--error)';
      if (props.intent === 'edit') return 'var(--warning)';
      if (props.intent === 'add') return 'var(--success)';
      return 'var(--primary)';
    }};
  }
`;

const TaskDetailsContent = styled.div`
  height: ${props => props.expanded ? 'auto' : '0'};
  opacity: ${props => props.expanded ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${props => props.expanded ? '12px' : '0'};
  padding-top: ${props => props.expanded ? '8px' : '0'};
  border-top: ${props => props.expanded ? '1px solid var(--gray-200)' : 'none'};
`;

const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px auto 10px;
  box-shadow: 0 6px 15px rgba(124, 58, 237, 0.2);
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
  }
  
  svg {
    margin-right: 10px;
    font-size: 1.1rem;
  }
  
  .dark-mode & {
    box-shadow: 0 6px 15px rgba(124, 58, 237, 0.3);
    
    &:hover {
      box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
    }
  }
`;

const NoTasksMessage = styled.div`
  padding: 2rem;
  text-align: center;
  margin: 1.5rem 0;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  color: var(--gray-600);
  font-size: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary);
    opacity: 0.7;
  }
  
  p {
    font-weight: 500;
    margin: 0;
    line-height: 1.5;
  }
  
  .dark-mode & {
    background-color: rgba(30, 41, 59, 0.8);
    color: var(--gray-300);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const TaskForm = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  max-height: 90vh;
  overflow-y: auto;
  
  .dark-mode & {
    background-color: var(--gray-800);
    color: white;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  
  .dark-mode & {
    border-color: var(--gray-700);
  }
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-900);
  
  .dark-mode & {
    color: white;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-500);
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    color: var(--error);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-700);
  
  .dark-mode & {
    color: var(--gray-300);
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  .dark-mode & {
    background-color: var(--gray-700);
    border-color: var(--gray-600);
    color: white;
  }
`;

const FormTextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  .dark-mode & {
    background-color: var(--gray-700);
    border-color: var(--gray-600);
    color: white;
  }
`;

const CategorySelect = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const CategoryOption = styled.div`
  padding: 10px;
  border: 1px solid ${props => props.selected ? 'var(--primary)' : '#ddd'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.03)'};
  }
  
  .dark-mode & {
    border-color: ${props => props.selected ? 'var(--primary)' : 'var(--gray-600)'};
    background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
    
    &:hover {
      background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.05)'};
    }
  }
`;

const TimeOfDaySelect = styled.div`
  display: flex;
  gap: 8px;
`;

const TimeOption = styled.div`
  flex: 1;
  padding: 8px;
  border: 1px solid ${props => props.selected ? 'var(--primary)' : '#ddd'};
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.03)'};
  }
  
  .dark-mode & {
    border-color: ${props => props.selected ? 'var(--primary)' : 'var(--gray-600)'};
    background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
    
    &:hover {
      background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.05)'};
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: transparent;
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0,0,0,0.03);
  }
  
  .dark-mode & {
    border-color: var(--gray-600);
    color: var(--gray-300);
    
    &:hover {
      background-color: rgba(255,255,255,0.05);
    }
  }
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

// Helper function for time formatting
const formatTime = (time) => {
  if (!time) return '';
  return time;
};

const TaskManager = () => {
  const context = useAppContext();
  
  // Move all hooks to the top level, before any conditionals
  const [selectedDay, setSelectedDay] = useState(context?.state?.currentDay || 1);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    category: 'morning',
    taskCategory: 'personal_growth',
    type: 'custom',
    hasReminder: false,
    time: ''
  });
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [activeTaskDetails, setActiveTaskDetails] = useState(null);
  const [activeTaskMenu, setActiveTaskMenu] = useState(null);
  const [taskFormMode, setTaskFormMode] = useState('add');
  const formRef = useRef(null);
  const taskMenuRef = useRef(null);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('personal_growth');
  const [taskDescription, setTaskDescription] = useState('');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [checkboxClicked, setCheckboxClicked] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [gratitudeEntries, setGratitudeEntries] = useState({});
  const [expandedTaskDetails, setExpandedTaskDetails] = useState({});
  const [menuOpenTaskId, setMenuOpenTaskId] = useState(null);
  const menuRef = useRef(null);
  
  // Update selectedDay when currentDay changes in the app context
  useEffect(() => {
    if (context?.state?.currentDay) {
      setSelectedDay(context.state.currentDay);
    }
  }, [context?.state?.currentDay]);
  
  // Initialize expanded categories
  useEffect(() => {
    // If there are tasks, get unique categories and initialize expandedCategories state
    if (context?.state?.weekPlan && context.state.weekPlan.find(d => d?.day === context.state?.currentDay)) {
      const dayPlan = context.state.weekPlan.find(d => d?.day === context.state?.currentDay);
      if (dayPlan && dayPlan.tasks) {
        const tasks = dayPlan.tasks;
        const categories = [...new Set(tasks.map(task => task?.taskCategory).filter(Boolean))];
        const initialExpanded = {};
        categories.forEach(category => {
          initialExpanded[category] = false; // Default to collapsed
        });
        setExpandedCategories(initialExpanded);
      }
    }
  }, [context?.state?.weekPlan, context?.state?.currentDay]);
  
  // Add debugging log
  useEffect(() => {
    if (context?.state?.weekPlan) {
      console.log('Current weekPlan:', context.state.weekPlan);
      console.log('Current day:', context.state?.currentDay);
      const dayPlan = context.state.weekPlan.find(d => d?.day === context.state?.currentDay);
      console.log('Current dayPlan:', dayPlan);
      if (dayPlan && dayPlan.tasks) {
        console.log('Tasks for current day:', dayPlan.tasks);
      }
    } else {
      console.log('weekPlan is undefined or not an array in TaskManager');
    }
  }, [context?.state?.weekPlan, context?.state?.currentDay]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenTaskId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle the case where context might be undefined initially
  if (!context) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        marginTop: '16px'
      }}>
        <h3>Loading Error</h3>
        <p>There was a problem loading the app context. Please try refreshing the page.</p>
      </div>
    );
  }
  
  const { state, dispatch } = context;

  const handleCheckboxClick = (e, taskId, completed) => {
    e.stopPropagation();
    
    dispatch({
      type: 'TOGGLE_TASK_COMPLETE',
      payload: { dayNumber: selectedDay, taskId, completed: !completed }
    });
  };

  const toggleCategory = (category) => {
    setSelectedCategory(category);
  };

  const openForm = () => {
    setTaskFormMode('add');
    resetForm();
    setShowTaskForm(true);
  };

  const closeForm = () => {
    setShowTaskForm(false);
  };

  const resetForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      category: 'morning',
      taskCategory: 'personal_growth',
      type: 'custom',
      hasReminder: false,
      time: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (taskTitle.trim() === '') return;
    
    const newTask = {
      id: editMode && currentTask ? currentTask.id : Date.now().toString(),
      title: taskTitle,
      taskCategory,
      description: taskDescription,
      completed: editMode && currentTask ? currentTask.completed : false,
      reminder: reminder,
      reminderTime: reminderTime
    };
    
    if (editMode && currentTask) {
      dispatch({
        type: 'UPDATE_TASK', 
        payload: {
          taskId: currentTask.id,
          data: newTask
        }
      });
    } else {
      dispatch({
        type: 'ADD_CUSTOM_TASK',
        payload: {
          day: state.currentDay,
          task: newTask
        }
      });
    }
    
    closeForm();
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskCategory(task.taskCategory);
    setTaskDescription(task.description || '');
    setReminder(task.reminder || false);
    setReminderTime(task.reminderTime || '');
    setEditMode(true);
    setFormOpen(true);
  };

  const handleDelete = (taskId) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: { taskId }
    });
  };

  const toggleTaskComplete = (taskId, completed) => {
    dispatch({
      type: 'TOGGLE_TASK',
      payload: { taskId, dispatch }
    });
  };

  const setTaskReminder = (taskId, hasReminder, time) => {
    dispatch({
      type: 'SET_TASK_REMINDER',
      payload: { 
        taskId,
        reminder: hasReminder,
        time
      }
    });
  };

  const getTasksByCategory = () => {
    if (!state || !state.weekPlan) {
      console.log('No state or weekPlan available');
      return {};
    }
    
    const dayPlan = state.weekPlan.find(d => d.day === selectedDay);
    if (!dayPlan || !dayPlan.tasks) {
      console.log(`No dayPlan or tasks found for day: ${selectedDay}`);
      return {};
    }
    
    console.log(`Getting tasks for day ${selectedDay}`);
    
    // Group tasks by category
    const tasksByCategory = dayPlan.tasks.reduce((acc, task) => {
      const category = task.taskCategory || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    }, {});
    
    console.log('Tasks grouped by category:', tasksByCategory);
    
    return tasksByCategory;
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'personal_growth': return <FaBook />;
      case 'emotional_health': return <FaHeartbeat />;
      case 'mental_fitness': return <FaBrain />;
      case 'physical_health': return <FaDumbbell />;
      case 'relationships': return <FaUsers />;
      case 'social': return <FaGlassCheers />;
      case 'financial': return <FaMoneyBillWave />;
      case 'mindfulness': return <FaPrayingHands />;
      default: return <FaBook />;
    }
  };

  const formatCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryCompletionPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    
    const completedCount = tasks.filter(task => task.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const tasksByCategory = getTasksByCategory();
  const categories = Object.keys(tasksByCategory);

  // Task expansion handlers
  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleAddGratitudeEntry = (taskId) => {
    if (!gratitudeEntry.trim()) return;
    
    const newEntries = {
      ...gratitudeEntries,
      [taskId]: [...(gratitudeEntries[taskId] || []), {
        id: Date.now().toString(),
        text: gratitudeEntry,
        timestamp: new Date().toISOString()
      }]
    };
    
    setGratitudeEntries(newEntries);
    setGratitudeEntry('');
    
    // In a real app, you would probably save this to a backend
    // For now, we'll just store it in component state
  };

  const toggleTaskDetails = (taskId) => {
    // For now, just expand the task - in a future enhancement, we could show more details
    console.log(`Toggling details for task ${taskId}`);
  };
  
  const toggleTaskMenu = (taskId, e) => {
    e.stopPropagation();
    setMenuOpenTaskId(menuOpenTaskId === taskId ? null : taskId);
  };

  // Rendering the task list with error handling
  const renderCategoryTaskList = () => {
    try {
      return (
        <div>
          <TaskFilters>
            <FilterButton
              active={selectedCategory === 'all'}
              onClick={() => toggleCategory('all')}
            >
              <FaListUl /> All Tasks
            </FilterButton>
            <FilterButton
              active={selectedCategory === 'personal_growth'}
              onClick={() => toggleCategory('personal_growth')}
            >
              <FaGraduationCap /> Personal Growth
            </FilterButton>
            <FilterButton
              active={selectedCategory === 'emotional_health'}
              onClick={() => toggleCategory('emotional_health')}
            >
              <FaHeartbeat /> Emotional Health
            </FilterButton>
            <FilterButton
              active={selectedCategory === 'mental_fitness'}
              onClick={() => toggleCategory('mental_fitness')}
            >
              <FaBrain /> Mental Fitness
            </FilterButton>
            <FilterButton
              active={selectedCategory === 'physical_health'}
              onClick={() => toggleCategory('physical_health')}
            >
              <FaHeartbeat /> Physical Health
            </FilterButton>
          </TaskFilters>
          
          {selectedCategory === 'all' ? (
            <CategoryTaskList selectedDay={selectedDay} />
          ) : (
            <div className="filtered-tasks">
              <TaskList>
                {tasksByCategory[selectedCategory] && tasksByCategory[selectedCategory].map(task => (
                  <TaskCard
                    key={task.id}
                    completed={task.completed}
                    category={task.taskCategory}
                    onClick={() => toggleTaskDetails(task.id)}
                  >
                    <TaskContent hasDescription={task.description}>
                      <div className="task-header">
                        <TaskCheckbox
                          completed={task.completed}
                          onClick={(e) => handleCheckboxClick(e, task.id, task.completed)}
                        >
                          {task.completed && <FaCheck />}
                        </TaskCheckbox>
                        <TaskTitle completed={task.completed}>
                          <h4>{task.title}</h4>
                        </TaskTitle>
                      </div>
                      {task.description && (
                        <TaskDescription completed={task.completed}>
                          {task.description}
                        </TaskDescription>
                      )}
                      
                      <TaskProgress>
                        <ProgressBar>
                          <ProgressFill completed={task.completed} />
                        </ProgressBar>
                        <TaskStats>
                          <span>{task.points || 10} points</span>
                          <span>{task.completed ? 'Completed' : 'Pending'}</span>
                        </TaskStats>
                      </TaskProgress>
                    </TaskContent>
                  </TaskCard>
                ))}
              </TaskList>
              {(!tasksByCategory[selectedCategory] || tasksByCategory[selectedCategory].length === 0) && (
                <NoTasksMessage>
                  <FaInfoCircle />
                  <p>No tasks found in this category</p>
                </NoTasksMessage>
              )}
            </div>
          )}
          
          <AddTaskButton onClick={openForm}>
            <FaPlus />
            <span>Add Custom Task</span>
          </AddTaskButton>
        </div>
      );
    } catch (error) {
      console.error("Error rendering task list:", error);
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <h3>Error displaying tasks</h3>
          <p>There was a problem loading the task list. Please try refreshing the page.</p>
          <pre style={{fontSize: '12px', textAlign: 'left'}}>{error.message}</pre>
        </div>
      );
    }
  };

  return (
    <TaskManagerContainer>
      {/* Main content */}
      {renderCategoryTaskList()}
      
      {/* Task form */}
      {showTaskForm && (
        <TaskForm onClick={() => setShowTaskForm(false)}>
          <FormContent onClick={(e) => e.stopPropagation()}>
            <FormHeader>
              <FormTitle>{taskFormMode === 'edit' ? 'Edit Task' : 'Add Custom Task'}</FormTitle>
              <CloseButton onClick={() => setShowTaskForm(false)}>
                <FaTimesCircle />
              </CloseButton>
            </FormHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (taskFormData.title.trim()) {
                if (taskFormMode === 'edit') {
                  // Handle edit
                } else {
                  dispatch({
                    type: 'ADD_CUSTOM_TASK',
                    payload: {
                      day: selectedDay,
                      task: {
                        ...taskFormData,
                        id: `custom_${Date.now()}`,
                        completed: false,
                        points: 10
                      }
                    }
                  });
                }
                setShowTaskForm(false);
                resetForm();
              }
            }}>
              <FormGroup>
                <FormLabel htmlFor="task-title">Task Title</FormLabel>
                <FormInput
                  id="task-title"
                  type="text"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                  placeholder="Enter task title"
                  required
                  autoFocus
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="task-description">Description (Optional)</FormLabel>
                <FormTextArea
                  id="task-description"
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                  placeholder="Enter task description"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Category</FormLabel>
                <CategorySelect>
                  <CategoryOption
                    selected={taskFormData.taskCategory === 'personal_growth'}
                    onClick={() => setTaskFormData({...taskFormData, taskCategory: 'personal_growth'})}
                  >
                    <CategoryIcon iconBgColor="#6366F1">
                      <FaGraduationCap />
                    </CategoryIcon>
                    <span style={{marginLeft: '8px'}}>Personal Growth</span>
                  </CategoryOption>
                  <CategoryOption
                    selected={taskFormData.taskCategory === 'emotional_health'}
                    onClick={() => setTaskFormData({...taskFormData, taskCategory: 'emotional_health'})}
                  >
                    <CategoryIcon iconBgColor="#EC4899">
                      <FaSmile />
                    </CategoryIcon>
                    <span style={{marginLeft: '8px'}}>Emotional Health</span>
                  </CategoryOption>
                  <CategoryOption
                    selected={taskFormData.taskCategory === 'mental_fitness'}
                    onClick={() => setTaskFormData({...taskFormData, taskCategory: 'mental_fitness'})}
                  >
                    <CategoryIcon iconBgColor="#10B981">
                      <FaBrain />
                    </CategoryIcon>
                    <span style={{marginLeft: '8px'}}>Mental Fitness</span>
                  </CategoryOption>
                  <CategoryOption
                    selected={taskFormData.taskCategory === 'physical_health'}
                    onClick={() => setTaskFormData({...taskFormData, taskCategory: 'physical_health'})}
                  >
                    <CategoryIcon iconBgColor="#F97316">
                      <FaHeartbeat />
                    </CategoryIcon>
                    <span style={{marginLeft: '8px'}}>Physical Health</span>
                  </CategoryOption>
                </CategorySelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Time of Day</FormLabel>
                <TimeOfDaySelect>
                  <TimeOption
                    selected={taskFormData.category === 'morning'}
                    onClick={() => setTaskFormData({...taskFormData, category: 'morning'})}
                  >
                    Morning
                  </TimeOption>
                  <TimeOption
                    selected={taskFormData.category === 'afternoon'}
                    onClick={() => setTaskFormData({...taskFormData, category: 'afternoon'})}
                  >
                    Afternoon
                  </TimeOption>
                  <TimeOption
                    selected={taskFormData.category === 'evening'}
                    onClick={() => setTaskFormData({...taskFormData, category: 'evening'})}
                  >
                    Evening
                  </TimeOption>
                </TimeOfDaySelect>
              </FormGroup>
              
              <FormActions>
                <CancelButton type="button" onClick={() => setShowTaskForm(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={!taskFormData.title.trim()}>
                  {taskFormMode === 'edit' ? 'Update Task' : 'Add Task'}
                </SubmitButton>
              </FormActions>
            </form>
          </FormContent>
        </TaskForm>
      )}
    </TaskManagerContainer>
  );
};

export default TaskManager; 