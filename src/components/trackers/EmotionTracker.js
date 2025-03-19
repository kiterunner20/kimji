import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRegSmile, FaSave, FaTrash } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const TrackerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const Title = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #9D4EDD;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const MoodSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  @media (max-width: 500px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const MoodOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid ${props => props.selected ? '#9D4EDD' : 'var(--gray-300)'};
  background-color: ${props => props.selected ? 'rgba(157, 78, 221, 0.1)' : 'transparent'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    border-color: #9D4EDD;
    transform: translateY(-2px);
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.selected ? '#9D4EDD' : 'var(--gray-600)'};
  }
`;

const Emoji = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const MoodLabel = styled.div`
  font-size: 0.75rem;
  color: var(--gray-700);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
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

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  align-self: flex-end;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--secondary);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const MoodEntries = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const MoodEntry = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
  transition: var(--transition);
  
  &:hover {
    background-color: var(--gray-100);
  }
  
  @media (prefers-color-scheme: dark) {
    border-bottom-color: var(--gray-700);
    
    &:hover {
      background-color: var(--gray-700);
    }
  }
`;

const EntryTime = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-right: 1rem;
  width: 80px;
`;

const EntryMood = styled.div`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const EntryNote = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: var(--gray-800);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  border-radius: 50%;
  
  &:hover {
    color: var(--danger);
    background-color: rgba(244, 67, 54, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: var(--gray-500);
  font-size: 0.9rem;
`;

const moods = [
  { value: 1, emoji: '😢', label: 'Terrible' },
  { value: 2, emoji: '😟', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' }
];

const EmotionTracker = ({ task }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const { dispatch } = useAppContext();
  
  const entries = task.entries || [];
  
  const handleSave = (e) => {
    e.preventDefault();
    
    const updatedEntries = [
      ...entries,
      { 
        id: uuidv4(), 
        mood, 
        note, 
        timestamp: new Date().toISOString() 
      }
    ];
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        taskId: task.id,
        data: { entries: updatedEntries }
      }
    });
    
    // Also update stats
    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        type: 'mood',
        value: mood
      }
    });
    
    // Mark task as completed if there's at least one entry
    if (!task.completed && updatedEntries.length > 0) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    }
    
    // Reset note
    setNote('');
  };
  
  const handleDeleteEntry = (entryId) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        taskId: task.id,
        data: { entries: updatedEntries }
      }
    });
    
    // Mark task as incomplete if there are no entries
    if (task.completed && updatedEntries.length === 0) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <TrackerContainer>
      <Title>
        <FaRegSmile style={{ marginRight: '8px' }} /> Mood Tracker
      </Title>
      
      <Form onSubmit={handleSave}>
        <Label>How are you feeling right now?</Label>
        <MoodSelector>
          {moods.map(option => (
            <MoodOption
              key={option.value}
              type="button"
              selected={mood === option.value}
              onClick={() => setMood(option.value)}
            >
              <Emoji>{option.emoji}</Emoji>
              <MoodLabel>{option.label}</MoodLabel>
            </MoodOption>
          ))}
        </MoodSelector>
        
        <InputGroup>
          <Label>Notes (optional)</Label>
          <TextArea 
            placeholder="What's going on?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </InputGroup>
        
        <SaveButton type="submit">
          <FaSave /> Log Mood
        </SaveButton>
      </Form>
      
      <MoodEntries>
        {entries.length > 0 ? (
          entries.map(entry => (
            <MoodEntry key={entry.id}>
              <EntryTime>{formatTime(entry.timestamp)}</EntryTime>
              <EntryMood>
                {moods.find(m => m.value === entry.mood)?.emoji}
              </EntryMood>
              <EntryNote>{entry.note || 'No notes'}</EntryNote>
              <DeleteButton onClick={() => handleDeleteEntry(entry.id)}>
                <FaTrash />
              </DeleteButton>
            </MoodEntry>
          ))
        ) : (
          <EmptyState>
            No mood entries yet. How are you feeling today?
          </EmptyState>
        )}
      </MoodEntries>
    </TrackerContainer>
  );
};

export default EmotionTracker; 