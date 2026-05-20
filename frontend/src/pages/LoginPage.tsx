import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaLock, FaUser, FaArrowRight, FaUserPlus, FaShieldAlt } from 'react-icons/fa';
import { evaluatePasswordComplexity } from '../scripts/aox';

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${scaleIn} 0.4s cubic-bezier(0.215, 0.610, 0.355, 1);
`;

const LogoIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  position: relative;
  text-align: left;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  background: #fff;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const ComplexityContainer = styled.div`
  margin-top: -0.75rem;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ScoreBar = styled.div<{ $score: number }>`
  height: 4px;
  flex: 1;
  display: flex;
  gap: 2px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => (props.$score / 5) * 100}%;
    background: ${props => {
      if (props.$score <= 2) return '#ef4444';
      if (props.$score <= 3) return '#f59e0b';
      return '#10b981';
    }};
    transition: width 0.3s ease;
  }
`;

const FeedbackText = styled.span<{ $score: number }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => {
    if (props.$score <= 2) return '#ef4444';
    if (props.$score <= 3) return '#f59e0b';
    return '#10b981';
  }};
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.85rem;
  margin-top: 1.5rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

interface AuthProps {
  onLoginSuccess: (token: string | null) => void;
  onError?: (msg: string) => void;
}

const AuthPage: React.FC<AuthProps> = ({ onLoginSuccess, onError }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const complexity = evaluatePasswordComplexity(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || (isRegistering && !formData.email)) {
      onError?.("Please fill in all required fields");
      return;
    }

    if (isRegistering && formData.password !== formData.confirmPassword) {
      onError?.("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(null);
    }, 1500);
  };

  return (
    <PageContainer>
      <Card>
        <LogoIcon>
          {isRegistering ? <FaUserPlus /> : <FaLock />}
        </LogoIcon>

        <Title>{isRegistering ? 'Create Account' : 'Welcome Back'}</Title>
        <Subtitle>
          {isRegistering ? 'Join us to start your journey' : 'Please enter your credentials'}
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon><FaUser size={16} /></InputIcon>
            <StyledInput
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </InputGroup>

          {isRegistering && (
            <InputGroup>
              <InputIcon><FaUser size={16} /></InputIcon>
              <StyledInput
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </InputGroup>
          )}

          <InputGroup>
            <InputIcon><FaLock size={16} /></InputIcon>
            <StyledInput
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </InputGroup>

          {formData.password && (
            <ComplexityContainer>
              <ScoreBar $score={complexity.score} />
              <FeedbackText $score={complexity.score}>
                <FaShieldAlt size={12} style={{ marginRight: '4px' }} />
                {complexity.feedback[0]}
              </FeedbackText>
            </ComplexityContainer>
          )}

          {isRegistering && (
            <InputGroup>
              <InputIcon><FaLock size={16} /></InputIcon>
              <StyledInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
            {!isLoading && <FaArrowRight size={16} />}
          </SubmitButton>
        </Form>

        <SwitchButton onClick={() => {
          setIsRegistering(!isRegistering);
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        }}>
          {isRegistering 
            ? 'Already have an account? Log in' 
            : 'Don\'t have an account? Create one'}
        </SwitchButton>
      </Card>
    </PageContainer>
  );
};

export default AuthPage;
