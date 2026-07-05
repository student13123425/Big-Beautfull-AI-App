import { useEffect, useState, useRef } from 'react';
import type { Config, StudyGroup, StyleConfigList } from './scripts/objects';
import { get_config } from './network/app-config';
import { get_data } from './network/study-groups';
import { getAvailableStyles } from './network/html-generator';
import { getGuestToken, getSupportedModels, getValidStudyLmstudio } from './network/ai-models';
import Main from './pages/Main';
import LoadingScreen from './components/Main/LoadingScreen';
import "./scss/main.scss";
import NetworkErrorPage from './pages/NetworkErrorPage';
import LMStudioConnectionError from './pages/LMStudioConnectionError';
import LoginPage from './pages/LoginPage';

function App() {
  const [GlobalData, setGlobalData] = useState<null | StudyGroup>(null);
  const [Error, setError] = useState<null | string>(null);
  const [IsLmstudio, setIsLmstudio] = useState<string>("all valid");
  const [config, setConfig] = useState<null | Config>(null);
  const [SupportedModels, setSupportedModel] = useState<string[]>([]);
  const [LogInToken, setLogInToken] = useState<string | null>(null);
  const [HtmlPosibleStyles, setHtmlPosibleStyles] = useState<StyleConfigList | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function pollData() {
      if (!isMounted) return;
      await get_data(setGlobalData, setError);
      
      setTimeout(() => {
        if (isMounted) pollData();
      }, 200);
    }

    async function pollConfig() {
      if (!isMounted) return;
      await get_config(setConfig, setError);
      
      setTimeout(() => {
        if (isMounted) pollConfig();
      }, 200);
    }

    pollData();
    pollConfig();

    getSupportedModels(setSupportedModel, setError);
    getAvailableStyles(setHtmlPosibleStyles, setError);

    return () => {
      isMounted = false;
    };
  }, []);

  if (Error != null) console.log(Error);

  if (Error != null && Error !== "all valid") {
    return (
      <>
        <NetworkErrorPage errorMessage={Error} />
      </>
    );
  }
  
  if (IsLmstudio !== "all valid" && IsLmstudio != null) {
    return (
      <>
        <LMStudioConnectionError errorMessage={IsLmstudio} />
      </>
    );
  }
  
  const handleGuestLogin = () => {
    getGuestToken(setLogInToken, setError);
  };

  const handleLogout = () => {
    setLogInToken(null);
  };

  if (LogInToken == null && Error == null) {
    return <LoginPage onLoginSuccess={(token: string) => setLogInToken(token)} onGuestLogin={handleGuestLogin} setError={setError} />;
  }
  
  if (GlobalData === null && Error == null) {
    return <LoadingScreen />;
  }
  
  return (
    <>
      <Main HtmlPosibleStyles={HtmlPosibleStyles} SupportedModels={SupportedModels} setConfig={setConfig} config={config} onError={setError} GlobalData={GlobalData} onLogout={handleLogout} />
    </>
  );
}

export default App;