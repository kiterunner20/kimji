import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaCalendarAlt, 
  FaChartLine, 
  FaCheck, 
  FaCheckCircle,
  FaGraduationCap,
  FaHeartbeat,
  FaBrain,
  FaRunning,
  FaUsers,
  FaComments,
  FaMoneyBillWave,
  FaPrayingHands
} from 'react-icons/fa';

const ProgressContainer = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ProgressTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const ViewSelector = styled.div`
  display: flex;
  background-color: var(--gray-100);
  border-radius: 2rem;
  padding: 0.25rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const ViewButton = styled.button`
  background-color: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--gray-600)'};
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: ${props => props.active ? 'var(--box-shadow-sm)' : 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.active ? 'var(--primary)' : 'var(--gray-800)'};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.active ? 'var(--gray-900)' : 'transparent'};
    
    &:hover {
      color: ${props => props.active ? 'var(--primary)' : 'var(--gray-300)'};
    }
  }
`;

const ProgressContent = styled.div`
  margin-top: 1.5rem;
`;

const WeeklyProgress = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const WeekCard = styled.div`
  background-color: ${props => props.active ? 'var(--primary-light)' : 'var(--gray-100)'};
  border-radius: var(--border-radius);
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--box-shadow);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--gray-700)'};
  }
`;

const WeekTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: ${props => props.active ? 'var(--primary)' : 'var(--gray-800)'};
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (prefers-color-scheme: dark) {
    color: ${props => props.active ? 'var(--primary)' : 'var(--gray-200)'};
  }
`;

const WeekProgress = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.active ? 'rgba(255,255,255,0.3)' : 'var(--gray-200)'};
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.active ? 'rgba(255,255,255,0.1)' : 'var(--gray-600)'};
  }
`;

const WeekProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => {
    if (props.percent >= 80) return 'var(--success)';
    if (props.percent >= 40) return 'var(--warning)';
    return 'var(--primary)';
  }};
  transition: width 0.3s ease;
`;

const WeekStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
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

const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-400)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: var(--box-shadow);
`;

const Milestone = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: var(--box-shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--box-shadow);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const MilestoneIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.completed ? 'var(--success-light)' : 'var(--gray-200)'};
  color: ${props => props.completed ? 'var(--success)' : 'var(--gray-500)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.completed ? 'var(--success-dark)' : 'var(--gray-700)'};
    color: ${props => props.completed ? 'var(--success)' : 'var(--gray-400)'};
  }
`;

const MilestoneContent = styled.div`
  flex: 1;
`;

const MilestoneTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
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

