import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaUser, 
  FaBell, 
  FaPalette, 
  FaInfoCircle, 
  FaMoon, 
  FaSun, 
  FaDownload,
  FaCheck
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const SettingsContainer = styled.div`
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

const SettingsCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
  
  @media (prefers-color-scheme: dark) {
    border-bottom-color: var(--gray-700);
  }
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-300);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  
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

const TimeInput = styled(Input).attrs({ type: 'time' })`
  width: 150px;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  @media (prefers-color-scheme: dark) {
    border-bottom-color: var(--gray-700);
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingTitle = styled.span`
  font-weight: 500;
  color: var(--gray-800);
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-100);
  }
`;

const SettingDescription = styled.span`
  font-size: 0.8rem;
  color: var(--gray-600);
  margin-top: 0.25rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-400);
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: var(--transition);
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: var(--transition);
    border-radius: 50%;
  }
  
  input:checked + & {
    background-color: var(--primary);
  }
  
  input:checked + &:before {
    transform: translateX(24px);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
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
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray-200);
  color: var(--gray-800);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--gray-300);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-700);
    color: var(--gray-200);
    
    &:hover {
      background-color: var(--gray-600);
    }
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NotificationTime = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  span {
    width: 100px;
    color: var(--gray-700);
    
    @media (prefers-color-scheme: dark) {
      color: var(--gray-300);
    }
  }
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ThemeOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'transparent'};
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-sm);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--gray-800);
  }
`;

const ThemeColor = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-bottom: 0.5rem;
  box-shadow: var(--box-shadow-sm);
`;

const ThemeName = styled.span`
  font-size: 0.8rem;
  color: var(--gray-800);
  margin-top: 0.5rem;
  
  @media (prefers-color-scheme: dark) {
    color: var(--gray-200);
  }
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
`;

const Settings = () => {
  const { 
    profile, 
    darkMode, 
    notifications, 
    notificationTimes,
    theme,
    themes,
    weekPlan,
    stats,
    dispatch
  } = useAppContext();
  
  const [name, setName] = useState(profile.name || '');
  const [wakeUpTime, setWakeUpTime] = useState(profile.wakeUpTime || '07:00');
  const [sleepTime, setSleepTime] = useState(profile.sleepTime || '22:00');
  const [morningNotification, setMorningNotification] = useState(notificationTimes.morning || '08:00');
  const [afternoonNotification, setAfternoonNotification] = useState(notificationTimes.afternoon || '13:00');
  const [eveningNotification, setEveningNotification] = useState(notificationTimes.evening || '20:00');
  
  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        name,
        wakeUpTime,
        sleepTime
      }
    });
    
    dispatch({
      type: 'UPDATE_NOTIFICATION_TIMES',
      payload: {
        morning: morningNotification,
        afternoon: afternoonNotification,
        evening: eveningNotification
      }
    });
    
    alert('Settings saved successfully!');
  };
  
  const handleToggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };
  
  const handleToggleNotifications = () => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  };
  
  const handleExportData = () => {
    const userData = {
      profile,
      weekPlan,
      stats,
      settings: {
        darkMode,
        notifications,
        notificationTimes
      }
    };
    
    const dataStr = JSON.stringify(userData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'kimji_transform_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleThemeChange = (themeId) => {
    dispatch({ type: 'SET_THEME', payload: themeId });
  };
  
  return (
    <SettingsContainer>
      <Title>Settings</Title>
      <Subheading>
        Customize your Kimji ❤️ experience to fit your needs.
      </Subheading>
      
      <SettingsCard>
        <CardHeader>
          <CardIcon color="var(--primary)">
            <FaUser />
          </CardIcon>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        
        <FormGroup>
          <Label>Your Name</Label>
          <Input 
            type="text" 
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        
        <TwoColumnGrid>
          <FormGroup>
            <Label>Wake-up Time</Label>
            <TimeInput 
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Sleep Time</Label>
            <TimeInput 
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
          </FormGroup>
        </TwoColumnGrid>
      </SettingsCard>
      
      <SettingsCard>
        <CardHeader>
          <CardIcon color="#F59E0B">
            <FaBell />
          </CardIcon>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        
        <SettingRow>
          <SettingLabel>
            <SettingTitle>Enable Notifications</SettingTitle>
            <SettingDescription>Receive reminders for your daily tasks</SettingDescription>
          </SettingLabel>
          
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={notifications}
              onChange={handleToggleNotifications}
            />
            <Slider />
          </ToggleSwitch>
        </SettingRow>
        
        {notifications && (
          <>
            <Label style={{ marginTop: '1rem' }}>Notification Times</Label>
            
            <NotificationTime>
              <span>Morning:</span>
              <TimeInput 
                value={morningNotification}
                onChange={(e) => setMorningNotification(e.target.value)}
              />
            </NotificationTime>
            
            <NotificationTime>
              <span>Afternoon:</span>
              <TimeInput 
                value={afternoonNotification}
                onChange={(e) => setAfternoonNotification(e.target.value)}
              />
            </NotificationTime>
            
            <NotificationTime>
              <span>Evening:</span>
              <TimeInput 
                value={eveningNotification}
                onChange={(e) => setEveningNotification(e.target.value)}
              />
            </NotificationTime>
          </>
        )}
      </SettingsCard>
      
      <SettingsCard>
        <CardHeader>
          <CardIcon color="#4ADE80">
            <FaPalette />
          </CardIcon>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        
        <SettingRow>
          <SettingLabel>
            <SettingTitle>Dark Mode</SettingTitle>
            <SettingDescription>Switch between light and dark theme</SettingDescription>
          </SettingLabel>
          
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={handleToggleDarkMode}
            />
            <Slider />
          </ToggleSwitch>
        </SettingRow>
        
        <SettingRow>
          <SettingLabel>
            <SettingTitle>Theme</SettingTitle>
            <SettingDescription>Choose your favorite color theme</SettingDescription>
          </SettingLabel>
        </SettingRow>
        
        <ThemeOptions>
          {Object.values(themes).map((themeOption) => (
            <ThemeOption 
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              selected={theme === themeOption.id}
            >
              {theme === themeOption.id && (
                <SelectedIndicator>
                  <FaCheck />
                </SelectedIndicator>
              )}
              <ThemeColor color={themeOption.colors.primary} />
              <ThemeName>{themeOption.name}</ThemeName>
            </ThemeOption>
          ))}
        </ThemeOptions>
      </SettingsCard>
      
      <SettingsCard>
        <CardHeader>
          <CardIcon color="#9D4EDD">
            <FaInfoCircle />
          </CardIcon>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        
        <ExportButton onClick={handleExportData}>
          <FaDownload /> Export Your Data
        </ExportButton>
        
        <SettingDescription>
          Download all your Kimji ❤️ data including tasks, progress, and settings.
        </SettingDescription>
      </SettingsCard>
      
      <SaveButton onClick={handleSaveProfile}>
        {darkMode ? <FaMoon /> : <FaSun />} Save Settings
      </SaveButton>
    </SettingsContainer>
  );
};

export default Settings; 