import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { FaLock, FaUser, FaArrowRight, FaUserPlus, FaShieldAlt, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { evaluatePasswordComplexity } from '../scripts/aox';
import { registerUser, loginUser } from '../network/auth';
import AcknowledgeModal from '../components/Misc/AcknowledgeModal';
import useKeyPress from '../hooks/useKeyPress';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-6px); }
`;

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  position: relative;
`;

const Card = styled.div<{ $isError?: boolean }>`
  background: #ffffff;
  padding: 3.5rem 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  text-align: center;
  position: relative;
  z-index: 10;
  animation: ${props => props.$isError ? shake : fadeInUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
    max-width: 90%;
  }
`;

const LogoIcon = styled.div`
  width: 56px;
  height: 56px;
  background: rgba(37, 99, 235, 0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #2563eb;
  font-size: 1.5rem;
`;

const Title = styled.h1`
  color: #0f172a;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.5;
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
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 14px;
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
  transition: color 0.2s ease;

  &:hover {
    color: #475569;
  }
`;

const StyledInput = styled.input<{ $isError?: boolean }>`
  width: 100%;
  padding: 14px 42px;
  border: 1px solid ${props => props.$isError ? '#ef4444' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  background: #f8fafc;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: ${props => props.$isError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 4px ${props => props.$isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const ComplexityContainer = styled.div`
  margin-top: -0.5rem;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${fadeInUp} 0.3s ease;
  text-align: left;
`;

const ScoreBar = styled.div<{ $score: number }>`
  height: 4px;
  width: 100%;
  display: flex;
  gap: 4px;
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
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const FeedbackText = styled.span<{ $score: number }>`
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: ${props => {
    if (props.$score <= 2) return '#ef4444';
    if (props.$score <= 3) return '#f59e0b';
    return '#10b981';
  }};
`;

const SubmitButton = styled.button`
  margin-top: 0.5rem;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #475569;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;

  span {
    color: #2563eb;
    font-weight: 600;
  }

  &:hover span {
    text-decoration: underline;
  }
`;

const GuestButton = styled.button`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 1rem;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 1.5rem;
  padding: 8px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: #475569;
  }
`;

interface AuthProps {
  onLoginSuccess: (userId: string | null) => void;
  onGuestLogin?: () => void;
  onBackToHome?: () => void;
  onError?: (msg: string) => void;
}

const AuthPage: React.FC<AuthProps> = ({ onLoginSuccess, onGuestLogin, onBackToHome, onError }) => {
  useDocumentTitle('AI App - Login');
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

        <Title>{isRegistering ? 'Create an account' : 'Welcome back'}</Title>
        <Subtitle>
          {isRegistering ? 'Enter your details to get started' : 'Please enter your credentials to continue'}
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
                placeholder="Email address"
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
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </PasswordToggle>
          </InputGroup>

          {isRegistering && formData.password && (
            <ComplexityContainer>
              <ScoreBar $score={complexity.score} />
              <FeedbackText $score={complexity.score}>
                <FaShieldAlt size={12} style={{ marginRight: '6px' }} />
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
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </PasswordToggle>
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isRegistering ? 'Sign up' : 'Sign in')}
            {!isLoading && <FaArrowRight size={14} />}
          </SubmitButton>
        </Form>

        <SwitchButton onClick={() => {
          setIsRegistering(!isRegistering);
          setIsLoginFailed(false);
          setModalConfig(null);
          setShowPassword(false);
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        }}>
          {isRegistering ? (
            <>Already have an account? <span>Log in</span></>
          ) : (
            <>Don't have an account? <span>Create one</span></>
          )}
        </SwitchButton>

        {onGuestLogin && (
          <GuestButton type="button" onClick={onGuestLogin}>
            <FaUser size={14} />
            Continue as guest
          </GuestButton>
        )}

        {onBackToHome && (
          <div>
            <BackButton type="button" onClick={onBackToHome}>
              ← Back to home
            </BackButton>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default AuthPage;