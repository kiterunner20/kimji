import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { 
  FaGraduationCap, 
  FaAngleDown, 
  FaAngleUp, 
  FaCheck, 
  FaRegSmile,
  FaBook,
  FaLightbulb,
  FaPen,
  FaHistory,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

// Main container for the Personal Growth section
const SectionContainer = styled.div`
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.15);
  margin-bottom: 2rem;
  position: relative;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: -1;
  }
`;

const SectionHeader = styled.div`
  padding: 24px 32px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderIcon = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 1.25rem;
  backdrop-filter: blur(4px);
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const HeaderDescription = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  opacity: 0.8;
`;

const ContentContainer = styled.div`
  background-color: white;
  border-radius: 16px 16px 0 0;
  padding: 24px;
  
  @media (prefers-color-scheme: dark) {
    background-color: #1F2937;
    color: #F9FAFB;
  }
`;

const TaskCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 0;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #374151;
    border-color: #4B5563;
    
    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  }
`;

const TaskHeader = styled.div`
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${props => props.isExpanded ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'};
  
  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }
`;

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Checkbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid ${props => props.completed ? '#10B981' : '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  cursor: pointer;
  background-color: ${props => props.completed ? '#10B981' : 'transparent'};
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.completed ? '#059669' : '#9CA3AF'};
    background-color: ${props => props.completed ? '#059669' : 'rgba(0, 0, 0, 0.02)'};
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.completed ? '#10B981' : '#6B7280'};
    
    &:hover {
      border-color: ${props => props.completed ? '#059669' : '#9CA3AF'};
      background-color: ${props => props.completed ? '#059669' : 'rgba(255, 255, 255, 0.05)'};
    }
  }
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1F2937;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
  
  @media (prefers-color-scheme: dark) {
    color: #F9FAFB;
  }
`;

const TaskDescription = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #6B7280;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB;
  }
`;

const ExpandIcon = styled.div`
  color: #9CA3AF;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0)'};
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB;
  }
`;

const TaskContent = styled.div`
  padding: ${props => props.isExpanded ? '24px' : '0'};
  max-height: ${props => props.isExpanded ? '800px' : '0'};
  opacity: ${props => props.isExpanded ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

// Mood capture section
const MoodCapture = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  
  @media (prefers-color-scheme: dark) {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
`;

const MoodTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  color: #4F46E5;
  
  svg {
    margin-right: 8px;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #818CF8;
  }
`;

const MoodSelector = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 320px;
  margin: 0 auto 20px;
`;

const MoodButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
  
  ${props => props.selected && `
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      background-color: #4F46E5;
      border-radius: 50%;
    }
  `}
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    ${props => props.selected && `
      &::after {
        background-color: #818CF8;
      }
    `}
  }
`;

// Journaling section
const JournalSection = styled.div`
  margin-top: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${props => props.isExpanded ? '800px' : '0'};
  opacity: ${props => props.isExpanded ? '1' : '0'};
`;

const JournalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: ${props => props.isExpanded ? '16px' : '0'};
`;

const JournalTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  color: #4F46E5;
  
  svg {
    margin-right: 8px;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #818CF8;
  }
`;

const JournalToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB;
  }
`;

const JournalTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  font-family: inherit;
  resize: vertical;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #374151;
    border-color: #4B5563;
    color: #F9FAFB;
    
    &:focus {
      border-color: #818CF8;
      box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
    }
  }
`;

const SaveButton = styled.button`
  background-color: #4F46E5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  align-self: flex-end;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #4338CA;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #6366F1;
    
    &:hover {
      background-color: #4F46E5;
    }
  }
`;

const JournalActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const SavedJournals = styled.div`
  margin-top: 20px;
  max-height: 250px;
  overflow-y: auto;
  border-top: 1px solid #E5E7EB;
  padding-top: 16px;
  
  @media (prefers-color-scheme: dark) {
    border-top-color: #4B5563;
  }
`;

