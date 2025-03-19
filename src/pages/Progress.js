import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { 
  FaCheckCircle, 
  FaTrophy, 
  FaWater, 
  FaRunning, 
  FaRegSmile, 
  FaHistory,
  FaGraduationCap,
  FaHeartbeat,
  FaBrain,
  FaUsers,
  FaComments,
  FaMoneyBillWave,
  FaPrayingHands,
  FaCheck,
  FaChartLine,
  FaMedal
} from 'react-icons/fa';

const ProgressContainer = styled.div`
  padding: 1.5rem 0;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const Subheading = styled.p`
  color: var(--gray-600);
  font-size: 1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.color || 'var(--primary)'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProgressCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const ProgressTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--gray-800);
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: 0.5rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
    border-bottom-color: var(--gray-700);
  }
`;

const DayProgress = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DayNumber = styled.div`
  width: 35px;
  font-weight: 600;
  color: var(--gray-700);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: var(--gray-200);
  border-radius: 4px;
  margin: 0 0.5rem;
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

const ProgressValue = styled.div`
  width: 60px;
  font-size: 0.85rem;
  text-align: right;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const ActivityTable = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const TableTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: var(--gray-100);
  
  th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    color: var(--gray-700);
    font-size: 0.9rem;
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    
    th {
      color: var(--gray-300);
    }
  }
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: var(--gray-50);
  }
  
  td {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--gray-200);
    color: var(--gray-800);
    font-size: 0.9rem;
  }
  
  @media (prefers-color-scheme: dark) {
    tr:nth-child(even) {
      background-color: var(--gray-750);
    }
    
    td {
      border-top-color: var(--gray-700);
      color: var(--gray-300);
    }
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryHeader = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.color || 'var(--primary)'};
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  border-left: 4px solid ${props => props.color || 'var(--primary)'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.color || 'var(--primary)'};
  color: white;
  margin-right: 0.75rem;
`;

const CategoryName = styled.h4`
  font-size: 1rem;
  margin: 0;
  color: var(--gray-800);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const CategoryProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--gray-200);
  border-radius: 4px;
  margin-bottom: 0.75rem;
  overflow: hidden;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const CategoryProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => props.color || 'var(--primary)'};
  transition: width 0.3s ease;
`;

const CategoryStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryValue = styled.div`
  font-size: 0.9rem;
  color: var(--gray-700);
  font-weight: 600;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const CategoryBadge = styled.div`
  background-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-200)'};
  color: ${props => props.completed ? 'white' : 'var(--gray-700)'};
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.completed ? 'var(--success)' : 'var(--gray-700)'};
    color: ${props => props.completed ? 'white' : 'var(--gray-400)'};
  }
`;

const RadarChartSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const BalanceTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const LifeAreaCard = styled.div`
  padding: 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  text-align: center;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const LifeAreaIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color || 'var(--primary)'};
  margin-bottom: 0.5rem;
`;

const LifeAreaValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const LifeAreaName = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const AchievementsSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const AchievementCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const AchievementIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color || 'var(--primary)'};
  background-color: ${props => `rgba(${props.colorRgb || '79, 70, 229'}, 0.1)`};
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => `rgba(${props.colorRgb || '79, 70, 229'}, 0.2)`};
  }
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementName = styled.div`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const AchievementDescription = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

// Helper function to get category icon
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

// Helper function to get category display name
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
    default: return 'Other';
  }
};

