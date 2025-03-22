import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { 
  FaAngleDown, 
  FaAngleUp, 
  FaCheck, 
  FaWater, 
  FaRunning, 
  FaRegSmile, 
  FaBell, 
  FaBellSlash,
  FaMoon,
  FaSun,
  FaClipboard,
  FaTimes,
  FaTrophy,
  FaRegClock,
  FaPen,
  FaTrash,
  FaCalendarDay
} from 'react-icons/fa';
import HydrationTracker from './trackers/HydrationTracker';
import WorkoutTracker from './trackers/WorkoutTracker';
import GratitudeTracker from './trackers/GratitudeTracker';
import ExpenseTracker from './trackers/ExpenseTracker';
import EmotionTracker from './trackers/EmotionTracker';

// Main Card Component with 3D perspective effects
const Card = styled.div`
  position: relative;
  background-color: var(--light);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 5px 10px rgba(0,0,0,0.03);
  margin-bottom: 2.25rem; /* Increased spacing between cards */
  overflow: hidden;
  transition: all 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.03);
  border-left: 5px solid ${props => {
    if (props.completed) return 'var(--success)';
    switch (props.type) {
      case 'meditation': return 'var(--secondary)';
      case 'hydration': return '#48CAE4';
      case 'workout': return '#FB8500';
      case 'emotion': return '#9D4EDD';
      case 'gratitude': return '#4ADE80';
      case 'expense': return '#F59E0B';
      case 'kindness': return '#EC4899';
      case 'custom': return '#6366F1';
      default: return 'var(--primary)';
    }
  }};
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: ${props => props.isHovered ? 
    `translateY(-10px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg)` : 
    'translateY(0) rotateX(0) rotateY(0)'};
  backface-visibility: hidden;
  min-height: ${props => props.isExpanded ? '400px' : '160px'}; /* Increased minimum height */
  max-width: 100%;
  width: 100%;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0,0,0,0.08), 0 8px 15px rgba(0,0,0,0.05);
  }
  
  /* Enhanced distinction for primary vs secondary tasks */
  opacity: ${props => props.isPrimary ? 1 : 0.95};
  transform: ${props => {
    if (props.isHovered) {
      return `translateY(-10px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg)`;
    }
    return props.isPrimary ? 'translateY(0)' : 'translateY(0) scale(0.98)';
  }};
  
  .dark-mode & {
    background-color: ${props => props.completed ? 'rgba(31, 41, 55, 0.8)' : props.isPrimary ? 'rgba(17, 24, 39, 0.9)' : 'rgba(17, 24, 39, 0.85)'};
    border-color: rgba(255,255,255,0.05);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      // Enhanced color coding with subtle gradient backgrounds based on task type
      switch (props.type) {
        case 'meditation': 
          return 'radial-gradient(circle at 10% 10%, rgba(14, 165, 233, 0.1), transparent 60%)';
        case 'hydration': 
          return 'radial-gradient(circle at 10% 10%, rgba(72, 202, 228, 0.1), transparent 60%)';
        case 'workout': 
          return 'radial-gradient(circle at 10% 10%, rgba(251, 133, 0, 0.1), transparent 60%)';
        case 'emotion': 
          return 'radial-gradient(circle at 10% 10%, rgba(157, 78, 221, 0.1), transparent 60%)';
        case 'gratitude': 
          return 'radial-gradient(circle at 10% 10%, rgba(74, 222, 128, 0.1), transparent 60%)';
        case 'expense': 
          return 'radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.1), transparent 60%)';
        case 'kindness': 
          return 'radial-gradient(circle at 10% 10%, rgba(236, 72, 153, 0.1), transparent 60%)';
        case 'custom': 
          return 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.1), transparent 60%)';
        default: 
          return 'radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.1), transparent 60%)';
      }
    }};
    border-radius: var(--border-radius-lg);
    opacity: 1; /* Always show the subtle background */
    transition: opacity 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;
    z-index: 0;
  }
`;