const JournalEntry = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border-left: 3px solid #4F46E5;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #1F2937;
    border-left-color: #818CF8;
  }
`;

const JournalTimestamp = styled.div`
  font-size: 12px;
  color: #9CA3AF;
  margin-bottom: 8px;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB;
  }
`;

const JournalContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #4B5563;
  
  @media (prefers-color-scheme: dark) {
    color: #E5E7EB;
  }
`;

const JournalMood = styled.div`
  margin-top: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  span {
    margin-right: 8px;
    color: #6B7280;
  }
  
  @media (prefers-color-scheme: dark) {
    span {
      color: #9CA3AF;
    }
  }
`;

const SeeHistoryButton = styled.button`
  background: none;
  border: none;
  color: #6B7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  svg {
    margin-right: 4px;
  }
  
  &:hover {
    color: #4F46E5;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #9CA3AF;
    
    &:hover {
      color: #818CF8;
    }
  }
`;

// Suggestions based on mood
const SuggestionSection = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(to right, rgba(79, 70, 229, 0.08), rgba(124, 58, 237, 0.08));
  border-radius: 12px;
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(to right, rgba(79, 70, 229, 0.15), rgba(124, 58, 237, 0.15));
  }
`;

const SuggestionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  color: #4F46E5;
  
  svg {
    margin-right: 8px;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #818CF8;
  }
`;

const SuggestionCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: #374151;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
`;

const SuggestionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(79, 70, 229, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #4F46E5;
  
  @media (prefers-color-scheme: dark) {
    background-color: rgba(129, 140, 248, 0.1);
    color: #818CF8;
  }
`;

const SuggestionContent = styled.div`
  flex: 1;
`;

const SuggestionText = styled.h5`
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  
  @media (prefers-color-scheme: dark) {
    color: #F9FAFB;
  }
`;

const SuggestionDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6B7280;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB;
  }
`;

const MoodTrendSection = styled.div`
  margin-top: 30px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  @media (prefers-color-scheme: dark) {
    background-color: #1F2937;
  }
`;

const MoodTrendTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #1F2937;
  
  @media (prefers-color-scheme: dark) {
    color: #F9FAFB;
  }
`;

const MoodTrendDescription = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #6B7280;
  line-height: 1.5;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB;
  }
