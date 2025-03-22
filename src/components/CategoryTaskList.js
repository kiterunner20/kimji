import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaStar,
  FaHeartbeat,
  FaBrain,
  FaUsers,
  FaMoneyBillWave,
  FaSmile,
  FaCheck,
  FaPen,
  FaTrash,
  FaRegSmile,
  FaBook,
  FaRunning,
  FaSpa,
  FaWater,
  FaAppleAlt,
  FaBed,
  FaSun,
  FaMoon,
  FaTasks,
  FaBriefcase,
  FaPhoneAlt,
  FaPencilAlt,
  FaProjectDiagram,
  FaLightbulb,
  FaMusic,
  FaBookReader,
  FaHeart,
  FaDumbbell,
  FaCalendarCheck,
  FaClock
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

// Styled Components
const CategoryContainer = styled.div`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  background: white;
  margin-bottom: 32px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
  
  &.expanded {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  
  /* Remove problematic background pattern */
  &::before {
    content: none;
  }
  
  .dark-mode & {
    background: var(--gray-800);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.05);
    
    &:hover, &.expanded {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: ${props => {
    const baseColor = props.backgroundColor || '#f0f4ff';
    return `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`; 
  }};
  cursor: pointer;
  border-radius: ${props => props.isOpen ? '16px 16px 0 0' : '16px'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 90% 10%, rgba(255,255,255,0.2), transparent 70%);
    z-index: 0;
  }
  
  /* Removing the hover highlight effect from category header */
  
  .dark-mode &::before {
    background-image: radial-gradient(circle at 90% 10%, rgba(255,255,255,0.15), transparent 70%);
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 1;
  
  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 0 rgba(255,255,255,0.5);
  }
  
  .dark-mode & {
    h3 {
      color: #f5f5f5;
      text-shadow: 0 1px 0 rgba(0,0,0,0.5);
    }
  }
  
  @media (max-width: 640px) {
    h3 {
      max-width: 140px;
    }
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background-color: ${props => props.iconBgColor || '#6366F1'};
  color: white;
  margin-right: 8px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  
  svg {
    font-size: 18px;
  }
  
  ${CategoryTitle}:hover & {
    transform: scale(1.05);
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
  
  span {
    font-size: 15px;
    color: #444;
    font-weight: 600;
    background: rgba(255,255,255,0.5);
    padding: 4px 10px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
  }
  
  svg {
    font-size: 18px;
    color: #444;
    transition: transform 0.3s ease;
    background: rgba(255,255,255,0.5);
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    backdrop-filter: blur(4px);
  }
  
  .dark-mode & {
    span {
      color: #f0f0f0;
      background: rgba(0,0,0,0.2);
    }
    
    svg {
      color: #f0f0f0;
      background: rgba(0,0,0,0.2);
    }
  }
`;

const TasksContainer = styled.div`
  padding: 0;
  max-height: ${props => props.isOpen ? '2000px' : '0'};
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.5s ease;
  background-color: white;
  opacity: ${props => props.isOpen ? '1' : '0'};
  
  .dark-mode & {
    background-color: var(--gray-800);
  }
  
  /* Custom scrollbar styles for task list */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px 28px;
  transition: all 0.3s ease;
  position: relative;
  background-color: white;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.03); /* Restore the divider between tasks */
  }
  
  &:hover {
    background-color: rgba(249, 250, 251, 0.8);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 0;
    background-color: ${props => props.categoryColor || '#6366F1'};
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    width: 4px;
    opacity: 1;
  }
  
  .dark-mode & {
    background-color: var(--gray-800);
    
    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.03); /* Restore the divider between tasks in dark mode */
    }
    
    &:hover {
      background-color: var(--gray-750);
    }
  }
  
  &:last-child {
    border-radius: 0 0 16px 16px;
  }
`;

