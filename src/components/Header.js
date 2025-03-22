import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { FaSun, FaMoon, FaBars, FaTimes, FaHome, FaChartLine, FaPencilAlt, FaCog, FaRegLightbulb } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.85);
  color: var(--gray-900);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all var(--duration-md) var(--animation-standard);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  .dark-mode & {
    background-color: rgba(31, 41, 55, 0.85);
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const AppBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  display: flex;
  align-items: center;
  letter-spacing: -0.5px;
  transition: all var(--duration-md) var(--animation-standard);

  &:hover {
    transform: translateY(-1px);
  }

  span {
    margin-left: var(--spacing-xs);
  }
  
  svg {
    font-size: 1.3rem;
  }
`;

const MenuItems = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => (props.isOpen ? '0' : '-100%')};
    width: 280px;
    height: 100vh;
    flex-direction: column;
    background-color: var(--light);
    padding: 80px var(--spacing-md) var(--spacing-md);
    transition: right var(--duration-md) var(--animation-standard);
    z-index: 10;
    box-shadow: var(--shadow-16);
    align-items: flex-start;
    
    .dark-mode & {
      background-color: var(--gray-800);
    }
  }
`;

const NavItem = styled(Link)`
  margin: 0 var(--spacing-sm);
  color: var(--gray-700);
  font-weight: 500;
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-pill);
  transition: all var(--duration-md) var(--animation-standard);
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  letter-spacing: 0.1px;
  position: relative;
  
  svg {
    margin-right: var(--spacing-sm);
    font-size: 1.1rem;
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: var(--primary);
    transform: translateY(-2px);
  }
  
  ${props => props.active && `
    color: var(--primary);
    background-color: var(--primary-light);
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 7px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background-color: var(--primary);
      border-radius: var(--border-radius-pill);
    }
    
    &:hover {
      background-color: var(--primary-light);
    }
  `}
  
  @media (max-width: 768px) {
    margin: 0;
    padding: var(--spacing-md);
    width: 100%;
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-xs);
    
    ${props => props.active && `
      &::after {
        left: 10px;
        bottom: 15px;
        transform: none;
      }
    `}
  }
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circular);
  border: none;
  background-color: ${props => (props.isDarkMode ? 'var(--primary-light)' : 'var(--primary-light)')};
  color: ${props => (props.isDarkMode ? 'var(--primary)' : 'var(--primary)')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: var(--spacing-md);
  transition: all var(--duration-md) var(--animation-standard);
  
  &:hover {
    transform: rotate(12deg) scale(1.1);
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.5);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circular);
  border: none;
  background: ${props => (props.isOpen ? 'var(--primary)' : 'var(--primary-light)')};
  color: ${props => (props.isOpen ? 'white' : 'var(--primary)')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-md) var(--animation-standard);
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 5;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity var(--duration-md) var(--animation-standard), visibility var(--duration-md) var(--animation-standard);
`;

const LogoText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1;
  
  .app-name {
    font-weight: 700;
    display: block;
    font-size: 1.2rem;
    letter-spacing: -0.5px;
  }
  
  .app-tagline {
    font-size: 0.7rem;
    opacity: 0.65;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <HeaderContainer className="header">
      <HeaderInner>
        <AppBar>
          <Logo to="/">
            <FaRegLightbulb />
            <LogoText>
              <span className="app-name">Kimji Transform</span>
              <span className="app-tagline">Challenge</span>
            </LogoText>
          </Logo>
          
          <MenuItems isOpen={menuOpen}>
            <NavItem 
              to="/" 
              active={isActive('/')} 
              onClick={closeMenu}
            >
              <FaHome /> Home
            </NavItem>
            <NavItem 
              to="/progress" 
              active={isActive('/progress')} 
              onClick={closeMenu}
            >
              <FaChartLine /> Progress
            </NavItem>
            <NavItem 
              to="/reflection" 
              active={isActive('/reflection')} 
              onClick={closeMenu}
            >
              <FaPencilAlt /> Reflection
            </NavItem>
            <NavItem 
              to="/settings" 
              active={isActive('/settings')} 
              onClick={closeMenu}
            >
              <FaCog /> Settings
            </NavItem>
          </MenuItems>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle 
              onClick={toggleDarkMode} 
              isDarkMode={darkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
            <MobileMenuButton 
              onClick={toggleMenu} 
              isOpen={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </MobileMenuButton>
          </div>
        </AppBar>
      </HeaderInner>
      <Overlay isOpen={menuOpen} onClick={closeMenu} />
    </HeaderContainer>
  );
};

export default Header; 