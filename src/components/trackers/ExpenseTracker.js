import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMoneyBillWave, FaPlus, FaTrash } from 'react-icons/fa';
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
  color: #F59E0B;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: var(--gray-600);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-200);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  
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

const ExpensesList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const ExpenseItem = styled.div`
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

const ExpenseAmount = styled.div`
  font-weight: 600;
  color: var(--gray-900);
  width: 80px;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const ExpenseCategory = styled.div`
  background-color: var(--gray-200);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.75rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const ExpenseDescription = styled.div`
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

const ExpenseSummary = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--gray-100);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-top: 1rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
  }
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SummaryValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: var(--gray-500);
  font-size: 0.9rem;
`;

const ExpenseTracker = ({ task }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const { dispatch } = useAppContext();
  
  const entries = task.entries || [];
  
  const handleAddExpense = (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    const updatedEntries = [
      ...entries,
      { 
        id: uuidv4(), 
        amount: parseFloat(amount), 
        category, 
        description, 
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
    
    // Mark task as completed if there's at least one entry
    if (!task.completed && updatedEntries.length > 0) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: { taskId: task.id }
      });
    }
    
    // Reset form
    setAmount('');
    setCategory('food');
    setDescription('');
  };
  
  const handleDeleteExpense = (entryId) => {
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
  
  // Calculate total expenses
  const totalExpenses = entries.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Get highest expense
  const highestExpense = entries.length > 0
    ? Math.max(...entries.map(entry => entry.amount))
    : 0;
    
  return (
    <TrackerContainer>
      <Title>
        <FaMoneyBillWave style={{ marginRight: '8px' }} /> Expense Tracker
      </Title>
      
      <Form onSubmit={handleAddExpense}>
        <FormGroup>
          <Label>Amount</Label>
          <Input 
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Category</Label>
          <Select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <FormGroup style={{ flexBasis: '100%' }}>
          <Label>Description (Optional)</Label>
          <Input 
            type="text"
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={!amount || isNaN(amount) || amount <= 0}>
          <FaPlus /> Add Expense
        </SubmitButton>
      </Form>
      
      <ExpensesList>
        {entries.length > 0 ? (
          entries.map(entry => (
            <ExpenseItem key={entry.id}>
              <ExpenseAmount>${entry.amount.toFixed(2)}</ExpenseAmount>
              <ExpenseCategory>{entry.category}</ExpenseCategory>
              <ExpenseDescription>{entry.description || 'No description'}</ExpenseDescription>
              <DeleteButton onClick={() => handleDeleteExpense(entry.id)}>
                <FaTrash />
              </DeleteButton>
            </ExpenseItem>
          ))
        ) : (
          <EmptyState>
            No expenses logged yet. Start tracking your spending!
          </EmptyState>
        )}
      </ExpensesList>
      
      {entries.length > 0 && (
        <ExpenseSummary>
          <SummaryItem>
            <SummaryValue>${totalExpenses.toFixed(2)}</SummaryValue>
            <SummaryLabel>Total</SummaryLabel>
          </SummaryItem>
          
          <SummaryItem>
            <SummaryValue>{entries.length}</SummaryValue>
            <SummaryLabel>Entries</SummaryLabel>
          </SummaryItem>
          
          <SummaryItem>
            <SummaryValue>${highestExpense.toFixed(2)}</SummaryValue>
            <SummaryLabel>Highest</SummaryLabel>
          </SummaryItem>
        </ExpenseSummary>
      )}
    </TrackerContainer>
  );
};

export default ExpenseTracker; 