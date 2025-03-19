import React, { useState, useEffect } from 'react';
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
  FaTrophy
} from 'react-icons/fa';
import HydrationTracker from './trackers/HydrationTracker';
import WorkoutTracker from './trackers/WorkoutTracker';
import GratitudeTracker from './trackers/GratitudeTracker';
import ExpenseTracker from './trackers/ExpenseTracker';
import EmotionTracker from './trackers/EmotionTracker';

const Card = styled.div`
  background-color: ${props => props.completed ? 'var(--gray-100)' : 'white'};
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1rem;
  overflow: hidden;
  transition: var(--transition);
  border-left: 4px solid ${props => {
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
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.completed ? 'var(--gray-700)' : 'var(--gray-800)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  padding: 1rem;
  align-items: center;
  cursor: pointer;
`;

const CheckBox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? 'var(--success)' : 'var(--gray-400)'};
  background-color: ${props => props.completed ? 'var(--success)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1rem;
  cursor: pointer;
  transition: var(--transition);
`;

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--gray-900);
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const TaskDescription = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const TaskCategory = styled.span`
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

const TaskGroupBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  background-color: ${props => {
    switch(props.taskCategory) {
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
    switch(props.taskCategory) {
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
      switch(props.taskCategory) {
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

const CardDetails = styled.div`
  padding: 0 1rem 1rem;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: max-height 0.5s ease, opacity 0.3s ease;
  overflow: hidden;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  transition: var(--transition);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--primary);
    background: none;
    transform: none;
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
    
    &:hover {
      color: var(--light);
    }
  }
`;

const TaskIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
  color: ${props => {
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
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-500);
  padding: 0.25rem;
  margin-left: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--gray-200);
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
    
    &:hover {
      background-color: var(--gray-700);
      color: var(--light);
    }
  }
`;

const ReminderSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
  
  @media (prefers-color-scheme: dark) {
    border-top-color: var(--gray-700);
  }
`;

const ReminderTitle = styled.h4`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #F59E0B; // Amber
  }
`;

const ReminderInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  width: 100%;
  margin-bottom: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-200);
    border-color: var(--gray-600);
  }
`;

const ReminderButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--secondary);
  }
`;

const RemoveReminderButton = styled.button`
  background-color: var(--gray-200);
  color: var(--gray-700);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--danger-light);
    color: var(--danger);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-300);
    
    &:hover {
      background-color: var(--gray-800);
      color: var(--danger);
    }
  }
`;

const ReminderActions = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveReminder = styled.div`
  background-color: #FFFBEB;
  border: 1px solid #FEF3C7;
  border-radius: var(--border-radius);
  padding: 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (prefers-color-scheme: dark) {
    background-color: #422006;
    border-color: #713F12;
  }
`;

const ReminderTime = styled.span`
  font-weight: 600;
  color: #B45309;
  
  @media (prefers-color-scheme: dark) {
    color: #FCD34D;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  
  &:hover {
    background-color: var(--danger-light);
  }
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: rgba(244, 67, 54, 0.2);
    }
  }
`;

const DeleteTaskButton = styled.button`
  background-color: var(--danger-light);
  color: var(--danger);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--danger);
    color: white;
  }
`;

const getCategoryIcon = (category) => {
  switch (category) {
    case 'morning': return <FaSun />;
    case 'afternoon': return <FaClipboard />;
    case 'evening': return <FaMoon />;
    case 'all-day': return <FaClipboard />;
    default: return <FaClipboard />;
  }
};

const formatReminderTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper to get day from task ID
const getDayFromTaskId = (taskId) => {
  if (!taskId) return null;
  const match = taskId.match(/^day(\d+)_/);
  return match ? parseInt(match[1]) : null;
};

// Helper to get task group display name
const getTaskGroupName = (category) => {
  switch(category) {
    case 'personal_growth': return 'Personal Growth';
    case 'emotional_health': return 'Emotional Health';
    case 'mental_fitness': return 'Mental Fitness';
    case 'physical_health': return 'Physical Health';
    case 'relationships': return 'Relationships';
    case 'social': return 'Social';
    case 'financial': return 'Financial';
    case 'mindfulness': return 'Mindfulness';
    default: return 'Other';
  }
};

const TaskCard = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState('');
  const { dispatch, defaultReminderTimes, taskCategories } = useAppContext();

  const toggleTaskCompletion = () => {
    dispatch({
      type: 'TOGGLE_TASK',
      payload: { 
        taskId: task.id,
        dispatch // Pass the dispatch function to handle the history update
      }
    });
  };

  const handleSetReminder = () => {
    if (!reminderDateTime) return;
    
    dispatch({
      type: 'SET_TASK_REMINDER',
      payload: {
        taskId: task.id,
        reminderTime: new Date(reminderDateTime).toISOString()
      }
    });
    
    // Request notification permission if not already granted
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    setReminderDateTime('');
  };
  
  const handleRemoveReminder = () => {
    dispatch({
      type: 'SET_TASK_REMINDER',
      payload: {
        taskId: task.id,
        reminderTime: null
      }
    });
  };
  
  const handleDeleteTask = () => {
    // Only allow deletion of custom tasks
    if (task.type === 'custom') {
      dispatch({
        type: 'DELETE_TASK',
        payload: {
          taskId: task.id
        }
      });
    }
  };

  const getTaskIcon = () => {
    switch (task.type) {
      case 'hydration':
        return <FaWater />;
      case 'workout':
        return <FaRunning />;
      case 'emotion':
        return <FaRegSmile />;
      default:
        return null;
    }
  };

  // Generate default reminder time based on task category if one is set
  const getDefaultReminderTime = () => {
    if (!task.taskCategory || !defaultReminderTimes) return '';
    
    const timeStr = defaultReminderTimes[task.taskCategory] || '';
    if (!timeStr) return '';
    
    // Create a datetime string with today's date and the default time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${timeStr}`;
  };

  const renderTracker = () => {
    switch (task.type) {
      case 'hydration':
        return <HydrationTracker task={task} />;
      case 'workout':
        return <WorkoutTracker task={task} />;
      case 'gratitude':
        return <GratitudeTracker task={task} />;
      case 'expense':
        return <ExpenseTracker task={task} />;
      case 'emotion':
        return <EmotionTracker task={task} />;
      default:
        return null;
    }
  };

  // Initialize reminderDateTime with default if not set
  useEffect(() => {
    if (!reminderDateTime && isOpen) {
      setReminderDateTime(getDefaultReminderTime());
    }
  }, [isOpen]);

  return (
    <Card completed={task.completed} type={task.type}>
      <CardHeader onClick={() => setIsOpen(!isOpen)}>
        <CheckBox 
          completed={task.completed}
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskCompletion();
          }}
        >
          {task.completed && <FaCheck />}
        </CheckBox>

        {getTaskIcon() && (
          <TaskIcon type={task.type}>
            {getTaskIcon()}
          </TaskIcon>
        )}
        
        <TaskInfo>
          <TaskTitle completed={task.completed}>{task.title}</TaskTitle>
          <TaskDescription>{task.description}</TaskDescription>
          
          <TaskMeta>
            <TaskCategory category={task.category || 'all-day'}>
              {getCategoryIcon(task.category)}
              {" "}
              {task.category === 'all-day' ? 'All Day' : 
               task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </TaskCategory>

            {task.taskCategory && (
              <TaskGroupBadge taskCategory={task.taskCategory}>
                {getTaskGroupName(task.taskCategory)}
              </TaskGroupBadge>
            )}
            
            <TaskPoints>
              <FaTrophy /> {task.points || 10} pts
            </TaskPoints>
          </TaskMeta>
        </TaskInfo>
        
        <ActionButtons>
          {task.reminder && (
            <ActionButton title="Has Reminder">
              <FaBell style={{ color: '#F59E0B' }} />
            </ActionButton>
          )}
          <ExpandButton onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}>
            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
          </ExpandButton>
        </ActionButtons>
      </CardHeader>
      
      <CardDetails isOpen={isOpen}>
        {renderTracker()}
        
        <ReminderSection>
          <ReminderTitle>
            <FaBell /> Set Reminder
          </ReminderTitle>
          
          {task.reminder ? (
            <ActiveReminder>
              <div>
                Reminder set for <ReminderTime>{formatReminderTime(task.reminder)}</ReminderTime>
              </div>
              <RemoveButton onClick={handleRemoveReminder} title="Remove Reminder">
                <FaTimes />
              </RemoveButton>
            </ActiveReminder>
          ) : (
            <>
              <ReminderInput 
                type="datetime-local"
                value={reminderDateTime}
                onChange={(e) => setReminderDateTime(e.target.value)}
              />
              <ReminderActions>
                <ReminderButton onClick={handleSetReminder}>
                  <FaBell /> Set Reminder
                </ReminderButton>
              </ReminderActions>
            </>
          )}
        </ReminderSection>
        
        {task.type === 'custom' && (
          <DeleteTaskButton onClick={handleDeleteTask}>
            <FaTimes /> Remove Custom Task
          </DeleteTaskButton>
        )}
      </CardDetails>
    </Card>
  );
};

export default TaskCard; 