// Header with smoother animations
const CardHeader = styled.div`
  display: flex;
  padding: 2rem 2.5rem; /* Increased padding for better readability */
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 8%;
    right: 8%;
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      ${props => props.isExpanded ? 'rgba(0,0,0,0.07)' : 'transparent'}, 
      transparent);
    opacity: ${props => props.isExpanded ? 1 : 0};
    transition: opacity 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  .dark-mode & {
    &::after {
      background: linear-gradient(to right, 
        transparent, 
        ${props => props.isExpanded ? 'rgba(255,255,255,0.07)' : 'transparent'}, 
        transparent);
    }
  }
`;

// Enhanced interactive checkbox with pulse animation
const CheckBox = styled.div`
  width: 36px; /* Larger checkboxes */
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? 'var(--success)' : 'var(--gray-300)'};
  background-color: ${props => props.completed ? 'var(--success)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 2rem; /* More spacing */
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 10;
  
  ${props => props.completed && `
    box-shadow: 0 0 0 6px var(--success-light);
  `}

  &:hover {
    transform: scale(1.15);
    border-color: ${props => props.completed ? 'var(--success)' : 'var(--primary)'};
    box-shadow: ${props => props.completed ? 
      '0 0 0 6px var(--success-light)' : 
      '0 0 0 4px var(--primary-light)'};
  }
  
  .dark-mode & {
    border-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-500)'};
  }
  
  svg {
    opacity: ${props => props.completed ? 1 : 0};
    transform: ${props => props.completed ? 'scale(1)' : 'scale(0.5)'};
    transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
    font-size: 1rem;
  }
  
  ${props => props.pulse && `
    animation: pulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  `}
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;

// Redesigned task information container with more space
const TaskInfo = styled.div`
  flex: 1;
  min-width: 0;
  margin-right: 1.25rem;
`;

// Enhanced task title with better typography
const TaskTitle = styled.h3`
  margin: 0 0 0.75rem 0; /* More vertical spacing */
  font-size: ${props => props.isPrimary ? '1.4rem' : '1.25rem'}; /* Larger titles */
  font-weight: ${props => props.isPrimary ? '700' : '600'}; /* Primary tasks have bolder titles */
  letter-spacing: -0.01em; /* Improved typography */
  color: var(--gray-900);
  transition: all 300ms ease;
  position: relative;
  padding-bottom: 0.35rem;
  line-height: 1.4; /* Increased line height for better readability */
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  text-decoration-color: ${props => props.completed ? 'var(--success)' : 'transparent'};
  text-decoration-thickness: 2px;
  opacity: ${props => props.completed ? 0.65 : 1};
  
  .dark-mode & {
    color: ${props => props.completed ? 'var(--gray-400)' : 'var(--gray-50)'};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.completed ? '100%' : '0'};
    height: 2px;
    background-color: var(--success);
    opacity: ${props => props.completed ? 0.5 : 0};
    transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

// Improved task description with better typography and line clamp
const TaskDescription = styled.p`
  margin: 0 0 1rem 0; /* Increased bottom margin */
  font-size: 1.05rem; /* Larger description text */
  color: var(--gray-600);
  line-height: 1.6; /* Increased line height for better readability */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.isExpanded ? 'none' : 2};
  -webkit-box-orient: vertical;
  transition: all 300ms ease;
  
  .dark-mode & {
    color: var(--gray-400);
  }
`;

// Task metadata section with improved layout
const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Increased gap for better spacing */
  align-items: center;
  margin-top: 0.75rem; /* Increased top margin */
`;

// Task tags with enhanced design
const TaskTag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem; /* Increased size */
  font-weight: 500;
  padding: 0.35rem 0.8rem; /* Increased padding */
  border-radius: 100px;
  background-color: ${props => props.type ? `var(--${props.type}-light, rgba(124,58,237,0.1))` : 'rgba(124,58,237,0.1)'};
  color: ${props => props.type ? `var(--${props.type}, var(--primary))` : 'var(--primary)'};
  white-space: nowrap;
  
  svg {
    margin-right: 0.35rem;
    font-size: 0.85rem;
  }
  
  .dark-mode & {
    background-color: ${props => props.type ? `var(--${props.type}-dark, rgba(124,58,237,0.2))` : 'rgba(124,58,237,0.2)'};
    opacity: 0.9;
  }
`;