const TaskCheckbox = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 8px;
  border: 2px solid ${props => props.completed ? '#10B981' : '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  cursor: pointer;
  background-color: ${props => props.completed ? '#10B981' : 'transparent'};
  color: white;
  transition: all 0.2s ease;
  margin-top: 2px;
  position: relative;
  
  &:hover {
    border-color: ${props => props.completed ? '#059669' : '#9CA3AF'};
    background-color: ${props => props.completed ? '#059669' : 'rgba(0, 0, 0, 0.02)'};
    transform: scale(1.05);
  }
  
  svg {
    font-size: 12px;
  }
  
  .dark-mode & {
    border-color: ${props => props.completed ? '#10B981' : '#6B7280'};
    
    &:hover {
      background-color: ${props => props.completed ? '#059669' : 'rgba(255, 255, 255, 0.05)'};
    }
  }
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
  margin-right: 70px; /* Add space for the task type icon */
`;

const TaskTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.completed ? 'var(--gray-400)' : 'var(--gray-800)'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  
  .dark-mode & {
    color: ${props => props.completed ? 'var(--gray-500)' : 'var(--gray-200)'};
  }
`;

const TaskDescription = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: ${props => props.completed ? 'var(--gray-400)' : '#6B7280'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.isExpanded ? 'none' : 2};
  -webkit-box-orient: vertical;
  line-height: 1.5;
  
  .dark-mode & {
    color: ${props => props.completed ? 'var(--gray-500)' : '#D1D5DB'};
  }
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

const Tag = styled.span`
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 6px;
  background-color: ${props => {
    if (props.className === 'time-tag') {
      return props.time === 'Morning' ? 'rgba(255, 171, 64, 0.15)' :
        props.time === 'Afternoon' ? 'rgba(68, 131, 245, 0.15)' :
        props.time === 'Evening' ? 'rgba(147, 51, 234, 0.15)' : 'rgba(75, 85, 99, 0.15)';
    }
    if (props.className === 'category-tag') return 'rgba(99, 102, 241, 0.1)';
    if (props.className === 'points-tag') return 'rgba(16, 185, 129, 0.1)';
    return 'rgba(75, 85, 99, 0.1)';
  }};
  color: ${props => {
    if (props.className === 'time-tag') {
      return props.time === 'Morning' ? '#F59E0B' :
        props.time === 'Afternoon' ? '#3B82F6' :
        props.time === 'Evening' ? '#8B5CF6' : '#4B5563';
    }
    if (props.className === 'category-tag') return '#4F46E5';
    if (props.className === 'points-tag') return '#10B981';
    return '#4B5563';
  }};
  white-space: nowrap;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 10px;
  }
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--gray-500);
  background-color: var(--gray-50);
  border-radius: 0 0 12px 12px;
  
  .dark-mode & {
    background-color: var(--gray-750);
    color: var(--gray-400);
  }
`;

// Fix the CategoriesGrid to have a clean vertical layout
const CategoriesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 16px;
  background: none;
  
  /* Remove horizontal scroll-related styles */
  overflow-x: visible;
  scroll-snap-type: none;
`;

// Remove the visual cue for horizontal scrolling
const CategoriesContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  background: none;
  
  /* Remove the horizontal fade effect */
  &::after {
    display: none;
  }
`;

// Remove or hide the scroll indicators
const ScrollIndicator = styled.div`
  display: none; /* Hide dots since they're not needed for vertical layout */
`;

// CategoryLabel for vertical layout
const CategoryLabel = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 20px;
  padding-left: 16px;
  padding-top: 12px;
  background: none;
  
  .dark-mode & {
    color: var(--gray-200);
  }
`;

// New components for task actions
const TaskActions = styled.div`
  position: absolute;
  top: 16px;
  right: 20px; 
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5; /* Ensure this is above other elements */
  
  ${TaskItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => 
    props.type === 'edit' ? 'rgba(79, 70, 229, 0.08)' : 
    props.type === 'delete' ? 'rgba(239, 68, 68, 0.08)' : 
    props.type === 'expand' ? 'rgba(156, 163, 175, 0.08)' : 'rgba(156, 163, 175, 0.08)'
  };
  color: ${props => 
    props.type === 'edit' ? '#4F46E5' : 
    props.type === 'delete' ? '#EF4444' : 
    props.type === 'expand' ? '#6B7280' : '#6B7280'
  };
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => 
      props.type === 'edit' ? 'rgba(79, 70, 229, 0.15)' : 
      props.type === 'delete' ? 'rgba(239, 68, 68, 0.15)' : 
      props.type === 'expand' ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.15)'
    };
  }
  
  .dark-mode & {
    background-color: ${props => 
      props.type === 'edit' ? 'rgba(124, 58, 237, 0.15)' : 
      props.type === 'delete' ? 'rgba(239, 68, 68, 0.15)' : 
      props.type === 'expand' ? 'rgba(107, 114, 128, 0.15)' : 'rgba(107, 114, 128, 0.15)'
    };
    color: ${props => 
      props.type === 'edit' ? '#818CF8' : 
      props.type === 'delete' ? '#FCA5A5' : 
      props.type === 'expand' ? '#D1D5DB' : '#D1D5DB'
    };
  }
