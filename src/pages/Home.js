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
import PersonalGrowthSection from '../components/PersonalGrowthSection';

const Home = () => {
  // ... existing code ...
  
  return (
    <HomeContainer>
      <WelcomeSection>
        <Greeting>
          {profile.name ? `Hello, ${profile.name}!` : 'Welcome to your transformation!'}
        </Greeting>
        <DayTitle>
          <FaCalendarAlt /> Day {currentDay}: {dayPlan?.title || ''}
        </DayTitle>
        <Subheading>
          Week {getCurrentWeek()}: {weekTheme} - Build consistent habits in 21 days.
        </Subheading>
        
        <DaySelector />
        
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
      
      {/* Personal Growth Section (New) */}
      {dayPlan?.tasks && (
        <PersonalGrowthSection tasks={dayPlan.tasks} />
      )}
      
      <TasksSection>
        <TaskManager day={currentDay} />
      </TasksSection>
      
      {renderEmptyState()}
    </HomeContainer>
  );
};

export default Home; 