// Schedule tag with improved design
const ScheduleTag = styled(TaskTag)`
  background-color: rgba(0,0,0,0.05);
  color: var(--gray-700);
  
  .dark-mode & {
    background-color: rgba(255,255,255,0.08);
    color: var(--gray-300);
  }
`;

// Improved bell notification toggle
const ReminderToggle = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem; /* Increased size */
  color: ${props => props.isActive ? 'var(--warning)' : 'var(--gray-400)'};
  cursor: pointer;
  margin-right: 1rem; /* Increased margin */
  border-radius: 50%;
  transition: all 300ms ease;
  
  &:hover {
    background-color: rgba(0,0,0,0.05);
    transform: scale(1.1);
    color: ${props => props.isActive ? 'var(--warning)' : 'var(--gray-700)'};
  }
  
  .dark-mode & {
    color: ${props => props.isActive ? 'var(--warning)' : 'var(--gray-500)'};
    
    &:hover {
      background-color: rgba(255,255,255,0.05);
      color: ${props => props.isActive ? 'var(--warning)' : 'var(--gray-300)'};
    }
  }
`;

// Redesigned card expander with better animation
const CardExpander = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: var(--gray-400);
  border-radius: 50%;
  padding: 0.5rem; /* Increased padding */
  font-size: 1.2rem; /* Increased size */
  
  &:hover {
    background-color: rgba(0,0,0,0.05);
    color: var(--gray-700);
  }
  
  .dark-mode & {
    color: var(--gray-500);
    
    &:hover {
      background-color: rgba(255,255,255,0.05);
      color: var(--gray-300);
    }
  }
`;

// Action buttons container for edit/delete
const ActionButtonContainer = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 5;
`;

// Action button for edit/delete
const ActionButton = styled.button`
  background-color: ${props => props.type === 'edit' ? 'var(--primary-light)' : 'var(--error-light)'};
  color: ${props => props.type === 'edit' ? 'var(--primary)' : 'var(--error)'};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(-10px)'};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode & {
    background-color: ${props => props.type === 'edit' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

// Improved card content with better animation and padding
const CardContent = styled.div`
  padding: ${props => props.isExpanded ? '0 2.5rem 2.5rem' : '0 2.5rem'}; /* Increased padding */
  max-height: ${props => props.isExpanded ? '1000px' : '0'};
  opacity: ${props => props.isExpanded ? 1 : 0};
  overflow: hidden;
  transition: all 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
`;

// Feelings input section
const FeelingsSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  .dark-mode & {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.05);
  }
`;

const FeelingsTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  .dark-mode & {
    color: var(--gray-200);
  }
`;

const FeelingsTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  font-size: 0.95rem;
  color: var(--gray-800);
  resize: vertical;
  font-family: inherit;
  transition: all 300ms ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  .dark-mode & {
    background-color: rgba(17, 24, 39, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--gray-200);
  }
`;

// Mood selector component
const MoodSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const MoodButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 300ms ease;
  opacity: ${props => props.selected ? 1 : 0.5};
  transform: ${props => props.selected ? 'scale(1.2)' : 'scale(1)'};
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
  }
`;

// Save button for feelings
const SaveButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: 0.6rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.35rem;
  }
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  .dark-mode & {
    opacity: 0.9;
    
    &:hover {
      opacity: 1;
    }
  }
`;

// Task details with improved layout
const TaskDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Increased column width */
  gap: 1.5rem; /* Increased gap */
  margin-bottom: 2rem; /* Increased margin */
`;