`;

// Components for expandable feelings/notes section
const ExpandedContent = styled.div`
  padding: 0 24px 24px 64px;
  max-height: ${props => props.isExpanded ? '800px' : '0'};
  opacity: ${props => props.isExpanded ? 1 : 0};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const FeelingsSection = styled.div`
  margin-top: 20px;
  padding: 24px;
  background-color: rgba(79, 70, 229, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(79, 70, 229, 0.1);
  position: relative;
  
  .dark-mode & {
    background-color: rgba(129, 140, 248, 0.1);
    border-color: rgba(129, 140, 248, 0.1);
  }
`;

const FeelingsTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #4F46E5;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: #4F46E5;
    font-size: 20px;
  }
  
  .dark-mode & {
    color: #818CF8;
    
    svg {
      color: #818CF8;
    }
  }
`;

const FeelingsTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background-color: white;
  font-size: 14px;
  color: #1F2937;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  .dark-mode & {
    background-color: #374151;
    border-color: #4B5563;
    color: #F9FAFB;
    
    &:focus {
      border-color: #818CF8;
      box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
    }
  }
`;

const MoodSelector = styled.div`
  display: flex;
  gap: 16px;
  margin: 16px 0;
  justify-content: center;
  padding: 8px 0;
`;

const MoodButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: ${props => props.selected ? 1 : 0.5};
  transform: ${props => props.selected ? 'scale(1.2)' : 'scale(1)'};
  width: 54px;
  height: 54px;
  
  ${props => props.selected && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: rgba(79, 70, 229, 0.15);
      z-index: -1;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      70% {
        transform: scale(1.3);
        opacity: 0;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }
  `}
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:focus {
    outline: none;
  }
  
  .dark-mode & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    ${props => props.selected && `
      &::after {
        background: rgba(129, 140, 248, 0.2);
      }
    `}
  }
`;

const SaveButton = styled.button`
  background-color: #4F46E5;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: all 0.6s ease;
  }
  
  svg {
    margin-right: 10px;
    font-size: 16px;
  }
  
  &:hover {
    background-color: #4338CA;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25);
    
    &::after {
      left: 100%;
    }
  }
  
  .dark-mode & {
    background-color: #6366F1;
    
    &:hover {
      background-color: #4F46E5;
    }
  }
`;

const SavedNotes = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #F9FAFB;
  border-radius: 12px;
  font-size: 15px;
  border-left: 4px solid #4F46E5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  
  .dark-mode & {
    background-color: #1F2937;
    border-left-color: #818CF8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Enhanced task type icon display
const TaskTypeIconWrapper = styled.div`
  position: absolute;
  right: 24px;
  top: 60px; /* Move down to avoid overlap with action buttons */
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  z-index: 2;

  ${TaskItem}:hover & {
    transform: scale(1.05);
  }

  .dark-mode & {
    background-color: #374151;
    color: #d1d5db;
  }
`;

// Create TaskPriority indicator
const TaskPriority = styled.div`
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: ${props => props.priority === 'high' ? '60%' : props.priority === 'medium' ? '40%' : '20%'};
  border-radius: 2px;
  background-color: ${props => 
    props.priority === 'high' ? '#EF4444' : 
    props.priority === 'medium' ? '#F59E0B' : 
    '#10B981'
  };
  opacity: 0.7;
  
  ${TaskItem}:hover & {
    opacity: 1;
  }
`;

// Create task progress component
const TaskProgress = styled.div`
  position: relative;
  height: 3px;
  width: 100%;
  background-color: #E5E7EB;
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
  display: ${props => props.visible ? 'block' : 'none'}; /* Hide when not needed */
  
  .dark-mode & {
    background-color: #374151;
  }
`;

const TaskProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.progress || 0}%;
  background-color: #10B981;
  border-radius: 4px;
  transition: width 0.5s ease;
`;

// Helper functions
const getCategoryBackgroundColor = (category) => {
  switch (category) {
    case 'personal_growth':
      return '#f0f4ff';
    case 'emotional_health':
      return '#fce7f3';
    case 'mental_fitness':
      return '#dcfce7';
    case 'physical_health':
      return '#ffedd5';
    case 'relationships':
      return '#dbeafe';
    case 'social':
      return '#f5f3ff';
    case 'financial':
      return '#ecfdf5';
    case 'mindfulness':
      return '#f9fafb';
    default:
      return '#f0f4ff';
  }
};

const getCategoryIconBackgroundColor = (category) => {
  switch (category) {
    case 'personal_growth':
      return '#6366F1';
    case 'emotional_health':
      return '#EC4899';
    case 'mental_fitness':
      return '#10B981';
    case 'physical_health':
      return '#F97316';
    case 'relationships':
      return '#3B82F6';
    case 'social':
      return '#8B5CF6';
    case 'financial':
      return '#059669';
    case 'mindfulness':
      return '#64748B';
    default:
      return '#6366F1';
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'personal_growth':
      return <FaStar />;
    case 'emotional_health':
      return <FaSmile />;
    case 'mental_fitness':
      return <FaBrain />;
    case 'physical_health':
      return <FaHeartbeat />;
    case 'relationships':
      return <FaUsers />;
    case 'social':
      return <FaUsers />;
    case 'financial':
      return <FaMoneyBillWave />;
    case 'mindfulness':
      return <FaSpa />;
    default:
      return <FaTasks />;
  }
};

const formatCategoryName = (category) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getTaskTimeOfDay = (category) => {
  switch (category) {
    case 'morning':
      return 'Morning';
    case 'afternoon':
      return 'Afternoon';
    case 'evening':
      return 'Evening';
    default:
      return 'Anytime';
  }
};

// Custom helper to get the task priority
const getTaskPriority = (task) => {
  if (!task) return 'low';
  
  // Determine priority based on points or other factors
  if (task.points >= 10) return 'high';
  if (task.points >= 5) return 'medium';
  return 'low';
};

// Enhanced function to get task type icon
const getTaskTypeIcon = (task) => {
  // Handle case when task is undefined
  if (!task) return <FaTasks />;
  
  // Match property names to the actual data structure
  const taskName = (task.title || task.name || '').toLowerCase();
  const taskDescription = (task.description || '').toLowerCase();
  const category = (task.category || task.taskCategory || '').toLowerCase();

  // Check for exercise related tasks
  if (taskName.includes('workout') || 
      taskName.includes('exercise') || 
      taskName.includes('gym') ||
      taskDescription.includes('workout') || 
      taskDescription.includes('exercise')) {
    return <FaDumbbell />;
  }
  
  // Check for meditation related tasks
  if (taskName.includes('meditat') || 
      taskName.includes('mindful') ||
      taskDescription.includes('meditat') || 
      taskDescription.includes('mindful')) {
    return <FaSpa />;
  }
  
  // Check for water/hydration related tasks
  if (taskName.includes('water') || 
      taskName.includes('hydrat') ||
      taskDescription.includes('water') || 
      taskDescription.includes('drink')) {
    return <FaWater />;
  }
  
  // Check for nutrition related tasks
  if (taskName.includes('eat') || 
      taskName.includes('food') || 
      taskName.includes('meal') ||
      taskDescription.includes('eat') || 
      taskDescription.includes('food') || 
      taskDescription.includes('nutrition')) {
    return <FaAppleAlt />;
  }
  
  // Check for sleep related tasks
  if (taskName.includes('sleep') || 
      taskName.includes('rest') ||
      taskDescription.includes('sleep') || 
      taskDescription.includes('rest')) {
    return <FaBed />;
  }
  
  // Check for morning routine tasks
  if (taskName.includes('morning') ||
      taskDescription.includes('morning')) {
    return <FaSun />;
  }
  
  // Check for evening routine tasks
  if (taskName.includes('evening') || 
      taskName.includes('night') ||
      taskDescription.includes('evening') || 
      taskDescription.includes('night')) {
    return <FaMoon />;
  }
  
  // Check for learning related tasks
  if (taskName.includes('learn') || 
      taskName.includes('study') || 
      taskName.includes('read') ||
      taskDescription.includes('learn') || 
      taskDescription.includes('study') || 
      taskDescription.includes('book')) {
    return <FaBook />;
  }

  // Check for reading related tasks
  if (taskName.includes('read') || 
      taskDescription.includes('read') ||
      taskName.includes('book') ||
      taskDescription.includes('book')) {
    return <FaBookReader />;
  }
  
  // Check for work related tasks
  if (taskName.includes('work') || 
      taskName.includes('job') || 
      taskName.includes('meeting') ||
      taskDescription.includes('work') || 
      taskDescription.includes('meeting')) {
    return <FaBriefcase />;
  }
  
  // Check for call/communication related tasks
  if (taskName.includes('call') || 
      taskName.includes('phone') || 
      taskName.includes('text') ||
      taskDescription.includes('call') || 
      taskDescription.includes('phone')) {
    return <FaPhoneAlt />;
  }
  
  // Check for writing related tasks
  if (taskName.includes('write') || 
      taskName.includes('journal') ||
      taskDescription.includes('write') || 
      taskDescription.includes('journal')) {
    return <FaPencilAlt />;
  }
  
  // Check for creative tasks
  if (taskName.includes('creat') || 
      taskName.includes('design') || 
      taskName.includes('art') ||
      taskDescription.includes('creat') || 
      taskDescription.includes('design')) {
    return <FaLightbulb />;
  }
  
  // Default icon based on category
  if (category.includes('personal')) {
    return <FaStar />;
  } else if (category.includes('emotion')) {
    return <FaHeart />;
  } else if (category.includes('mental')) {
    return <FaBrain />;
  } else if (category.includes('physical')) {
    return <FaRunning />;
  } else if (category.includes('relation')) {
    return <FaUsers />;
  } else {
    return <FaTasks />;
  }
};

// Calculate task progress
const getTaskProgress = (task) => {
  if (!task) return 0;
  if (task.completed) return 100;
  
  // Could be enhanced with actual progress tracking
  // For now using random values for demonstration
  const taskId = parseInt(task.id, 10) || 0;
  return (taskId % 10) * 10; // 0, 10, 20, ..., 90
};

// Main Component
const CategoryTaskList = ({ selectedDay }) => {
  console.log('CategoryTaskList rendering with selectedDay:', selectedDay);
  
  // Always call hooks at the top level, before any conditionals
  const [openCategories, setOpenCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // New state for expanded tasks and editing
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [userNotes, setUserNotes] = useState({});
  const [selectedMoods, setSelectedMoods] = useState({});
  
  const context = useAppContext();
  console.log('Context received in CategoryTaskList:', context);
  
  // IMPORTANT: Declare all variables that will be needed for useEffect here, before any returns
  const weekPlan = context ? (context.weekPlan || []) : [];
  const dispatch = context ? (context.dispatch || (() => console.error('Dispatch not available'))) : () => console.error('Dispatch not available');
  
  // Get all tasks for the selected day grouped by category - Define early to use in useEffect
  const getTasksByCategory = () => {
    if (!Array.isArray(weekPlan) || weekPlan.length === 0) {
      console.log('No weekPlan data available');
      return {};
    }
    
    const dayData = weekPlan.find(d => d && d.day === selectedDay);
    
    if (!dayData) {
      console.log(`No day data found for day ${selectedDay}`);
      return {};
    }
    
    if (!Array.isArray(dayData.tasks)) {
      console.log(`No tasks array found for day ${selectedDay}`);
      return {};
    }
    
    console.log(`Found ${dayData.tasks.length} tasks for day ${selectedDay}`);
    
    const tasksByCategory = {};
    
    // First filter tasks based on work mode
    const { workMode } = context || {};
    let filteredTasks = dayData.tasks;
    
    if (workMode) {
      // In work mode, only show productivity and personal growth related tasks
      filteredTasks = dayData.tasks.filter(task => {
        // Include tasks from specific categories
        if (task.taskCategory === 'personal_growth' || task.taskCategory === 'mental_fitness') {
          return true;
        }
        
        // Include tasks with productivity-related keywords
        const taskTitle = (task.title || '').toLowerCase();
        const taskDesc = (task.description || '').toLowerCase();
        const productivityKeywords = ['work', 'productivity', 'goal', 'focus', 'learn', 'skill', 'read', 'study'];
        
        return productivityKeywords.some(keyword => 
          taskTitle.includes(keyword) || taskDesc.includes(keyword)
        );
      });
    }
    
    // Group filtered tasks by category
    filteredTasks.forEach(task => {
      if (!task) return;
      
      const category = task.taskCategory || 'uncategorized';
      
      if (!tasksByCategory[category]) {
        tasksByCategory[category] = [];
      }
      
      tasksByCategory[category].push(task);
    });
    
    return tasksByCategory;
  };
  
  const tasksByCategory = getTasksByCategory();
  const categories = Object.keys(tasksByCategory);
  
  // IMPORTANT: Place ALL useEffect hooks before any conditional returns
  // Initialize all categories as open for better UX in vertical layout
  useEffect(() => {
    if (categories.length > 0) {
      // In vertical layout, we might want to show all categories open
      setOpenCategories([]);
      setActiveIndex(0);
    }
  }, [categories.length]); // Only trigger when categories length changes
  
  // Super defensive check for missing context or context properties
  if (!context) {
    console.error('No context available in CategoryTaskList');
    return <div>Error: App context not available</div>;
  }
  
  console.log('weekPlan from context:', weekPlan);
  console.log('Categories found:', categories);
  
  // If no categories are found, show a message
  if (categories.length === 0) {
    return (
      <EmptyState>
        No tasks found for day {selectedDay}. Try selecting a different day or adding custom tasks.
      </EmptyState>
    );
  }
  
  // Toggle category expanded/collapsed state
  const toggleCategory = (e, category) => {
    e.stopPropagation(); // Prevent the card container click from firing
    if (openCategories.includes(category)) {
      setOpenCategories(openCategories.filter(cat => cat !== category));
    } else {
      setOpenCategories([...openCategories, category]);
    }
  };
  
  // Toggle task expanded/collapsed state
  const toggleTaskExpand = (e, taskId) => {
    e.stopPropagation(); // Prevent the task item click from firing
    
    if (expandedTasks.includes(taskId)) {
      setExpandedTasks(expandedTasks.filter(id => id !== taskId));
    } else {
      setExpandedTasks([...expandedTasks, taskId]);
    }
  };
  
  // Handle edit task button click
  const handleEditTask = (e, taskId) => {
    e.stopPropagation();
    setEditingTask(taskId);
    // Ensure the task is expanded when editing
    if (!expandedTasks.includes(taskId)) {
      setExpandedTasks([...expandedTasks, taskId]);
    }
  };
  
  // Handle delete task button click
  const handleDeleteTask = (e, taskId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      // You would typically call an API to delete the task
      console.log('Deleting task:', taskId);
      // For now we'll just log the action
      alert('Task deleted successfully! (This is a mock implementation)');
    }
  };
  
  // Handle save notes for a task
  const handleSaveNotes = (taskId) => {
    // You would typically call an API to save the notes
    console.log('Saving notes for task:', taskId, userNotes[taskId], selectedMoods[taskId]);
    // For now we'll just log the action
    alert('Notes saved successfully! (This is a mock implementation)');
  };
  
  // Handle mood selection
  const handleMoodSelect = (taskId, mood) => {
    setSelectedMoods({
      ...selectedMoods,
      [taskId]: mood
    });
  };
  
  // Handle notes input
  const handleNotesChange = (taskId, notes) => {
    setUserNotes({
      ...userNotes,
      [taskId]: notes
    });
  };
  
  // Calculate category completion
  const getCategoryCompletion = (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return { completed: 0, total: 0 };
    
    const completed = tasks.filter(task => task && task.completed).length;
    return {
      completed,
      total: tasks.length
    };
  };
  
  // Calculate category points
  const getCategoryPoints = (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return { earned: 0, total: 0 };
    
    const earned = tasks
      .filter(task => task && task.completed)
      .reduce((total, task) => total + (task.points || 0), 0);
    
    const total = tasks
      .reduce((total, task) => total + (task.points || 0), 0);
    
    return { earned, total };
  };
  
  // Get the name of the active category
  const getActiveCategoryName = () => {
    if (categories.length > activeIndex) {
      return formatCategoryName(categories[activeIndex]);
    }
    return '';
  };
  
  // Restore the missing task handling functionality
  // Scroll to a specific category - modify to scroll vertically now
  const scrollToCategory = (index) => {
    setActiveIndex(index);
    const categories = document.querySelectorAll('.category-container');
    if (categories && categories[index]) {
      categories[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };
  
  // Handle task completion toggle
  const handleTaskComplete = (taskId, completed) => {
    console.log('Toggling task:', taskId, 'Current completed state:', completed);
    
    // Use a more generic payload to accommodate either action type
    dispatch({
      type: 'TOGGLE_TASK',
      payload: { 
        taskId, 
        dispatch,
        dayNumber: selectedDay
      }
    });
  };
  
  return (
    <>
      <CategoryLabel>
        Today's Tasks
      </CategoryLabel>
      <CategoriesContainer>
        <CategoriesGrid>
          {categories.map((category, index) => {
            const tasks = tasksByCategory[category] || [];
            
            // Skip rendering if no tasks
            if (tasks.length === 0) return null;
            
            const { completed, total } = getCategoryCompletion(tasks);
            const points = getCategoryPoints(tasks);
            const isOpen = openCategories.includes(category);
            
            return (
              <CategoryContainer 
                key={category} 
                className={`category-container ${isOpen ? 'expanded' : ''}`}
              >
                <CategoryHeader 
                  backgroundColor={getCategoryBackgroundColor(category)}
                  onClick={(e) => toggleCategory(e, category)}
                  isOpen={isOpen}
                  category={category}
                >
                  <CategoryTitle>
                    <CategoryIcon iconBgColor={getCategoryIconBackgroundColor(category)}>
                      {getCategoryIcon(category)}
                    </CategoryIcon>
                    <h3>{formatCategoryName(category)}</h3>
                  </CategoryTitle>
                  
                  <CategoryInfo>
                    <span>{points.earned}/{points.total} pts</span>
                    <span>{completed}/{total}</span>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </CategoryInfo>
                </CategoryHeader>
                
                <TasksContainer isOpen={isOpen}>
                  {tasks.map(task => {
                    if (!task || !task.id) {
                      console.error('Invalid task object:', task);
                      return null;
                    }
                    
                    const isExpanded = expandedTasks.includes(task.id);
                    const isEditing = editingTask === task.id;
                    const taskPriority = getTaskPriority(task);
                    const taskProgress = getTaskProgress(task);
                    
                    return (
                      <React.Fragment key={task.id}>
                        <TaskItem categoryColor={getCategoryIconBackgroundColor(category)}>
                          <TaskPriority priority={taskPriority} />
                          
                          <TaskCheckbox 
                            completed={Boolean(task.completed)}
                            onClick={() => handleTaskComplete(task.id, task.completed)}
                          >
                            {task.completed && <FaCheck />}
                          </TaskCheckbox>
                          
                          <TaskContent>
                            <TaskTitle completed={Boolean(task.completed)}>
                              {task.title || 'Unnamed Task'}
                            </TaskTitle>
                            <TaskDescription 
                              completed={Boolean(task.completed)}
                              isExpanded={isExpanded}
                            >
                              {task.description || ''}
                            </TaskDescription>
                            
                            <TaskTags>
                              <Tag className="time-tag" time={getTaskTimeOfDay(task.category)}>
                                {task.category === 'morning' && <FaSun />}
                                {task.category === 'afternoon' && <FaSun />}
                                {task.category === 'evening' && <FaMoon />}
                                {getTaskTimeOfDay(task.category)}
                              </Tag>
                              <Tag className="category-tag">
                                {getCategoryIcon(category)}
                                {formatCategoryName(category)}
                              </Tag>
                              <Tag className="points-tag">
                                <FaStar />
                                {task.points || 0} pts
                              </Tag>
                            </TaskTags>
                            
                            {!task.completed && taskProgress > 0 && (
                              <TaskProgress visible={taskProgress > 0}>
                                <TaskProgressFill progress={taskProgress} />
                              </TaskProgress>
                            )}
                          </TaskContent>
                          
                          <TaskTypeIconWrapper>
                            {getTaskTypeIcon(task)}
                          </TaskTypeIconWrapper>
                          
                          <TaskActions>
                            <ActionButton
                              type="edit"
                              onClick={(e) => handleEditTask(e, task.id)}
                              aria-label="Edit task"
                            >
                              <FaPen />
                            </ActionButton>
                            <ActionButton
                              type="delete"
                              onClick={(e) => handleDeleteTask(e, task.id)}
                              aria-label="Delete task"
                            >
                              <FaTrash />
                            </ActionButton>
                            <ActionButton
                              type="expand"
                              onClick={(e) => toggleTaskExpand(e, task.id)}
                              aria-label={isExpanded ? "Collapse task" : "Expand task"}
                            >
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </ActionButton>
                          </TaskActions>
                        </TaskItem>
                        
                        <ExpandedContent isExpanded={isExpanded}>
                          {isEditing ? (
                            <div style={{ 
                              marginBottom: "20px", 
                              padding: "20px", 
                              backgroundColor: "rgba(79, 70, 229, 0.05)", 
                              borderRadius: "16px"
                            }}>
                              <input 
                                value={task.title}
                                style={{
                                  width: "100%",
                                  padding: "14px",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  border: "1px solid rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  marginBottom: "16px"
                                }}
                              />
                              <textarea
                                value={task.description}
                                style={{
                                  width: "100%",
                                  padding: "14px",
                                  fontSize: "15px",
                                  border: "1px solid rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  minHeight: "100px",
                                  resize: "vertical"
                                }}
                              />
                              <SaveButton onClick={() => setEditingTask(null)} style={{ marginTop: "20px" }}>
                                <FaCheck /> Save Changes
                              </SaveButton>
                            </div>
                          ) : (
                            <FeelingsSection>
                              <FeelingsTitle>
                                <FaRegSmile /> How are you feeling about this task?
                              </FeelingsTitle>
                              
                              <FeelingsTextarea 
                                placeholder="Add notes or reflections about how you're feeling with this task..."
                                value={userNotes[task.id] || ''}
                                onChange={(e) => handleNotesChange(task.id, e.target.value)}
                              />
                              
                              <MoodSelector>
                                <MoodButton 
                                  onClick={() => handleMoodSelect(task.id, 'happy')} 
                                  selected={selectedMoods[task.id] === 'happy'}
                                  aria-label="Happy"
                                >
                                  😊
                                </MoodButton>
                                <MoodButton 
                                  onClick={() => handleMoodSelect(task.id, 'neutral')} 
                                  selected={selectedMoods[task.id] === 'neutral'}
                                  aria-label="Neutral"
                                >
                                  😐
                                </MoodButton>
                                <MoodButton 
                                  onClick={() => handleMoodSelect(task.id, 'frustrated')} 
                                  selected={selectedMoods[task.id] === 'frustrated'}
                                  aria-label="Frustrated"
                                >
                                  😣
                                </MoodButton>
                                <MoodButton 
                                  onClick={() => handleMoodSelect(task.id, 'accomplished')} 
                                  selected={selectedMoods[task.id] === 'accomplished'}
                                  aria-label="Accomplished"
                                >
                                  🎉
                                </MoodButton>
                              </MoodSelector>
                              
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SaveButton onClick={() => handleSaveNotes(task.id)}>
                                  <FaCheck /> Save Notes
                                </SaveButton>
                              </div>
                              
                              {userNotes[task.id] && selectedMoods[task.id] && (
                                <SavedNotes>
                                  <strong>Your notes:</strong> {userNotes[task.id]} <span style={{ fontSize: '18px', marginLeft: '8px' }}>
                                    {selectedMoods[task.id] === 'happy' && '😊'}
                                    {selectedMoods[task.id] === 'neutral' && '😐'}
                                    {selectedMoods[task.id] === 'frustrated' && '😣'}
                                    {selectedMoods[task.id] === 'accomplished' && '🎉'}
                                  </span>
                                </SavedNotes>
                              )}
                            </FeelingsSection>
                          )}
                        </ExpandedContent>
                      </React.Fragment>
                    );
                  })}
                </TasksContainer>
              </CategoryContainer>
            );
          })}
        </CategoriesGrid>
      </CategoriesContainer>
    </>
  );
};

export default CategoryTaskList; 