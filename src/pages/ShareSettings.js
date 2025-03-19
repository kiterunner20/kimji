import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateShareSettings, regenerateShareToken } from '../services/auth';
import styled from 'styled-components';

// Styled components
const SettingsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 15px;
`;

const SettingsSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  margin-bottom: 5px;
`;

const FormToggle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ToggleLabel = styled.label`
  margin-left: 10px;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleSlider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => (props.active ? '#28a745' : '#ccc')};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${props => props.active ? 'translateX(26px)' : '0'};
  }
`;

const ShareLinkContainer = styled.div`
  background: #e9ecef;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShareLink = styled.code`
  word-break: break-all;
  font-family: monospace;
  flex: 1;
`;

const CopyButton = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #2e59d9;
  }
`;

const RegenerateButton = styled.button`
  padding: 8px 15px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #c82333;
  }
`;

const SaveButton = styled.button`
  padding: 10px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 20px;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #a3d7b5;
    cursor: not-allowed;
  }
`;

const NotificationBanner = styled.div`
  padding: 15px;
  background: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const CategoryGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const ShareSettings = () => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [categories, setCategories] = useState({
    personal_growth: true,
    emotional_health: true,
    mental_fitness: true,
    physical_health: true,
    relationships: true,
    social: true,
    financial: false,
    mindfulness: true
  });
  const [partnerEmail, setPartnerEmail] = useState('');
  const [dailySummary, setDailySummary] = useState(false);
  const [shareToken, setShareToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load existing settings
  useEffect(() => {
    if (userData && userData.shareSettings) {
      setIsEnabled(userData.shareSettings.isEnabled || false);
      setCategories(userData.shareSettings.categories || categories);
      setPartnerEmail(userData.shareSettings.partnerEmail || '');
      setDailySummary(userData.shareSettings.dailySummary || false);
    }
    
    if (userData) {
      setShareToken(userData.shareToken || '');
    }
  }, [userData]);

  const handleCategoryToggle = (category) => {
    setCategories({
      ...categories,
      [category]: !categories[category]
    });
  };

  const handleSaveSettings = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const settings = {
        isEnabled,
        categories,
        partnerEmail,
        dailySummary
      };
      
      await updateShareSettings(currentUser.uid, settings);
      await refreshUserData();
      
      setNotification({
        type: 'success',
        message: 'Share settings updated successfully!'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving share settings:", error);
      setNotification({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateToken = async () => {
    if (!currentUser) return;
    
    if (window.confirm("Are you sure you want to regenerate your share token? This will invalidate any existing share links.")) {
      setLoading(true);
      try {
        const newToken = await regenerateShareToken(currentUser.uid);
        setShareToken(newToken);
        await refreshUserData();
        
        setNotification({
          type: 'success',
          message: 'Share token regenerated successfully!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      } catch (error) {
        console.error("Error regenerating token:", error);
        setNotification({
          type: 'error',
          message: 'Failed to regenerate token. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/partner/${shareToken}`;
    navigator.clipboard.writeText(shareLink).then(
      () => {
        setNotification({
          type: 'success',
          message: 'Share link copied to clipboard!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        setNotification({
          type: 'error',
          message: 'Failed to copy link. Please try selecting and copying manually.'
        });
      }
    );
  };

  const categoryNames = {
    personal_growth: 'Personal Growth',
    emotional_health: 'Emotional Health',
    mental_fitness: 'Mental Fitness',
    physical_health: 'Physical Health',
    relationships: 'Relationships',
    social: 'Social',
    financial: 'Financial',
    mindfulness: 'Mindfulness'
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>Share Settings</h1>
        <p>Configure how you share your transformation journey with others</p>
      </SettingsHeader>

      {notification && (
        <NotificationBanner success={notification.type === 'success'}>
          {notification.message}
        </NotificationBanner>
      )}

      <SettingsSection>
        <h2>Progress Sharing</h2>
        
        <FormToggle>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={isEnabled} 
              onChange={() => setIsEnabled(!isEnabled)} 
              style={{ opacity: 0, width: 0, height: 0 }} 
            />
            <ToggleSlider active={isEnabled} />
          </ToggleSwitch>
          <ToggleLabel onClick={() => setIsEnabled(!isEnabled)}>
            Enable progress sharing
          </ToggleLabel>
        </FormToggle>
        
        {isEnabled && (
          <>
            <FormGroup>
              <FormLabel>Share Link</FormLabel>
              <ShareLinkContainer>
                <ShareLink>{`${window.location.origin}/partner/${shareToken}`}</ShareLink>
                <CopyButton onClick={copyShareLink}>Copy Link</CopyButton>
              </ShareLinkContainer>
              <RegenerateButton onClick={handleRegenerateToken}>
                Regenerate Share Link
              </RegenerateButton>
              <p style={{ fontSize: '0.9em', marginTop: '10px', color: '#6c757d' }}>
                Anyone with this link can view your progress. Regenerate if you want to revoke access.
              </p>
            </FormGroup>

            <FormGroup>
              <FormLabel>Partner Email (for daily summaries)</FormLabel>
              <FormInput 
                type="email" 
                value={partnerEmail} 
                onChange={(e) => setPartnerEmail(e.target.value)} 
                placeholder="partner@example.com" 
              />
              <FormToggle>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={dailySummary} 
                    onChange={() => setDailySummary(!dailySummary)} 
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <ToggleSlider active={dailySummary} />
                </ToggleSwitch>
                <ToggleLabel onClick={() => setDailySummary(!dailySummary)}>
                  Send daily progress summary to partner
                </ToggleLabel>
              </FormToggle>
            </FormGroup>

            <FormGroup>
              <FormLabel>Categories to Share</FormLabel>
              <p>Select which categories your partner can see:</p>
              <CategoryGroup>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <FormToggle key={key}>
                    <ToggleSwitch>
                      <input 
                        type="checkbox" 
                        checked={categories[key]} 
                        onChange={() => handleCategoryToggle(key)} 
                        style={{ opacity: 0, width: 0, height: 0 }} 
                      />
                      <ToggleSlider active={categories[key]} />
                    </ToggleSwitch>
                    <ToggleLabel onClick={() => handleCategoryToggle(key)}>
                      {name}
                    </ToggleLabel>
                  </FormToggle>
                ))}
              </CategoryGroup>
            </FormGroup>
          </>
        )}
        
        <SaveButton onClick={handleSaveSettings} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </SaveButton>
      </SettingsSection>
    </SettingsContainer>
  );
};

export default ShareSettings; 