import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByShareToken, savePartnerMessage, getDayData } from '../services/firestore';
import styled from 'styled-components';

// Styled components
const PartnerViewContainer = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ProgressSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CategorySection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
`;

const CategoryCard = styled.div`
  flex: 1 1 250px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  margin: 10px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => {
    if (props.percentage < 30) return '#dc3545';
    if (props.percentage < 70) return '#ffc107';
    return '#28a745';
  }};
  border-radius: 5px;
  transition: width 0.3s ease;
`;

const TaskList = styled.div`
  margin: 20px 0;
`;

const Task = styled.div`
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  background: ${props => (props.completed ? '#e8f5e9' : '#fff')};
`;

const CheckMark = styled.span`
  margin-right: 10px;
  color: #28a745;
`;

const EncouragementSection = styled.div`
  margin: 30px 0;
  text-align: center;
`;

const MessageInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  margin-bottom: 10px;
  resize: vertical;
  min-height: 80px;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #2e59d9;
  }

  &:disabled {
    background: #b9c3e0;
    cursor: not-allowed;
  }
`;

const QuickMessageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 20px 0;
`;

const QuickMessage = styled.button`
  padding: 10px;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const MessageSentConfirmation = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border-radius: 5px;
  text-align: center;
`;

// Predefined encouragement messages
const quickMessages = [
  "You're doing great! Keep it up! 💪",
  "I'm proud of your progress! 🌟",
  "Keep going, you've got this! 🚀",
  "Today's effort is tomorrow's success! 🌈",
  "Small steps lead to big changes! 🏆",
  "Consistency is key - you're nailing it! 👏"
];

// Calculate percentage for each category
const calculateCategoryPercentage = (dayData, tasks, category) => {
  if (!dayData || !dayData.completedTasks) return 0;
  
  const categoryTasks = tasks.filter(task => task.taskCategory === category);
  if (categoryTasks.length === 0) return 0;
  
  const completedCount = categoryTasks.filter(task => 
    dayData.completedTasks.includes(task.id)
  ).length;
  
  return Math.round((completedCount / categoryTasks.length) * 100);
};

// Calculate overall completion percentage
const calculateOverallPercentage = (dayData, tasks) => {
  if (!dayData || !dayData.completedTasks || !tasks || tasks.length === 0) return 0;
  return Math.round((dayData.completedTasks.length / tasks.length) * 100);
};

const PartnerView = () => {
  const { token } = useParams();
  const [user, setUser] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user by share token
        const userData = await getUserByShareToken(token);
        if (!userData) {
          setError("Invalid share token. This link may have expired or been revoked.");
          setLoading(false);
          return;
        }
        
        setUser(userData);
        
        // Fetch day data for the current day
        const dayDataResponse = await getDayData(userData.id, currentDay);
        setDayData(dayDataResponse);
        
        // We would need to fetch tasks data as well
        // For now, using dummy tasks
        // In a real implementation, you would fetch this from Firestore
        // const weekData = await getWeekData(userData.id);
        // setTasks(weekData[currentDay - 1].tasks);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading partner view data:", err);
        setError("An error occurred while loading data. Please try again.");
        setLoading(false);
      }
    };
    
    if (token) {
      loadUserData();
    }
  }, [token, currentDay]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    try {
      await savePartnerMessage(user.id, message);
      setMessage('');
      setMessageSent(true);
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleQuickMessage = (quickMessage) => {
    setMessage(quickMessage);
  };

  if (loading) {
    return (
      <PartnerViewContainer>
        <p>Loading...</p>
      </PartnerViewContainer>
    );
  }

  if (error) {
    return (
      <PartnerViewContainer>
        <p>{error}</p>
      </PartnerViewContainer>
    );
  }

  if (!user) {
    return (
      <PartnerViewContainer>
        <p>Invalid share token. This link may have expired or been revoked.</p>
      </PartnerViewContainer>
    );
  }

  const renderCategoryProgress = () => {
    const categories = [
      { id: 'personal_growth', name: 'Personal Growth' },
      { id: 'emotional_health', name: 'Emotional Health' },
      { id: 'mental_fitness', name: 'Mental Fitness' },
      { id: 'physical_health', name: 'Physical Health' },
      { id: 'relationships', name: 'Relationships' },
      { id: 'social', name: 'Social' },
      { id: 'financial', name: 'Financial' },
      { id: 'mindfulness', name: 'Mindfulness' }
    ];

    return (
      <CategorySection>
        {categories.map(category => {
          // Skip categories the user has chosen not to share
          if (user.shareSettings?.categories && 
              user.shareSettings.categories[category.id] === false) {
            return null;
          }
          
          const percentage = calculateCategoryPercentage(dayData, tasks, category.id);
          
          return (
            <CategoryCard key={category.id}>
              <h3>{category.name}</h3>
              <ProgressBar>
                <ProgressFill percentage={percentage} />
              </ProgressBar>
              <p>{percentage}% Complete</p>
            </CategoryCard>
          );
        })}
      </CategorySection>
    );
  };

  return (
    <PartnerViewContainer>
      <Header>
        <h1>{user.displayName}'s Transformation Journey</h1>
        <p>Day {currentDay} Progress</p>
      </Header>
      
      <ProgressSection>
        <h2>Overall Progress</h2>
        <ProgressBar>
          <ProgressFill percentage={calculateOverallPercentage(dayData, tasks)} />
        </ProgressBar>
        <p>{calculateOverallPercentage(dayData, tasks)}% of today's tasks completed</p>
      </ProgressSection>
      
      <ProgressSection>
        <h2>Category Progress</h2>
        {renderCategoryProgress()}
      </ProgressSection>
      
      <ProgressSection>
        <h2>Today's Completed Tasks</h2>
        <TaskList>
          {tasks.filter(task => {
            // Filter out tasks from categories the user has chosen not to share
            if (user.shareSettings?.categories && 
                user.shareSettings.categories[task.taskCategory] === false) {
              return false;
            }
            return dayData?.completedTasks?.includes(task.id);
          }).map(task => (
            <Task key={task.id} completed={true}>
              <CheckMark>✓</CheckMark>
              <div>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            </Task>
          ))}
        </TaskList>
      </ProgressSection>
      
      <EncouragementSection>
        <h2>Send Some Encouragement</h2>
        <QuickMessageGrid>
          {quickMessages.map((msg, index) => (
            <QuickMessage 
              key={index} 
              onClick={() => handleQuickMessage(msg)}
            >
              {msg}
            </QuickMessage>
          ))}
        </QuickMessageGrid>
        <MessageInput 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a custom message of encouragement..."
        />
        <SendButton 
          onClick={handleSendMessage} 
          disabled={!message.trim()}
        >
          Send Message
        </SendButton>
        {messageSent && (
          <MessageSentConfirmation>
            Message sent successfully! Your encouragement means a lot.
          </MessageSentConfirmation>
        )}
      </EncouragementSection>
    </PartnerViewContainer>
  );
};

export default PartnerView; 