// Improved detail card styling
const DetailCard = styled.div`
  background-color: ${props => props.highlighted ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.02)'};
  border-radius: var(--border-radius-md);
  padding: 1.25rem; /* Increased padding */
  transition: all 300ms ease;
  border: 1px solid ${props => props.highlighted ? 'rgba(124,58,237,0.15)' : 'transparent'};
  
  .dark-mode & {
    background-color: ${props => props.highlighted ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)'};
    border-color: ${props => props.highlighted ? 'rgba(124,58,237,0.25)' : 'transparent'};
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.05);
    
    .dark-mode & {
      box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }
  }
`;

// Improved detail title styling
const DetailTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-500);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
    font-size: 1rem;
  }
  
  .dark-mode & {
    color: var(--gray-400);
  }
`;

// Improved detail content styling
const DetailContent = styled.div`
  font-size: 1.05rem; /* Increased size */
  font-weight: 600;
  color: var(--gray-800);
  
  .dark-mode & {
    color: var(--gray-200);
  }
`;

// Expand indicator with animation
const ExpandIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px; /* Increased height */
  background: linear-gradient(to right,
    ${props => {
      switch(props.type) {
        case 'meditation': return 'var(--secondary), var(--secondary-light)';
        case 'hydration': return '#48CAE4, #bae6fd';
        case 'workout': return '#FB8500, #fed7aa';
        case 'emotion': return '#9D4EDD, #e9d5ff';
        case 'gratitude': return '#4ADE80, #bbf7d0';
        case 'expense': return '#F59E0B, #fef3c7';
        case 'kindness': return '#EC4899, #fbcfe8';
        default: return 'var(--primary), var(--primary-light)';
      }
    }}
  );
  transform-origin: left;
  transform: scaleX(${props => props.isExpanded ? 1 : 0});
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const TaskCard = ({
  id,
  title,
  description,
  type,
  completed,
  onToggleComplete,
  onToggleReminder,
  hasReminder,
  time,
  category,
  deadline,
  createdAt = new Date().toISOString(), // Default value
  priority = 'medium', // Default value
  streak = 0, // Default value
  notes = '', // Default value
  isPrimary = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [particles, setParticles] = useState([]);
  const [pulsing, setPulsing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [userNotes, setUserNotes] = useState(notes);
  const [selectedMood, setSelectedMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const { darkMode } = useAppContext();
  
  // Get content height for smooth animations
  useEffect(() => {
    if (contentRef.current && isExpanded) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }, [isExpanded]);
  
  // 3D hover effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newRotateY = ((x - centerX) / centerX) * 4; // Max 4 degree rotation
    const newRotateX = ((centerY - y) / centerY) * 4; // Max 4 degree rotation
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };
  
  // Reset rotation when not hovering
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setShowActions(false);
  };
  
  // Generate particles on task completion
  const generateParticles = () => {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];
    const newParticles = [];
    
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 0.5 + 0.7
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };
  
  const handleToggleComplete = (e) => {
    e.stopPropagation();
    if (!completed) {
      setPulsing(true);
      generateParticles();
      setTimeout(() => setPulsing(false), 800);
    }
    onToggleComplete(id);
  };
  
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setShowActions(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleSaveNotes = () => {
    // Here you would typically call an API to save the notes
    console.log('Saving notes for task:', id, userNotes, selectedMood);
    // For now we'll just display a success message
    alert('Notes saved successfully!');
  };
  
  const handleEditTask = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsExpanded(true); // Expand the card when editing
  };
  
  const handleDeleteTask = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Here you would typically call an API to delete the task
      console.log('Deleting task:', id);
      // For now we'll just display a success message
      alert('Task deleted successfully!');
    }
  };
  
  const handleSaveEdit = () => {
    // Here you would typically call an API to save the edited task
    console.log('Saving edits for task:', id, editTitle, editDescription);
    // For now we'll just update the local state
    setIsEditing(false);
    // Mock update for demonstration
    alert('Task updated successfully!');
  };
  
  const renderTrackerComponent = () => {
    switch (type) {
      case 'hydration':
        return <HydrationTracker />;
      case 'workout':
        return <WorkoutTracker />;
      case 'gratitude':
        return <GratitudeTracker />;
      case 'expense':
        return <ExpenseTracker />;
      case 'emotion':
        return <EmotionTracker />;
      default:
        return null;
    }
  };
  
  const getCategoryIcon = () => {
    switch (category) {
      case 'morning':
        return <FaSun />;
      case 'afternoon':
        return <FaSun />;
      case 'evening':
        return <FaMoon />;
      case 'all-day':
        return <FaTrophy />;
      default:
        return null;
    }
  };
  
  const getTaskTypeIcon = () => {
    switch (type) {
      case 'hydration':
        return <FaWater />;
      case 'workout':
        return <FaRunning />;
      case 'meditation':
        return <FaMoon />;
      case 'gratitude':
        return <FaRegSmile />;
      case 'expense':
        return <FaClipboard />;
      default:
        return <FaTrophy />;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'var(--error)';
      case 'medium':
        return 'var(--warning)';
      case 'low':
        return 'var(--info)';
      default:
        return 'var(--gray-500)';
    }
  };
  
  // Particle effect for task completion
  const Particle = styled.div`
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.color};
    opacity: 0;
    z-index: 5;
    pointer-events: none;
    transform: translateZ(0);
  `;
  
  // Progress bar for completed tasks
  const ProgressBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: var(--gray-200);
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      background: linear-gradient(90deg, var(--success), var(--success-light), var(--success));
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      transform: translateX(-100%);
      animation-fill-mode: forwards;
    }
    
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  `;
  
  return (
    <Card 
      ref={cardRef}
      type={type} 
      completed={completed} 
      className="slide-up card-3d"
      isHovered={isHovered}
      isExpanded={isExpanded}
      rotateX={rotateX}
      rotateY={rotateY}
      isPrimary={isPrimary}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Particles for completion effect */}
      {particles.map((particle) => (
        <Particle 
          key={particle.id}
          color={particle.color}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `particle-animation ${particle.duration}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        />
      ))}
      
      <style>
        {`
          @keyframes particle-animation {
            0% {
              transform: translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 70 + 30}px, 
                                ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 70 + 30}px) scale(${Math.random() * 0.5 + 0.5});
              opacity: 0;
            }
          }
        `}
      </style>
      
      <CardHeader onClick={!isEditing ? handleToggleExpand : null} isExpanded={isExpanded}>
        <CheckBox 
          completed={completed}
          pulse={pulsing}
          onClick={handleToggleComplete}
        >
          {completed && <FaCheck />}
        </CheckBox>
        
        <TaskInfo>
          {isEditing ? (
            <div style={{ marginBottom: "1rem" }}>
              <input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "var(--border-radius-md)",
                  marginBottom: "0.75rem"
                }}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "var(--border-radius-md)",
                  minHeight: "80px",
                  resize: "vertical"
                }}
              />
              <SaveButton onClick={handleSaveEdit} style={{ marginTop: "1rem" }}>
                Save Changes
              </SaveButton>
            </div>
          ) : (
            <>
              <TaskTitle completed={completed} isPrimary={isPrimary}>{title}</TaskTitle>
              <TaskDescription isExpanded={isExpanded}>{description}</TaskDescription>
              
              <TaskMeta>
                {category && (
                  <TaskTag type={category}>
                    {getCategoryIcon()}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TaskTag>
                )}
                
                {time && (
                  <ScheduleTag>
                    <FaRegClock /> {time}
                  </ScheduleTag>
                )}
                
                {priority && (
                  <TaskTag 
                    style={{ 
                      backgroundColor: `${getPriorityColor()}15`, 
                      color: getPriorityColor()
                    }}
                  >
                    Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </TaskTag>
                )}
              </TaskMeta>
            </>
          )}
        </TaskInfo>
        
        {!isEditing && (
          <>
            <ReminderToggle 
              isActive={hasReminder}
              onClick={(e) => {
                e.stopPropagation();
                onToggleReminder(id);
              }}
              aria-label={hasReminder ? 'Disable reminder' : 'Enable reminder'}
            >
              {hasReminder ? <FaBell /> : <FaBellSlash />}
            </ReminderToggle>
            
            <CardExpander isExpanded={isExpanded}>
              <FaAngleDown />
            </CardExpander>
          </>
        )}
      </CardHeader>
      
      {!isEditing && (
        <ActionButtonContainer>
          <ActionButton 
            type="edit" 
            show={showActions} 
            onClick={handleEditTask}
            aria-label="Edit task"
          >
            <FaPen />
          </ActionButton>
          <ActionButton 
            type="delete" 
            show={showActions} 
            onClick={handleDeleteTask}
            aria-label="Delete task"
          >
            <FaTrash />
          </ActionButton>
        </ActionButtonContainer>
      )}
      
      <CardContent ref={contentRef} isExpanded={isExpanded}>
        {!isEditing && (
          <>
            {/* Task details section */}
            <TaskDetails>
              {deadline && (
                <DetailCard highlighted>
                  <DetailTitle>
                    <FaCalendarDay /> Due Date
                  </DetailTitle>
                  <DetailContent>
                    {new Date(deadline).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </DetailContent>
                </DetailCard>
              )}
              
              <DetailCard>
                <DetailTitle>
                  <FaRegClock /> Created
                </DetailTitle>
                <DetailContent>
                  {formatDate(createdAt)}
                </DetailContent>
              </DetailCard>
              
              {streak > 0 && (
                <DetailCard highlighted>
                  <DetailTitle>
                    <FaTrophy /> Current Streak
                  </DetailTitle>
                  <DetailContent>
                    {streak} {streak === 1 ? 'day' : 'days'}
                  </DetailContent>
                </DetailCard>
              )}
              
              <DetailCard>
                <DetailTitle>
                  {getTaskTypeIcon()} Task Type
                </DetailTitle>
                <DetailContent>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DetailContent>
              </DetailCard>
            </TaskDetails>
            
            {/* User feelings/notes section */}
            <FeelingsSection>
              <FeelingsTitle>
                <FaRegSmile /> How are you feeling about this task?
              </FeelingsTitle>
              
              <FeelingsTextarea 
                placeholder="Add notes or reflections about how you're feeling with this task..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
              />
              
              <MoodSelector>
                <MoodButton 
                  onClick={() => setSelectedMood('happy')} 
                  selected={selectedMood === 'happy'}
                  aria-label="Happy"
                >
                  😊
                </MoodButton>
                <MoodButton 
                  onClick={() => setSelectedMood('neutral')} 
                  selected={selectedMood === 'neutral'}
                  aria-label="Neutral"
                >
                  😐
                </MoodButton>
                <MoodButton 
                  onClick={() => setSelectedMood('frustrated')} 
                  selected={selectedMood === 'frustrated'}
                  aria-label="Frustrated"
                >
                  😣
                </MoodButton>
                <MoodButton 
                  onClick={() => setSelectedMood('accomplished')} 
                  selected={selectedMood === 'accomplished'}
                  aria-label="Accomplished"
                >
                  🎉
                </MoodButton>
              </MoodSelector>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SaveButton onClick={handleSaveNotes}>
                  Save Notes
                </SaveButton>
              </div>
            </FeelingsSection>
            
            {userNotes && selectedMood && (
              <div style={{ 
                margin: '1.5rem 0', 
                padding: '1rem',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '0.95rem',
                fontStyle: 'italic',
                color: 'var(--gray-600)'
              }}>
                <strong>Your notes:</strong> {userNotes} <span style={{ fontSize: '1.2rem' }}>
                  {selectedMood === 'happy' && '😊'}
                  {selectedMood === 'neutral' && '😐'}
                  {selectedMood === 'frustrated' && '😣'}
                  {selectedMood === 'accomplished' && '🎉'}
                </span>
              </div>
            )}
            
            {/* Trackers section */}
            {renderTrackerComponent()}
          </>
        )}
      </CardContent>
      
      {completed && <ProgressBar />}
      <ExpandIndicator type={type} isExpanded={isExpanded} />
    </Card>
  );
};

export default TaskCard; 