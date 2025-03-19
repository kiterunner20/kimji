import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: var(--primary);
  color: white;
  padding: 1rem;
  box-shadow: var(--box-shadow);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const MenuItems = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => (props.isOpen ? '0' : '-100%')};
    width: 70%;
    height: 100vh;
    flex-direction: column;
    background-color: var(--primary);
    padding: 4rem 2rem;
    transition: var(--transition);
    z-index: 10;
  }
`;

const NavItem = styled(Link)`
  margin: 0 1rem;
  color: white;
  font-weight: 500;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: ${props => (props.active ? '100%' : '0')};
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: white;
    transition: var(--transition);
  }
  
  &:hover:after {
    width: 100%;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }
`;

const ThemeButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 20;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 5;
`;

const Header = () => {
  const { darkMode, dispatch } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  return (
    <HeaderContainer>
      <Nav>
        <Logo>TransformWeek</Logo>
        
        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
        
        <Overlay isOpen={menuOpen} onClick={closeMenu} />
        
        <MenuItems isOpen={menuOpen}>
          <NavItem to="/" active={location.pathname === '/' ? 1 : 0} onClick={closeMenu}>
            Home
          </NavItem>
          <NavItem to="/progress" active={location.pathname === '/progress' ? 1 : 0} onClick={closeMenu}>
            Progress
          </NavItem>
          <NavItem to="/reflection" active={location.pathname === '/reflection' ? 1 : 0} onClick={closeMenu}>
            Reflection
          </NavItem>
          <NavItem to="/settings" active={location.pathname === '/settings' ? 1 : 0} onClick={closeMenu}>
            Settings
          </NavItem>
          
          <ThemeButton onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </ThemeButton>
        </MenuItems>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 