const MilestoneStatus = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: ${props => props.completed ? 'var(--success)' : 'var(--gray-500)'};
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CategoryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const CategoryCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow-sm);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${props => {
      switch(props.category) {
        case 'personal_growth': return 'var(--indigo)';
        case 'emotional_health': return 'var(--pink)';
        case 'mental_fitness': return 'var(--emerald)';
        case 'physical_health': return 'var(--red)';
        case 'relationships': return 'var(--amber)';
        case 'social': return 'var(--blue)';
        case 'financial': return 'var(--purple)';
        case 'mindfulness': return 'var(--violet)';
        default: return 'var(--gray-400)';
      }
    }};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const CategoryTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--gray-900);
  
  svg {
    margin-right: 0.5rem;
    color: ${props => {
      switch(props.category) {
        case 'personal_growth': return 'var(--indigo)';
        case 'emotional_health': return 'var(--pink)';
        case 'mental_fitness': return 'var(--emerald)';
        case 'physical_health': return 'var(--red)';
        case 'relationships': return 'var(--amber)';
        case 'social': return 'var(--blue)';
        case 'financial': return 'var(--purple)';
        case 'mindfulness': return 'var(--violet)';
        default: return 'var(--gray-400)';
      }
    }};
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const CategoryProgress = styled.div`
  width: 100%;
  height: 6px;
  background-color: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const CategoryProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => {
    switch(props.category) {
      case 'personal_growth': return 'var(--indigo)';
      case 'emotional_health': return 'var(--pink)';
      case 'mental_fitness': return 'var(--emerald)';
      case 'physical_health': return 'var(--red)';
      case 'relationships': return 'var(--amber)';
      case 'social': return 'var(--blue)';
      case 'financial': return 'var(--purple)';
      case 'mindfulness': return 'var(--violet)';
      default: return 'var(--primary)';
    }
  }};
`;

const CategoryStats2 = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const Progress = () => {
  const { 
    weekPlan, 
    currentDay, 
    calculateDayScore, 
    taskCategories,
    categoryScores 
  } = useAppContext();
  
  const [view, setView] = useState('week');
  
  // Calculate current week (1, 2, or 3)
  const currentWeek = Math.ceil(currentDay / 7);
  
  // Calculate completion percentage for each week
  const calculateWeekCompletion = (weekNum) => {
    if (!weekPlan) return 0;
    
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(weekNum * 7, 21);
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    for (let day = startDay; day <= endDay; day++) {
      const dayPlan = weekPlan.find(d => d.day === day);
      if (dayPlan) {
        totalTasks += dayPlan.tasks.length;
        completedTasks += dayPlan.tasks.filter(task => task.completed).length;
      }
    }
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // Calculate the total completion percentage
  const calculateTotalCompletion = () => {
    if (!weekPlan) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    weekPlan.forEach(day => {
      totalTasks += day.tasks.length;
      completedTasks += day.tasks.filter(task => task.completed).length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // Calculate category completion percentage
  const calculateCategoryCompletion = (category) => {
    if (!weekPlan) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    weekPlan.forEach(day => {
      const categoryTasks = day.tasks.filter(task => task.taskCategory === category);
      totalTasks += categoryTasks.length;
      completedTasks += categoryTasks.filter(task => task.completed).length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // Define milestones
  const milestones = [
    {
      id: 'week1',
      title: 'Week 1 Completion',
      description: 'Complete all tasks in the first week',
      icon: <FaMedal />,
      isCompleted: calculateWeekCompletion(1) === 100,
      day: 7
    },
    {
      id: 'week2',
      title: 'Week 2 Mastery',
      description: 'Complete all tasks in the second week',
      icon: <FaStar />,
      isCompleted: calculateWeekCompletion(2) === 100,
      day: 14
    },
    {
      id: 'week3',
      title: '21-Day Challenge',
      description: 'Complete the full 21-day transformation',
      icon: <FaTrophy />,
      isCompleted: calculateWeekCompletion(3) === 100 && calculateWeekCompletion(2) === 100 && calculateWeekCompletion(1) === 100,
      day: 21
    },
    {
      id: 'physical',
      title: 'Physical Health Master',
      description: 'Complete all physical health tasks',
      icon: <FaRunning />,
      isCompleted: calculateCategoryCompletion(taskCategories.PHYSICAL_HEALTH) === 100,
      category: taskCategories.PHYSICAL_HEALTH
    },
    {
      id: 'mental',
      title: 'Mental Fitness Expert',
      description: 'Complete all mental fitness tasks',
      icon: <FaBrain />,
      isCompleted: calculateCategoryCompletion(taskCategories.MENTAL_FITNESS) === 100,
      category: taskCategories.MENTAL_FITNESS
    },
    {
      id: 'relationships',
      title: 'Relationship Builder',
      description: 'Complete all relationship tasks',
      icon: <FaUsers />,
      isCompleted: calculateCategoryCompletion(taskCategories.RELATIONSHIPS) === 100,
      category: taskCategories.RELATIONSHIPS
    }
  ];
  
  // Get milestone for current day
  const currentMilestone = milestones.find(m => m.day === currentDay);
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case taskCategories.PERSONAL_GROWTH:
        return <FaGraduationCap />;
      case taskCategories.EMOTIONAL_HEALTH:
        return <FaHeartbeat />;
      case taskCategories.MENTAL_FITNESS:
        return <FaBrain />;
      case taskCategories.PHYSICAL_HEALTH:
        return <FaRunning />;
      case taskCategories.RELATIONSHIPS:
        return <FaUsers />;
      case taskCategories.SOCIAL:
        return <FaComments />;
      case taskCategories.FINANCIAL:
        return <FaMoneyBillWave />;
      case taskCategories.MINDFULNESS:
        return <FaPrayingHands />;
      default:
        return <FaStar />;
    }
  };
  
  const week1Completion = calculateWeekCompletion(1);
  const week2Completion = calculateWeekCompletion(2);
  const week3Completion = calculateWeekCompletion(3);
  const totalCompletion = calculateTotalCompletion();
  
  return (
    <ProgressContainer>
      <ProgressHeader>
        <ProgressTitle>Progress Tracker</ProgressTitle>
        <ViewSelector>
          <ViewButton 
            active={view === 'week'} 
            onClick={() => setView('week')}
          >
            Weekly
          </ViewButton>
          <ViewButton 
            active={view === 'category'} 
            onClick={() => setView('category')}
          >
            Categories
          </ViewButton>
          <ViewButton 
            active={view === 'milestone'} 
            onClick={() => setView('milestone')}
          >
            Milestones
          </ViewButton>
        </ViewSelector>
      </ProgressHeader>
      
      {view === 'week' && (
        <ProgressContent>
          <WeeklyProgress>
            <WeekCard active={currentWeek === 1}>
              <WeekTitle active={currentWeek === 1}>
                <FaCalendarAlt /> Week 1: Foundation
              </WeekTitle>
              <WeekProgress active={currentWeek === 1}>
                <WeekProgressFill percent={week1Completion} />
              </WeekProgress>
              <WeekStats>
                <Stat>
                  <StatValue>{week1Completion}%</StatValue>
                  <StatLabel>Completed</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>Days 1-7</StatValue>
                  <StatLabel>Range</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{week1Completion === 100 ? 'Yes' : 'No'}</StatValue>
                  <StatLabel>Finished</StatLabel>
                </Stat>
              </WeekStats>
              {week1Completion === 100 && (
                <Badge completed><FaCheck /></Badge>
              )}
            </WeekCard>
            
            <WeekCard active={currentWeek === 2}>
              <WeekTitle active={currentWeek === 2}>
                <FaCalendarAlt /> Week 2: Expansion
              </WeekTitle>
              <WeekProgress active={currentWeek === 2}>
                <WeekProgressFill percent={week2Completion} />
              </WeekProgress>
              <WeekStats>
                <Stat>
                  <StatValue>{week2Completion}%</StatValue>
                  <StatLabel>Completed</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>Days 8-14</StatValue>
                  <StatLabel>Range</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{week2Completion === 100 ? 'Yes' : 'No'}</StatValue>
                  <StatLabel>Finished</StatLabel>
                </Stat>
              </WeekStats>
              {week2Completion === 100 && (
                <Badge completed><FaCheck /></Badge>
              )}
            </WeekCard>
            
            <WeekCard active={currentWeek === 3}>
              <WeekTitle active={currentWeek === 3}>
                <FaCalendarAlt /> Week 3: Mastery
              </WeekTitle>
              <WeekProgress active={currentWeek === 3}>
                <WeekProgressFill percent={week3Completion} />
              </WeekProgress>
              <WeekStats>
                <Stat>
                  <StatValue>{week3Completion}%</StatValue>
                  <StatLabel>Completed</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>Days 15-21</StatValue>
                  <StatLabel>Range</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{week3Completion === 100 ? 'Yes' : 'No'}</StatValue>
                  <StatLabel>Finished</StatLabel>
                </Stat>
              </WeekStats>
              {week3Completion === 100 && (
                <Badge completed><FaCheck /></Badge>
              )}
            </WeekCard>
          </WeeklyProgress>
          
          {/* Show current day milestone if available */}
          {currentMilestone && (
            <Milestone>
              <MilestoneIcon completed={currentMilestone.isCompleted}>
                {currentMilestone.icon}
              </MilestoneIcon>
              <MilestoneContent>
                <MilestoneTitle>{currentMilestone.title}</MilestoneTitle>
                <MilestoneDescription>{currentMilestone.description}</MilestoneDescription>
              </MilestoneContent>
              <MilestoneStatus completed={currentMilestone.isCompleted}>
                {currentMilestone.isCompleted ? <><FaCheckCircle /> Achieved</> : 'In Progress'}
              </MilestoneStatus>
            </Milestone>
          )}
          
          {/* Overall progress bar */}
          <ProgressContainer>
            <ProgressTitle>Total Progress: {totalCompletion}%</ProgressTitle>
            <WeekProgress>
              <WeekProgressFill percent={totalCompletion} />
            </WeekProgress>
          </ProgressContainer>
        </ProgressContent>
      )}
      
      {view === 'category' && (
        <ProgressContent>
          <CategoryStats>
            {Object.values(taskCategories).map(category => (
              <CategoryCard key={category} category={category}>
                <CategoryTitle category={category}>
                  {getCategoryIcon(category)}
                  {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </CategoryTitle>
                <CategoryProgress>
                  <CategoryProgressFill 
                    percent={calculateCategoryCompletion(category)} 
                    category={category} 
                  />
                </CategoryProgress>
                <CategoryStats2>
                  <div>{calculateCategoryCompletion(category)}% Complete</div>
                  <div>Points: {categoryScores[category] || 0}</div>
                </CategoryStats2>
              </CategoryCard>
            ))}
          </CategoryStats>
        </ProgressContent>
      )}
      
      {view === 'milestone' && (
        <ProgressContent>
          {milestones.map(milestone => (
            <Milestone key={milestone.id}>
              <MilestoneIcon completed={milestone.isCompleted}>
                {milestone.icon}
              </MilestoneIcon>
              <MilestoneContent>
                <MilestoneTitle>{milestone.title}</MilestoneTitle>
                <MilestoneDescription>{milestone.description}</MilestoneDescription>
              </MilestoneContent>
              <MilestoneStatus completed={milestone.isCompleted}>
                {milestone.isCompleted ? <><FaCheckCircle /> Achieved</> : 'In Progress'}
              </MilestoneStatus>
            </Milestone>
          ))}
        </ProgressContent>
      )}
    </ProgressContainer>
  );
};

export default Progress; 