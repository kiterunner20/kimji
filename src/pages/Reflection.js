import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLightbulb, FaSave, FaPencilAlt, FaHeart } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const ReflectionContainer = styled.div`
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

const ReflectionCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  margin-right: 1rem;
  background-color: ${props => props.color || 'var(--primary)'};
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--gray-800);
  margin: 0;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const TextAreaLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  min-height: 120px;
  resize: vertical;
  margin-bottom: 1rem;
  font-family: inherit;
  
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
  
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
  }
`;

const SavedSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
  
  @media (prefers-color-scheme: dark) {
    border-top-color: var(--gray-700);
  }
`;

const SavedTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: var(--gray-800);
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const SavedEntry = styled.div`
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const SavedDate = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-bottom: 0.5rem;
`;

const SavedText = styled.p`
  font-size: 0.9rem;
  color: var(--gray-800);
  margin: 0;
  white-space: pre-wrap;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: var(--gray-500);
  font-style: italic;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-300);
  margin-bottom: 2rem;
  
  @media (prefers-color-scheme: dark) {
    border-bottom-color: var(--gray-700);
  }
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--gray-600)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    color: ${props => props.active ? 'var(--primary)' : 'var(--gray-400)'};
  }
`;

// Define reflection types
const reflectionTypes = [
  {
    id: 'daily',
    name: 'Daily Reflection',
    color: 'var(--primary)',
    icon: <FaPencilAlt />,
    prompts: [
      'What went well today?',
      'What challenges did you face?',
      'What are you grateful for?',
      'What did you learn today?',
      'What could you improve tomorrow?'
    ]
  },
  {
    id: 'gratitude',
    name: 'Gratitude Journal',
    color: '#4ADE80',
    icon: <FaHeart />,
    prompts: [
      "List 3-5 things you are grateful for today.",
      "Why are these things meaningful to you?",
      "How did these things positively impact your day?",
      "Who are the people you are thankful for today?",
      "What simple pleasures brought you joy today?"
    ]
  },
  {
    id: 'insights',
    name: 'Insights & Ideas',
    color: '#F59E0B',
    icon: <FaLightbulb />,
    prompts: [
      'What new ideas came to you today?',
      'Did you have any aha moments or realizations?',
      'What would you like to explore further?',
      'How might you apply what you learned today?',
      'What connections did you make between different areas of your life?'
    ]
  }
];

const Reflection = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [reflection, setReflection] = useState('');
  const { currentDay, weekPlan } = useAppContext();

  // Check if we already have a reflection for today in LocalStorage
  const [savedReflections, setSavedReflections] = useState(() => {
    const stored = localStorage.getItem('transformWeekReflections');
    return stored ? JSON.parse(stored) : [];
  });

  // Get active reflection type
  const activeReflection = reflectionTypes.find(type => type.id === activeTab);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSaveReflection = () => {
    if (!reflection.trim()) return;

    const newReflection = {
      id: uuidv4(),
      type: activeTab,
      text: reflection,
      date: new Date().toISOString(),
      day: currentDay
    };

    const updatedReflections = [newReflection, ...savedReflections];
    
    setSavedReflections(updatedReflections);
    localStorage.setItem('transformWeekReflections', JSON.stringify(updatedReflections));
    
    // Clear the textarea
    setReflection('');
  };

  // Get reflections for the current tab
  const filteredReflections = savedReflections.filter(r => r.type === activeTab);

  return (
    <ReflectionContainer>
      <Title>Reflect & Journal</Title>
      <Subheading>
        Take a moment to reflect on your day, express gratitude, or capture insights.
      </Subheading>

      <Tabs>
        {reflectionTypes.map(type => (
          <Tab
            key={type.id}
            active={activeTab === type.id}
            onClick={() => setActiveTab(type.id)}
          >
            {type.name}
          </Tab>
        ))}
      </Tabs>

      <ReflectionCard>
        <CardHeader>
          <CardIcon color={activeReflection.color}>
            {activeReflection.icon}
          </CardIcon>
          <CardTitle>{activeReflection.name}</CardTitle>
        </CardHeader>

        <FormGroup>
          <TextAreaLabel>Reflection Prompts:</TextAreaLabel>
          <ul>
            {activeReflection.prompts.map((prompt, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', color: 'var(--gray-600)' }}>
                {prompt}
              </li>
            ))}
          </ul>
        </FormGroup>

        <FormGroup>
          <TextAreaLabel>Your Reflection:</TextAreaLabel>
          <TextArea
            placeholder="Write your thoughts here..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </FormGroup>

        <SaveButton 
          onClick={handleSaveReflection}
          disabled={!reflection.trim()}
        >
          <FaSave /> Save Reflection
        </SaveButton>

        {filteredReflections.length > 0 && (
          <SavedSection>
            <SavedTitle>
              <FaPencilAlt /> Your Past Reflections
            </SavedTitle>
            
            {filteredReflections.map(entry => (
              <SavedEntry key={entry.id}>
                <SavedDate>
                  {formatDate(entry.date)} {entry.day && `- Day ${entry.day}`}
                </SavedDate>
                <SavedText>{entry.text}</SavedText>
              </SavedEntry>
            ))}
          </SavedSection>
        )}

        {filteredReflections.length === 0 && (
          <SavedSection>
            <SavedTitle>
              <FaPencilAlt /> Your Past Reflections
            </SavedTitle>
            <EmptyState>
              No reflections saved yet. Start journaling to see your entries here.
            </EmptyState>
          </SavedSection>
        )}
      </ReflectionCard>
    </ReflectionContainer>
  );
};

export default Reflection; 