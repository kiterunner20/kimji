import React, { useState } from 'react';
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
  FaPrayingHands
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import DaySelector from '../components/DaySelector';

const HomeContainer = styled.div`
  padding: 1.5rem 0;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
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
`;

const Subheading = styled.p`
  color: var(--gray-600);
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
  
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
  margin-top: 2rem;
`;

const TasksList = styled.div`
  margin-top: 1rem;
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
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
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

const Home = () => {
  const { 
    currentDay, 
    weekPlan, 
    calculateDayScore, 
    dispatch, 
    taskCategories,
    categoryPoints,
    defaultReminderTimes,
    getTasksByCategory
  } = useAppContext();
  
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'all-day',
    taskCategory: taskCategories.PERSONAL_GROWTH,
    points: 10
  });
  
  // State to track open/closed categories
  const [openCategories, setOpenCategories] = useState({
    [taskCategories.PERSONAL_GROWTH]: true,
    [taskCategories.EMOTIONAL_HEALTH]: true,
    [taskCategories.MENTAL_FITNESS]: true,
    [taskCategories.PHYSICAL_HEALTH]: true,
    [taskCategories.RELATIONSHIPS]: false,
    [taskCategories.SOCIAL]: false,
    [taskCategories.FINANCIAL]: false,
    [taskCategories.MINDFULNESS]: false,
    custom: false
  });
  
  // Toggle category expanded/collapsed
  const toggleCategory = (category) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category]
    });
  };
  
  // Get current day's data
  const todayPlan = weekPlan ? weekPlan.find(day => day.day === currentDay) : null;
  
  // Calculate score for today
  const dayScore = todayPlan ? calculateDayScore(todayPlan) : { score: 0, total: 0, percentage: 0, categories: [] };
  
  // Get upcoming task (first incomplete task)
  const getUpcomingTask = () => {
    if (!todayPlan) return null;
    
    return todayPlan.tasks.find(task => !task.completed);
  };
  
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    dispatch({
      type: 'ADD_CUSTOM_TASK',
      payload: {
        ...newTask,
        day: currentDay
      }
    });
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      category: 'all-day',
      taskCategory: taskCategories.PERSONAL_GROWTH,
      points: 10
    });
    
    // Hide form
    setShowAddTaskForm(false);
    
    // Ensure the custom tasks category is expanded
    setOpenCategories({
      ...openCategories,
      custom: true
    });
  };
  
  // Get custom tasks
  const getCustomTasks = () => {
    if (!todayPlan) return [];
    return todayPlan.tasks.filter(task => task.type === "custom");
  };
  
  const upcomingTask = getUpcomingTask();
  const customTasks = getCustomTasks();
  
  // Get categories that have tasks
  const getCategories = () => {
    if (!todayPlan) return [];
    
    // Get all unique categories
    const categories = [...new Set(todayPlan.tasks.map(task => task.taskCategory || 'custom'))];
    
    // Sort categories in the desired order
    const categoryOrder = [
      taskCategories.PERSONAL_GROWTH,
      taskCategories.EMOTIONAL_HEALTH,
      taskCategories.MENTAL_FITNESS,
      taskCategories.PHYSICAL_HEALTH,
      taskCategories.RELATIONSHIPS,
      taskCategories.SOCIAL,
      taskCategories.FINANCIAL,
      taskCategories.MINDFULNESS,
      'custom'
    ];
    
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      return indexA - indexB;
    });
  };
  
  const categories = getCategories();
  
  return (
    <HomeContainer>
      <WelcomeSection>
        <Greeting>Welcome to TransformWeek</Greeting>
        <Subheading>
          Your 7-day journey to build healthy habits and transform your life, one day at a time.
        </Subheading>
      </WelcomeSection>
      
      <DaySelector />
      
      {todayPlan && (
        <>
          <DayTitle>Day {currentDay}: {todayPlan.title}</DayTitle>
          
          <StatsCards>
            <StatCard>
              <StatIcon color="#4ADE80">
                <FaCheck />
              </StatIcon>
              <StatValue>{dayScore.percentage}%</StatValue>
              <StatLabel>Completion</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon color="#F59E0B">
                <FaTrophy />
              </StatIcon>
              <StatValue>{dayScore.score}/{dayScore.total}</StatValue>
              <StatLabel>Points Earned</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon color="#4F46E5">
                <FaRegClock />
              </StatIcon>
              <StatValue>{todayPlan.tasks.length - todayPlan.tasks.filter(t => t.completed).length}</StatValue>
              <StatLabel>Tasks Remaining</StatLabel>
            </StatCard>
          </StatsCards>
          
          <ProgressBar>
            <ProgressFill percent={dayScore.percentage} />
          </ProgressBar>
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Subheading>
              {dayScore.percentage === 100 
                ? 'Amazing! You\'ve completed all tasks for today.' 
                : `${dayScore.percentage}% complete - Keep going!`}
            </Subheading>
          </div>
          
          {upcomingTask && (
            <Reminder>
              <ReminderIcon>
                <FaBell />
              </ReminderIcon>
              <ReminderText>
                <p>Next up: {upcomingTask.title}</p>
                <small>{upcomingTask.description}</small>
              </ReminderText>
            </Reminder>
          )}
          
          {showAddTaskForm ? (
            <AddTaskForm>
              <FormTitle>
                <FaPlus /> Add Custom Task
              </FormTitle>
              
              <FormGroup>
                <Label htmlFor="taskTitle">Task Title *</Label>
                <Input 
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g., Read 20 pages"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="taskDescription">Description (Optional)</Label>
                <TextArea 
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Describe your task..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="taskCategory">Time of Day</Label>
                <Select 
                  id="taskCategory"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="all-day">All Day</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="taskType">Task Category</Label>
                <Select 
                  id="taskType"
                  value={newTask.taskCategory}
                  onChange={(e) => setNewTask({...newTask, taskCategory: e.target.value})}
                >
                  <option value={taskCategories.PERSONAL_GROWTH}>Personal Growth</option>
                  <option value={taskCategories.EMOTIONAL_HEALTH}>Emotional Health</option>
                  <option value={taskCategories.MENTAL_FITNESS}>Mental Fitness</option>
                  <option value={taskCategories.PHYSICAL_HEALTH}>Physical Health</option>
                  <option value={taskCategories.RELATIONSHIPS}>Relationships</option>
                  <option value={taskCategories.SOCIAL}>Social & Communication</option>
                  <option value={taskCategories.FINANCIAL}>Financial Wellness</option>
                  <option value={taskCategories.MINDFULNESS}>Mindfulness</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="taskPoints">Task Points ({newTask.points})</Label>
                <PointsRange>
                  <RangeInput 
                    type="range"
                    id="taskPoints"
                    min="5"
                    max="30"
                    step="5"
                    value={newTask.points}
                    onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value)})}
                  />
                  <PointsValue>{newTask.points} pts</PointsValue>
                </PointsRange>
              </FormGroup>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <AddButton 
                  onClick={handleAddTask}
                  disabled={!newTask.title.trim()}
                >
                  <FaPlus /> Add Task
                </AddButton>
                <AddButton 
                  style={{ backgroundColor: 'var(--gray-300)', color: 'var(--gray-700)' }}
                  onClick={() => setShowAddTaskForm(false)}
                >
                  Cancel
                </AddButton>
              </div>
            </AddTaskForm>
          ) : (
            <ToggleFormButton onClick={() => setShowAddTaskForm(true)}>
              <FaPlus /> Add Custom Task
            </ToggleFormButton>
          )}
          
          <TasksSection>
            {categories.map(category => {
              // Skip empty categories
              const categoryTasks = category === 'custom' 
                ? customTasks 
                : getTasksByCategory(todayPlan, category);
              
              if (categoryTasks.length === 0) return null;
              
              // Find this category in the day score
              const categoryScore = dayScore.categories.find(c => c.category === category) || {
                earned: 0,
                total: 0,
                percentage: 0
              };
              
              return (
                <CategorySection key={category}>
                  <CategoryHeader 
                    isOpen={openCategories[category]} 
                    category={category}
                    onClick={() => toggleCategory(category)}
                  >
                    <CategoryInfo>
                      <CategoryIcon category={category}>
                        {getCategoryIcon(category)}
                      </CategoryIcon>
                      <div>
                        <CategoryTitle>{getCategoryDisplayName(category)}</CategoryTitle>
                        <CategoryProgress>
                          {categoryScore.earned}/{categoryScore.total} points
                          <CategoryBadge 
                            completed={categoryScore.percentage === 100}
                          >
                            {categoryTasks.filter(t => t.completed).length}/{categoryTasks.length}
                          </CategoryBadge>
                        </CategoryProgress>
                        <CategoryProgressBar>
                          <CategoryProgressFill 
                            percent={categoryScore.percentage}
                            category={category}
                          />
                        </CategoryProgressBar>
                      </div>
                    </CategoryInfo>
                    <ExpandButton>
                      {openCategories[category] ? <FaChevronUp /> : <FaChevronDown />}
                    </ExpandButton>
                  </CategoryHeader>
                  
                  <CategoryContent isOpen={openCategories[category]}>
                    {categoryTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </CategoryContent>
                </CategorySection>
              );
            })}
          </TasksSection>
        </>
      )}
      
      {!todayPlan && (
        <EmptyState>
          <h3>No tasks found for today</h3>
          <p>Please select a different day or check back later.</p>
        </EmptyState>
      )}
    </HomeContainer>
  );
};

export default Home; 