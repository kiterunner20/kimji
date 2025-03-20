import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  padding: 2rem 0 1.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: all var(--duration-md) var(--animation-standard);
  
  .dark-mode & {
    background-color: rgba(31, 41, 55, 0.85);
    border-top-color: rgba(255, 255, 255, 0.05);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  color: var(--gray-600);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all var(--duration-md) var(--animation-standard);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: var(--primary);
    transition: width var(--duration-md) var(--animation-standard);
    border-radius: var(--border-radius-pill);
  }
  
  &:hover {
    color: var(--primary);
    transform: translateY(-2px);
    
    &:after {
      width: 100%;
    }
  }
  
  .dark-mode & {
    color: var(--gray-400);
    
    &:hover {
      color: var(--primary-light);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: var(--gray-600);
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circular);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-md) var(--animation-standard);
  background-color: var(--gray-100);
  
  &:hover {
    color: var(--primary);
    transform: translateY(-3px) scale(1.1);
    background-color: var(--primary-light);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }
  
  .dark-mode & {
    color: var(--gray-300);
    background-color: var(--gray-800);
    
    &:hover {
      color: var(--primary-light);
      background-color: rgba(139, 92, 246, 0.2);
    }
  }
`;

const Copyright = styled.p`
  color: var(--gray-500);
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  
  .heart {
    color: var(--pink);
    margin: 0 0.25rem;
    animation: pulse 1.5s infinite;
    display: inline-flex;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  .highlight {
    color: var(--primary);
    font-weight: 600;
    margin: 0 0.25rem;
  }
  
  .dark-mode & {
    color: var(--gray-400);
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  border-radius: var(--border-radius-pill);
  margin-bottom: 1.5rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer className="footer">
      <FooterContent>
        <SocialLinks>
          <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </SocialIcon>
          <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </SocialIcon>
          <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </SocialIcon>
          <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </SocialIcon>
        </SocialLinks>
        
        <FooterLinks>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
        </FooterLinks>
        
        <Divider />
        
        <Copyright>
          © {currentYear} Kimji Transform. Made with 
          <span className="heart"><FaHeart /></span> 
          by <span className="highlight">Kimji</span>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 