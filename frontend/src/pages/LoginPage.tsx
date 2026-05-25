import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaLock, FaUser, FaArrowRight, FaUserPlus, FaShieldAlt, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { evaluatePasswordComplexity } from '../scripts/aox';
import { registerUser, loginUser } from '../scripts/network';
import AcknowledgeModal from '../components/Misc/AcknowledgeModal';
import useKeyPress from '../hooks/useKeyPress';

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-8px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
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

const Card = styled.div<{ $isError?: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${props => props.$isError ? shake : scaleIn} 0.4s cubic-bezier(0.215, 0.610, 0.355, 1);
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

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  z-index: 2;
  &:hover {
    color: #3b82f6;
  }
`;

const StyledInput = styled.input<{ $isError?: boolean }>`
  width: 100%;
  padding: 12px 42px 12px 42px;
  border: ${props => props.$isError ? '2px solid #ef4444' : '1px solid #e2e8f0'};
  border-radius: 10px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  background: #fff;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.$isError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
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
  animation: ${fadeIn} 0.3s ease;
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
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const complexity = evaluatePasswordComplexity(formData.password);

  // Handle Enter key press to submit form
  useKeyPress('Enter', () => {
    const form = document.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });

  const triggerModal = (title: string, message: string) => {
    setModalConfig({ show: true, title, message });
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoginFailed || modalConfig) {
      setIsLoginFailed(false);
      setModalConfig(null);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || (isRegistering && !formData.email)) {
      triggerModal("Missing Info", "Please fill in all required fields.");
      return;
    }

    if (isRegistering && formData.password !== formData.confirmPassword) {
      triggerModal("Mismatch", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      if (isRegistering) {
        success = await registerUser(formData.username, formData.email, formData.password, (msg) => {
          triggerModal("Registration Error", msg);
          onError?.(msg);
        });
      } else {
        success = await loginUser(formData.username, formData.password, (msg) => {
          triggerModal("Login Failed", msg);
          onError?.(msg);
        });
      }

      if (success) {
        setIsLoginFailed(false);
        onLoginSuccess("authenticated");
      } else {
        if (!isRegistering) {
          setIsLoginFailed(true);
          triggerModal("Access Denied", "Invalid username or password.");
        }
      }
    } catch (err) {
      triggerModal("Error", "An unexpected error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      {modalConfig && (
        <AcknowledgeModal
          title={modalConfig.title}
          message={modalConfig.message}
          icon={<FaExclamationTriangle size={40} />}
          iconColor="#ef4444"
          onClose={() => setModalConfig(null)}
        />
      )}

      <Card $isError={!isRegistering && isLoginFailed}>
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              $isError={!isRegistering && isLoginFailed}
            />
            <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </PasswordToggle>
          </InputGroup>

          {isRegistering && formData.password && (
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
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </PasswordToggle>
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
            {!isLoading && <FaArrowRight size={16} />}
          </SubmitButton>
        </Form>

        <SwitchButton onClick={() => {
          setIsRegistering(!isRegistering);
          setIsLoginFailed(false);
          setModalConfig(null);
          setShowPassword(false);
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
