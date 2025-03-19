import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBell, FaBellSlash, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const PermissionBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  transform: translateY(${props => props.show ? '0' : '100%'});
  transition: transform 0.3s ease;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const IconContainer = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--warning);
`;

const BannerContent = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.25rem;
  color: var(--gray-900);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const BannerText = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: var(--gray-600);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PermissionButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--gray-600)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--gray-300)'};
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--secondary)' : 'var(--gray-100)'};
    transform: translateY(-2px);
  }
  
  @media (prefers-color-scheme: dark) {
    color: ${props => props.primary ? 'white' : 'var(--gray-400)'};
    border-color: ${props => props.primary ? 'none' : 'var(--gray-600)'};
    
    &:hover {
      background-color: ${props => props.primary ? 'var(--secondary)' : 'var(--gray-700)'};
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: var(--gray-100);
    color: var(--gray-900);
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
    
    &:hover {
      background-color: var(--gray-700);
      color: var(--gray-100);
    }
  }
`;

const NotificationsPermission = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { notifications } = useAppContext();
  
  useEffect(() => {
    // Only show the banner if notifications are enabled in app settings
    // and the browser supports notifications
    if (notifications && "Notification" in window) {
      // Check if permission is not granted and not denied (default)
      if (Notification.permission === "default") {
        setShowBanner(true);
      }
    }
  }, [notifications]);
  
  const handleRequestPermission = () => {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        // Create a test notification to confirm it works
        new Notification("TransformWeek", {
          body: "Notifications are now enabled for task reminders!",
          icon: "/favicon.ico"
        });
      }
      
      // Hide the banner regardless of the result
      setShowBanner(false);
    });
  };
  
  const dismissBanner = () => {
    setShowBanner(false);
    // We could store this preference in localStorage to avoid showing again in this session
    localStorage.setItem('notificationBannerDismissed', 'true');
  };
  
  if (!showBanner) return null;
  
  return (
    <PermissionBanner show={showBanner}>
      <IconContainer>
        <FaBell />
      </IconContainer>
      
      <BannerContent>
        <BannerTitle>Enable Task Reminders</BannerTitle>
        <BannerText>
          Allow notifications to get reminders for your tasks and stay on track with your goals.
        </BannerText>
      </BannerContent>
      
      <ButtonsContainer>
        <PermissionButton onClick={dismissBanner}>
          Not Now
        </PermissionButton>
        <PermissionButton primary onClick={handleRequestPermission}>
          Enable
        </PermissionButton>
        <CloseButton onClick={dismissBanner} aria-label="Close">
          <FaTimes />
        </CloseButton>
      </ButtonsContainer>
    </PermissionBanner>
  );
};

export default NotificationsPermission; 