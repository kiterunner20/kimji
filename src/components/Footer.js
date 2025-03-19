import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--gray-800);
  color: var(--gray-300);
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  
  a {
    color: var(--gray-300);
    margin: 0 0.5rem;
    font-size: 0.8rem;
    
    &:hover {
      color: white;
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© {currentYear} TransformWeek. All rights reserved.</Copyright>
        <FooterLinks>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 