`;

const PersonalGrowthSection = ({ tasks = [] }) => {
  const { dispatch } = useAppContext();
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState({});
  const [journalExpanded, setJournalExpanded] = useState({});
  const [journalNotes, setJournalNotes] = useState({});
  const [journalEntries, setJournalEntries] = useState({});
  const [showHistory, setShowHistory] = useState({});
  
  // Filter tasks related to personal growth
  const personalGrowthTasks = tasks.filter(task => 
    task.taskCategory === 'personal_growth'
  );
  
  // Toggle task expanded state
  const toggleTaskExpanded = (taskId) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };
  
  // Toggle journal section expanded state
  const toggleJournalExpanded = (taskId) => {
    setJournalExpanded(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  // Toggle task completed state
  const toggleTaskCompleted = (taskId) => {
    dispatch({
      type: 'TOGGLE_TASK',
      payload: { taskId, dispatch }
    });
  };
  
  // Handle mood selection
  const handleMoodSelect = (taskId, mood) => {
    setSelectedMoods(prev => ({
      ...prev,
      [taskId]: mood
    }));
  };
  
  // Handle journal note change
  const handleJournalChange = (taskId, note) => {
    setJournalNotes(prev => ({
      ...prev,
      [taskId]: note
    }));
  };
  
  // Save journal entry
  const saveJournalEntry = (taskId) => {
    const mood = selectedMoods[taskId];
    const note = journalNotes[taskId];
    
    if (!mood || !note?.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      note,
      mood,
      timestamp: new Date().toISOString()
    };
    
    setJournalEntries(prev => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), newEntry]
    }));
    
    // Clear entry form
    setJournalNotes(prev => ({
      ...prev,
      [taskId]: ''
    }));
  };
  
  // Toggle show history
  const toggleShowHistory = (taskId) => {
    setShowHistory(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  // Format timestamp for journal entries
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Get suggestions based on mood
  const getMoodSuggestions = (taskId) => {
    const mood = selectedMoods[taskId];
    
    if (!mood) return null;
    
    // Positive mood suggestions
    if (mood === 'great' || mood === 'good') {
      return {
        title: "You're on a roll!",
        icon: <FaBook />,
        text: "Read a Motivational Book",
        description: "Keep the inspiration flowing with new ideas."
      };
    }
    
    // Neutral mood suggestions
    if (mood === 'okay') {
      return {
        title: "Feeling steady?",
        icon: <FaLightbulb />,
        text: "Organize Your Day",
        description: "Maintain your momentum with a clear plan."
      };
    }
    
    // Negative mood suggestions
    if (mood === 'bad' || mood === 'terrible') {
      return {
        title: "Rough day?",
        icon: <FaRegSmile />,
        text: "Take a Relaxation Break",
        description: "Help yourself unwind and recharge."
      };
    }
    
    return null;
  };
  
  // Get task-specific journal prompts
  const getJournalPrompt = (task) => {
    if (!task) return "How are you feeling about this task?";
    
    if (task.type === 'learning' || task.title.includes('Learn')) {
      return "What did you learn today? Any challenges?";
    }
    
    if (task.title.includes('Journal') || task.title.includes('Write')) {
      return "What insights did you discover while writing?";
    }
    
    if (task.title.includes('Motivational') || task.title.includes('Book')) {
      return "What was the most inspiring idea you encountered?";
    }
    
    return "How are you feeling about your progress on this task?";
  };
  
  return (
    <SectionContainer>
      <SectionHeader>
        <HeaderLeft>
          <HeaderIcon>
            <FaGraduationCap />
          </HeaderIcon>
          <div>
            <HeaderTitle>Personal Growth</HeaderTitle>
            <HeaderDescription>Develop yourself through learning and reflection</HeaderDescription>
          </div>
        </HeaderLeft>
      </SectionHeader>
      
      <ContentContainer>
        {personalGrowthTasks.map(task => (
          <TaskCard key={task.id}>
            <TaskHeader 
              isExpanded={expandedTasks.includes(task.id)}
              onClick={() => toggleTaskExpanded(task.id)}
            >
              <TaskInfo>
                <Checkbox 
                  completed={task.completed}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskCompleted(task.id);
                  }}
                >
                  {task.completed && <FaCheck />}
                </Checkbox>
                <div>
                  <TaskTitle completed={task.completed}>{task.title}</TaskTitle>
                  {task.description && (
                    <TaskDescription>{task.description}</TaskDescription>
                  )}
                </div>
              </TaskInfo>
              <ExpandIcon isExpanded={expandedTasks.includes(task.id)}>
                <FaAngleDown />
              </ExpandIcon>
            </TaskHeader>
            
            <TaskContent isExpanded={expandedTasks.includes(task.id)}>
              {/* Mood capture section */}
              <MoodCapture>
                <MoodTitle>
                  <FaRegSmile /> How did this task make you feel?
                </MoodTitle>
                <MoodSelector>
                  <MoodButton 
                    selected={selectedMoods[task.id] === 'great'}
                    onClick={() => handleMoodSelect(task.id, 'great')}
                  >
                    😊
                  </MoodButton>
                  <MoodButton 
                    selected={selectedMoods[task.id] === 'good'}
                    onClick={() => handleMoodSelect(task.id, 'good')}
                  >
                    🙂
                  </MoodButton>
                  <MoodButton 
                    selected={selectedMoods[task.id] === 'okay'}
                    onClick={() => handleMoodSelect(task.id, 'okay')}
                  >
                    😐
                  </MoodButton>
                  <MoodButton 
                    selected={selectedMoods[task.id] === 'bad'}
                    onClick={() => handleMoodSelect(task.id, 'bad')}
                  >
                    😕
                  </MoodButton>
                  <MoodButton 
                    selected={selectedMoods[task.id] === 'terrible'}
                    onClick={() => handleMoodSelect(task.id, 'terrible')}
                  >
                    😢
                  </MoodButton>
                </MoodSelector>
                
                {/* Mood-based suggestions */}
                {selectedMoods[task.id] && (
                  <SuggestionSection>
                    <SuggestionTitle>
                      <FaLightbulb /> Suggested Next Steps
                    </SuggestionTitle>
                    <SuggestionCard>
                      <SuggestionIcon>
                        {getMoodSuggestions(task.id)?.icon}
                      </SuggestionIcon>
                      <SuggestionContent>
                        <SuggestionText>{getMoodSuggestions(task.id)?.text}</SuggestionText>
                        <SuggestionDescription>{getMoodSuggestions(task.id)?.description}</SuggestionDescription>
                      </SuggestionContent>
                    </SuggestionCard>
                  </SuggestionSection>
                )}
                
                {/* Journal section */}
                <JournalSection isExpanded={journalExpanded[task.id]}>
                  <JournalHeader 
                    isExpanded={journalExpanded[task.id]}
                    onClick={() => toggleJournalExpanded(task.id)}
                  >
                    <JournalTitle>
                      <FaPen /> Reflect on this task
                    </JournalTitle>
                    <JournalToggle>
                      {journalExpanded[task.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </JournalToggle>
                  </JournalHeader>
                  
                  {journalExpanded[task.id] && (
                    <>
                      <JournalTextarea 
                        placeholder={getJournalPrompt(task)}
                        value={journalNotes[task.id] || ''}
                        onChange={(e) => handleJournalChange(task.id, e.target.value)}
                      />
                      
                      <JournalActions>
                        <SeeHistoryButton 
                          onClick={() => toggleShowHistory(task.id)}
                          type="button"
                        >
                          <FaHistory /> 
                          {showHistory[task.id] ? 'Hide History' : 'See History'}
                        </SeeHistoryButton>
                        
                        <SaveButton onClick={() => saveJournalEntry(task.id)}>
                          Save Entry
                        </SaveButton>
                      </JournalActions>
                      
                      {/* Journal history */}
                      {showHistory[task.id] && journalEntries[task.id]?.length > 0 && (
                        <SavedJournals>
                          {journalEntries[task.id].map(entry => (
                            <JournalEntry key={entry.id}>
                              <JournalTimestamp>{formatTimestamp(entry.timestamp)}</JournalTimestamp>
                              <JournalContent>{entry.note}</JournalContent>
                              <JournalMood>
                                <span>Mood:</span>
                                {entry.mood === 'great' && '😊'}
                                {entry.mood === 'good' && '🙂'}
                                {entry.mood === 'okay' && '😐'}
                                {entry.mood === 'bad' && '😕'}
                                {entry.mood === 'terrible' && '😢'}
                              </JournalMood>
                            </JournalEntry>
                          ))}
                        </SavedJournals>
                      )}
                    </>
                  )}
                </JournalSection>
              </MoodCapture>
            </TaskContent>
          </TaskCard>
        ))}
        
        {/* Weekly mood trend summary */}
        <MoodTrendSection>
          <MoodTrendTitle>Weekly Mood Insights</MoodTrendTitle>
          <MoodTrendDescription>
            This week, you felt 😊 most often after creative tasks! Consider adding more creative activities to your schedule.
          </MoodTrendDescription>
        </MoodTrendSection>
      </ContentContainer>
    </SectionContainer>
  );
};

export default PersonalGrowthSection; 