import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LoginHeader = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const LoginInput = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const LoginButton = styled.button`
  padding: 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const SocialButton = styled(LoginButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.google ? '#4285f4' : '#3b5998'};
  
  &:hover {
    background-color: ${props => props.google ? '#3367d6' : '#2d4373'};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin: 10px 0;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to log in with Google.');
      console.error('Google login error:', error);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>Kimji Transform</LoginHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LoginForm onSubmit={handleLogin}>
        <LoginInput 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <LoginInput 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <LoginButton type="submit">Log In</LoginButton>
      </LoginForm>
      <SocialButton 
        type="button" 
        google 
        onClick={handleGoogleLogin}
      >
        Sign in with Google
      </SocialButton>
    </LoginContainer>
  );
};

export default Login; 