// Helper function to get category color
const getCategoryColor = (category) => {
  switch(category) {
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
};

// Helper function to get RGB values for categories (for transparent backgrounds)
const getCategoryColorRgb = (category) => {
  switch(category) {
    case 'personal_growth': return '79, 70, 229';
    case 'emotional_health': return '236, 72, 153';
    case 'mental_fitness': return '16, 185, 129';
    case 'physical_health': return '239, 68, 68';
    case 'relationships': return '245, 158, 11';
    case 'social': return '59, 130, 246';
    case 'financial': return '139, 92, 246';
    case 'mindfulness': return '91, 33, 182';
    default: return '79, 70, 229';
  }
};

const Progress = () => {
  const { weekPlan, taskHistory, calculateDayScore, categoryScores, taskCategories } = useAppContext();
  
  // Calculate total completed tasks
  const calculateTotalCompletedTasks = () => {
    if (!weekPlan) return 0;
    
    return weekPlan.reduce((total, day) => {
      return total + day.tasks.filter(task => task.completed).length;
    }, 0);
  };
  
  // Calculate total tasks
  const calculateTotalTasks = () => {
    if (!weekPlan) return 0;
    
    return weekPlan.reduce((total, day) => {
      return total + day.tasks.length;
    }, 0);
  };
  
  // Get day completion percentage
  const getDayCompletionPercentage = (day) => {
    if (!weekPlan) return 0;
    
    const dayPlan = weekPlan.find(d => d.day === day);
    if (!dayPlan) return 0;
    
    const dayScore = calculateDayScore(dayPlan);
    return dayScore.percentage;
  };
  
  // Calculate current streak
  const calculateStreak = () => {
    if (!weekPlan) return 0;
    
    let streak = 0;
    
    for (let i = 1; i <= 7; i++) {
      const dayPlan = weekPlan.find(d => d.day === i);
      if (!dayPlan) continue;
      
      const completedAll = dayPlan.tasks.every(task => task.completed);
      
      if (completedAll) {
        streak++;
      } else {
        // Break the streak if the current day is not fully completed
        // but only if we have tasks for that day already
        if (dayPlan.tasks.some(task => !task.completed)) {
          break;
        }
      }
    }
    
    return streak;
  };
  
  // Calculate total points
  const calculateTotalPoints = () => {
    if (!taskHistory) return 0;
    
    return taskHistory.reduce((total, entry) => {
      return total + (entry.points || 0);
    }, 0);
  };
  
  // Calculate max possible points
  const calculateMaxPossiblePoints = () => {
    if (!weekPlan) return 0;
    
    return weekPlan.reduce((total, day) => {
      return total + day.tasks.reduce((dayTotal, task) => {
        return dayTotal + (task.points || 0);
      }, 0);
    }, 0);
  };
  
  // Calculate total water intake
  const calculateTotalWaterIntake = () => {
    if (!weekPlan) return 0;
    
    return weekPlan.reduce((total, day) => {
      const waterTasks = day.tasks.filter(task => task.type === 'hydration');
      return total + waterTasks.reduce((taskTotal, task) => {
        return taskTotal + (task.count || 0);
      }, 0);
    }, 0);
  };
  
  // Calculate total workout minutes
  const calculateTotalWorkoutMinutes = () => {
    if (!weekPlan) return 0;
    
    return weekPlan.reduce((total, day) => {
      const workoutTasks = day.tasks.filter(task => task.type === 'workout');
      return total + workoutTasks.reduce((taskTotal, task) => {
        return taskTotal + (task.duration || 0);
      }, 0);
    }, 0);
  };

  // Calculate average mood
  const calculateAverageMood = () => {
    if (!weekPlan) return 0;
    
    let totalMood = 0;
    let countMood = 0;
    
    weekPlan.forEach(day => {
      const emotionTasks = day.tasks.filter(task => task.type === 'emotion');
      emotionTasks.forEach(task => {
        if (task.entries && task.entries.length) {
          task.entries.forEach(entry => {
            totalMood += entry.mood || 0;
            countMood++;
          });
        }
      });
    });
    
    return countMood > 0 ? (totalMood / countMood).toFixed(1) : 0;
  };
  
  // Format date for task history
  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Calculate category-specific stats
  const getCategoryStats = () => {
    if (!weekPlan) return [];
    
    const categoryStats = {};
    
    // Initialize stats for each category
    Object.values(taskCategories).forEach(category => {
      categoryStats[category] = {
        total: 0,
        completed: 0,
        points: 0,
        maxPoints: 0,
        tasks: []
      };
    });
    
    // Populate stats from weekPlan
    weekPlan.forEach(day => {
      day.tasks.forEach(task => {
        const category = task.taskCategory;
        if (category && categoryStats[category]) {
          categoryStats[category].total++;
          categoryStats[category].maxPoints += (task.points || 0);
          categoryStats[category].tasks.push(task);
          
          if (task.completed) {
            categoryStats[category].completed++;
            categoryStats[category].points += (task.points || 0);
          }
        }
      });
    });
    
    // Convert to array and add percentage
    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      ...stats,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));
  };
  
  // Calculate achievements
  const getAchievements = () => {
    const achievements = [];
    const categoryStats = getCategoryStats();
    
    // Category-specific achievements
    categoryStats.forEach(stat => {
      if (stat.percentage === 100) {
        achievements.push({
          name: `${getCategoryDisplayName(stat.category)} Master`,
          description: `Completed all ${stat.category} tasks`,
          icon: getCategoryIcon(stat.category),
          color: getCategoryColor(stat.category),
          colorRgb: getCategoryColorRgb(stat.category)
        });
      } else if (stat.percentage >= 80) {
        achievements.push({
          name: `${getCategoryDisplayName(stat.category)} Expert`,
          description: `Completed ${stat.percentage}% of ${getCategoryDisplayName(stat.category)} tasks`,
          icon: getCategoryIcon(stat.category),
          color: getCategoryColor(stat.category),
          colorRgb: getCategoryColorRgb(stat.category)
        });
      }
    });
    
    // Streak achievements
    const streak = calculateStreak();
    if (streak >= 3) {
      achievements.push({
        name: 'Consistent Achiever',
        description: `Maintained a ${streak}-day completion streak`,
        icon: <FaTrophy />,
        color: '#F59E0B',
        colorRgb: '245, 158, 11'
      });
    }
    
    // Water intake achievement
    const waterIntake = calculateTotalWaterIntake();
    if (waterIntake >= 30) {
      achievements.push({
        name: 'Hydration Champion',
        description: `Drank ${waterIntake} glasses of water`,
        icon: <FaWater />,
        color: '#0EA5E9',
        colorRgb: '14, 165, 233'
      });
    }
    
    // Workout achievement
    const workoutMinutes = calculateTotalWorkoutMinutes();
    if (workoutMinutes >= 90) {
      achievements.push({
        name: 'Fitness Enthusiast',
        description: `Completed ${workoutMinutes} minutes of workouts`,
        icon: <FaRunning />,
        color: '#F43F5E',
        colorRgb: '244, 63, 94'
      });
    }
    
    // Points achievement
    const totalPoints = calculateTotalPoints();
    if (totalPoints >= 300) {
      achievements.push({
        name: 'Point Collector',
        description: `Earned ${totalPoints} points in total`,
        icon: <FaMedal />,
        color: '#8B5CF6',
        colorRgb: '139, 92, 246'
      });
    }
    
    return achievements;
  };
  
  // Prepare data for each day
  const daysData = [];
  if (weekPlan) {
    for (let i = 1; i <= 7; i++) {
      const dayPlan = weekPlan.find(d => d.day === i);
      if (dayPlan) {
        const dayScore = calculateDayScore(dayPlan);
        daysData.push({
          day: i,
          title: dayPlan.title.split(' ')[0], // Just get the first word
          percentage: dayScore.percentage,
          score: dayScore.score,
          total: dayScore.total
        });
      }
    }
  }
  
  const totalCompletedTasks = calculateTotalCompletedTasks();
  const totalTasks = calculateTotalTasks();
  const completionPercentage = totalTasks > 0 
    ? Math.round((totalCompletedTasks / totalTasks) * 100) 
    : 0;
  const currentStreak = calculateStreak();
  const totalPoints = calculateTotalPoints();
  const maxPoints = calculateMaxPossiblePoints();
  const totalWaterIntake = calculateTotalWaterIntake();
  const totalWorkoutMinutes = calculateTotalWorkoutMinutes();
  const averageMood = calculateAverageMood();
  const categoryStats = getCategoryStats();
  const achievements = getAchievements();
  
  // Sort history by most recent first
  const sortedHistory = [...(taskHistory || [])].sort((a, b) => 
    new Date(b.dateCompleted) - new Date(a.dateCompleted)
  ).slice(0, 10);
  
  return (
    <ProgressContainer>
      <Title>Your Progress</Title>
      <Subheading>
        Track your daily accomplishments and see how much you've grown throughout the week.
      </Subheading>
      
      <StatsGrid>
        <StatCard>
          <StatIcon color="#4ADE80">
            <FaCheckCircle />
          </StatIcon>
          <StatValue>{completionPercentage}%</StatValue>
          <StatLabel>Overall Completion</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#F59E0B">
            <FaTrophy />
          </StatIcon>
          <StatValue>{totalPoints}/{maxPoints}</StatValue>
          <StatLabel>Total Points</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#3B82F6">
            <FaHistory />
          </StatIcon>
          <StatValue>{currentStreak}</StatValue>
          <StatLabel>Current Streak</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#8B5CF6">
            <FaMedal />
          </StatIcon>
          <StatValue>{achievements.length}</StatValue>
          <StatLabel>Achievements</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <CategorySection>
        <CategoryHeader>
          <FaChartLine /> Growth by Life Areas
        </CategoryHeader>
        
        <CategoriesGrid>
          {categoryStats.map(stat => (
            <CategoryCard key={stat.category} color={getCategoryColor(stat.category)}>
              <CategoryTitle>
                <CategoryIcon color={getCategoryColor(stat.category)}>
                  {getCategoryIcon(stat.category)}
                </CategoryIcon>
                <CategoryName>{getCategoryDisplayName(stat.category)}</CategoryName>
              </CategoryTitle>
              
              <CategoryProgressBar>
                <CategoryProgressFill 
                  percent={stat.percentage} 
                  color={getCategoryColor(stat.category)} 
                />
              </CategoryProgressBar>
              
              <CategoryStats>
                <CategoryValue>{stat.points}/{stat.maxPoints} points</CategoryValue>
                <CategoryBadge completed={stat.percentage === 100}>
                  {stat.completed}/{stat.total}
                </CategoryBadge>
              </CategoryStats>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </CategorySection>
      
      <RadarChartSection>
        <BalanceTitle>
          <FaChartLine /> Life Balance Overview
        </BalanceTitle>
        
        <BalanceGrid>
          {categoryStats.map(stat => (
            <LifeAreaCard key={stat.category}>
              <LifeAreaIcon color={getCategoryColor(stat.category)}>
                {getCategoryIcon(stat.category)}
              </LifeAreaIcon>
              <LifeAreaValue>{stat.percentage}%</LifeAreaValue>
              <LifeAreaName>{getCategoryDisplayName(stat.category)}</LifeAreaName>
            </LifeAreaCard>
          ))}
        </BalanceGrid>
      </RadarChartSection>
      
      <ProgressGrid>
        <ProgressCard>
          <ProgressTitle>Daily Progress</ProgressTitle>
          {daysData.map(day => (
            <DayProgress key={day.day}>
              <DayNumber>Day {day.day}</DayNumber>
              <ProgressBar>
                <ProgressFill percent={day.percentage} />
              </ProgressBar>
              <ProgressValue>{day.score}/{day.total}</ProgressValue>
            </DayProgress>
          ))}
        </ProgressCard>
        
        <ProgressCard>
          <ProgressTitle>Additional Stats</ProgressTitle>
          <DayProgress>
            <DayNumber>Water</DayNumber>
            <ProgressBar>
              <ProgressFill percent={Math.min(100, totalWaterIntake * 3)} color="#0EA5E9" />
            </ProgressBar>
            <ProgressValue>{totalWaterIntake} glasses</ProgressValue>
          </DayProgress>
          
          <DayProgress>
            <DayNumber>Exercise</DayNumber>
            <ProgressBar>
              <ProgressFill percent={Math.min(100, totalWorkoutMinutes / 2)} color="#F43F5E" />
            </ProgressBar>
            <ProgressValue>{totalWorkoutMinutes} mins</ProgressValue>
          </DayProgress>
          
          <DayProgress>
            <DayNumber>Mood</DayNumber>
            <ProgressBar>
              <ProgressFill percent={averageMood * 20} color="#8B5CF6" />
            </ProgressBar>
            <ProgressValue>{averageMood}/5</ProgressValue>
          </DayProgress>
          
          <DayProgress>
            <DayNumber>Tasks</DayNumber>
            <ProgressBar>
              <ProgressFill percent={completionPercentage} />
            </ProgressBar>
            <ProgressValue>{totalCompletedTasks}/{totalTasks}</ProgressValue>
          </DayProgress>
        </ProgressCard>
      </ProgressGrid>
      
      {achievements.length > 0 && (
        <AchievementsSection>
          <TableTitle>
            <FaMedal /> Your Achievements
          </TableTitle>
          
          <AchievementsGrid>
            {achievements.map((achievement, index) => (
              <AchievementCard key={index}>
                <AchievementIcon 
                  color={achievement.color} 
                  colorRgb={achievement.colorRgb}
                >
                  {achievement.icon}
                </AchievementIcon>
                <AchievementInfo>
                  <AchievementName>{achievement.name}</AchievementName>
                  <AchievementDescription>{achievement.description}</AchievementDescription>
                </AchievementInfo>
              </AchievementCard>
            ))}
          </AchievementsGrid>
        </AchievementsSection>
      )}
      
      <ActivityTable>
        <TableTitle>
          <FaHistory /> Recent Activity
        </TableTitle>
        
        <TaskTable>
          <TableHeader>
            <tr>
              <th>Task</th>
              <th>Category</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </TableHeader>
          <TableBody>
            {sortedHistory.map(entry => (
              <tr key={entry.taskId}>
                <td>{entry.taskTitle}</td>
                <td>
                  <div style={{
                    display: 'flex', 
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: getCategoryColor(entry.taskCategory),
                      marginRight: '0.5rem',
                      display: 'inline-flex'
                    }}>
                      {getCategoryIcon(entry.taskCategory)}
                    </span>
                    {getCategoryDisplayName(entry.taskCategory)}
                  </div>
                </td>
                <td>{entry.points} pts</td>
                <td>{formatTaskDate(entry.dateCompleted)}</td>
              </tr>
            ))}
            
            {sortedHistory.length === 0 && (
              <tr>
                <td colSpan={4} style={{textAlign: 'center', padding: '2rem'}}>
                  No completed tasks yet. Start checking off tasks to see your activity here!
                </td>
              </tr>
            )}
          </TableBody>
        </TaskTable>
      </ActivityTable>
    </ProgressContainer>
  );
};

export default Progress; 