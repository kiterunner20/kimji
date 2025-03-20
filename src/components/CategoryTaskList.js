import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaGraduationCap,
  FaHeartbeat,
  FaBrain,
  FaUsers,
  FaMoneyBillWave,
  FaPrayingHands,
  FaSmile,
  FaCheck
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

// Styled Components
const CategoryContainer = styled.div`
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: ${props => props.backgroundColor || '#f0f4ff'};
  cursor: pointer;
  border-radius: 12px;
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .dark-mode & {
    h3 {
      color: #eee;
    }
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.iconBgColor || '#6366F1'};
  color: white;
  
  svg {
    font-size: 16px;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  span {
    font-size: 14px;
    color: #666;
  }
  
  .dark-mode & {
    span {
      color: #ccc;
    }
  }
`;

const TasksContainer = styled.div`
  padding: ${props => props.isOpen ? '15px 0 0 0' : '0'};
  max-height: ${props => props.isOpen ? '1500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  
  .dark-mode & {
    border-bottom: 1px solid #333;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TaskCheckbox = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? 'var(--success)' : '#ddd'};
  background-color: ${props => props.completed ? 'var(--success)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  margin-right: 15px;
  margin-top: 2px;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h4`
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.completed ? '#999' : '#333'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  
  .dark-mode & {
    color: ${props => props.completed ? '#777' : '#eee'};
  }
`;

const TaskDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.completed ? '#999' : '#666'};
  
  .dark-mode & {
    color: ${props => props.completed ? '#777' : '#bbb'};
  }
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  &.time-tag {
    background-color: ${props => {
      if (props.time === 'Morning') return '#e8f5e9';
      if (props.time === 'Afternoon') return '#fff8e1';
      if (props.time === 'Evening') return '#e8eaf6';
      return '#f5f5f5';
    }};
    color: ${props => {
      if (props.time === 'Morning') return '#2e7d32';
      if (props.time === 'Afternoon') return '#ff8f00';
      if (props.time === 'Evening') return '#3949ab';
      return '#616161';
    }};
  }
  
  &.category-tag {
    background-color: #f0f4ff;
    color: #5a67d8;
  }
  
  &.points-tag {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .dark-mode & {
    &.time-tag {
      background-color: ${props => {
        if (props.time === 'Morning') return 'rgba(46, 125, 50, 0.2)';
        if (props.time === 'Afternoon') return 'rgba(255, 143, 0, 0.2)';
        if (props.time === 'Evening') return 'rgba(57, 73, 171, 0.2)';
        return 'rgba(97, 97, 97, 0.2)';
      }};
    }
    
    &.category-tag {
      background-color: rgba(90, 103, 216, 0.2);
    }
    
    &.points-tag {
      background-color: rgba(46, 125, 50, 0.2);
    }
  }
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
      return <FaGraduationCap />;
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
      return <FaPrayingHands />;
    default:
      return <FaGraduationCap />;
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

// Main Component
const CategoryTaskList = ({ selectedDay }) => {
  console.log('CategoryTaskList rendering with selectedDay:', selectedDay);
  
  // Always call hooks at the top level, before any conditionals
  const [openCategories, setOpenCategories] = useState([]);
  
  const context = useAppContext();
  console.log('Context received in CategoryTaskList:', context);
  
  // Super defensive check for missing context or context properties
  if (!context) {
    console.error('No context available in CategoryTaskList');
    return <div>Error: App context not available</div>;
  }
  
  // Extract required properties from context with fallbacks
  const weekPlan = context.weekPlan || [];
  const dispatch = context.dispatch || (() => console.error('Dispatch not available'));
  
  console.log('weekPlan from context:', weekPlan);
  
  // Toggle category expanded/collapsed state
  const toggleCategory = (category) => {
    if (openCategories.includes(category)) {
      setOpenCategories(openCategories.filter(cat => cat !== category));
    } else {
      setOpenCategories([...openCategories, category]);
    }
  };
  
  // Handle task completion toggle - try both action types
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
  
  // Get all tasks for the selected day grouped by category
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
    
    dayData.tasks.forEach(task => {
      if (!task) return;
      
      const category = task.taskCategory || 'uncategorized';
      
      if (!tasksByCategory[category]) {
        tasksByCategory[category] = [];
      }
      
      tasksByCategory[category].push(task);
    });
    
    return tasksByCategory;
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
  
  const tasksByCategory = getTasksByCategory();
  const categories = Object.keys(tasksByCategory);
  
  console.log('Categories found:', categories);
  
  // If no categories are found, show a message
  if (categories.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: 'var(--gray-500)',
        backgroundColor: 'var(--gray-50)',
        borderRadius: '8px',
        marginTop: '16px'
      }}>
        No tasks found for day {selectedDay}. Try selecting a different day or adding custom tasks.
      </div>
    );
  }
  
  return (
    <div>
      {categories.map(category => {
        const tasks = tasksByCategory[category] || [];
        
        // Skip rendering if no tasks
        if (tasks.length === 0) return null;
        
        const { completed, total } = getCategoryCompletion(tasks);
        const points = getCategoryPoints(tasks);
        const isOpen = openCategories.includes(category);
        
        return (
          <CategoryContainer key={category}>
            <CategoryHeader 
              backgroundColor={getCategoryBackgroundColor(category)}
              onClick={() => toggleCategory(category)}
            >
              <CategoryTitle>
                <CategoryIcon iconBgColor={getCategoryIconBackgroundColor(category)}>
                  {getCategoryIcon(category)}
                </CategoryIcon>
                <h3>{formatCategoryName(category)}</h3>
              </CategoryTitle>
              
              <CategoryInfo>
                <span>{points.earned}/{points.total} points</span>
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
                
                return (
                  <TaskItem key={task.id}>
                    <TaskCheckbox 
                      completed={Boolean(task.completed)}
                      onClick={() => handleTaskComplete(task.id, task.completed)}
                    >
                      {task.completed && <FaCheck />}
                    </TaskCheckbox>
                    
                    <TaskContent>
                      <TaskTitle completed={Boolean(task.completed)}>{task.title || 'Unnamed Task'}</TaskTitle>
                      <TaskDescription completed={Boolean(task.completed)}>{task.description || ''}</TaskDescription>
                      
                      <TaskTags>
                        <Tag className="time-tag" time={getTaskTimeOfDay(task.category)}>
                          {getTaskTimeOfDay(task.category)}
                        </Tag>
                        <Tag className="category-tag">
                          {formatCategoryName(category)}
                        </Tag>
                        <Tag className="points-tag">
                          {task.points || 0} pts
                        </Tag>
                      </TaskTags>
                    </TaskContent>
                  </TaskItem>
                );
              })}
            </TasksContainer>
          </CategoryContainer>
        );
      })}
    </div>
  );
};

export default CategoryTaskList; 