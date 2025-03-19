import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHeart, FaPlus, FaTrash } from 'react-icons/fa';
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
  color: #4ADE80;
  display: flex;
  align-items: center;
`;

const EntryForm = styled.form`
  display: flex;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const AddButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  padding: 0 1rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--secondary);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Entry = styled.div`
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

const EntryIcon = styled.div`
  color: #4ADE80;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EntryText = styled.div`
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

const GratitudeTracker = ({ task }) => {
  const [newEntry, setNewEntry] = useState('');
  const { dispatch } = useAppContext();
  
  const entries = task.entries || [];
  const targetCount = task.title.includes('10') ? 10 : 5; // Extract target from task title
  
  const handleAddEntry = (e) => {
    e.preventDefault();
    
    if (!newEntry.trim()) return;
    
    const updatedEntries = [
      ...entries,
      { id: uuidv4(), text: newEntry.trim(), timestamp: new Date().toISOString() }
    ];
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        taskId: task.id,
        data: { entries: updatedEntries }
      }
    });
    
    // Check if we've reached the target count and update completion status
    if (updatedEntries.length >= targetCount && !task.completed) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    }
    
    setNewEntry('');
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
    
    // Check if we've gone below the target count and update completion status
    if (updatedEntries.length < targetCount && task.completed) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    }
  };
  
  return (
    <TrackerContainer>
      <Title>
        <FaHeart style={{ marginRight: '8px' }} /> Gratitude Journal
      </Title>
      
      <EntryForm onSubmit={handleAddEntry}>
        <Input 
          type="text"
          placeholder="I'm grateful for..."
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <AddButton type="submit" disabled={!newEntry.trim()}>
          <FaPlus />
        </AddButton>
      </EntryForm>
      
      <EntriesList>
        {entries.length > 0 ? (
          entries.map(entry => (
            <Entry key={entry.id}>
              <EntryIcon>
                <FaHeart />
              </EntryIcon>
              <EntryText>{entry.text}</EntryText>
              <DeleteButton onClick={() => handleDeleteEntry(entry.id)}>
                <FaTrash />
              </DeleteButton>
            </Entry>
          ))
        ) : (
          <EmptyState>
            No entries yet. What are you grateful for today?
          </EmptyState>
        )}
      </EntriesList>
      
      {entries.length > 0 && (
        <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gray-600)' }}>
          {entries.length} of {targetCount} entries
        </div>
      )}
    </TrackerContainer>
  );
};

export default GratitudeTracker; 