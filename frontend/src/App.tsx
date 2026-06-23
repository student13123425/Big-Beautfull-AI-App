import { useEffect, useState, useRef } from 'react';
import type { Config, StudyGroup, StyleConfigList } from './scripts/objects';
import { get_config, get_data, getAvailableStyles, getSupportedModels, getValidStudyLmstudio} from './scripts/network';
import Main from './pages/Main';
import LoadingScreen from './components/Main/LoadingScreen';
import "./scss/main.scss";
import NetworkErrorPage from './pages/NetworkErrorPage';
import LMStudioConnectionError from './pages/LMStudioConnectionError';
import LoginPage from './pages/LoginPage';

function App() {
  // Ref to track if polling should continue - prevents memory leaks and stuck loading states
  const pollingActive = useRef(true);
  
  const [GlobalData, setGlobalData] = useState<null | StudyGroup>(null);
  const [Error, setError] = useState<null | string>(null);
  const [IsLmstudio, setIsLmstudio] = useState<string>("all valid");
  const [config, setConfig] = useState<null | Config>(null);
  const [SupportedModels,setSupportedModel]=useState<string[]>([])
  const [LogInToken,setLogInToken]=useState<string|null>("bypassed"); // Bypass login page - set to null to require login
  const [HtmlPosibleStyles,setHtmlPosibleStyles]=useState<StyleConfigList|null>(null)

  async function update_data(setGlobalData:Function, setError:Function){
    // Check if polling is still active before making request
    if (!pollingActive.current) return;
    
    await get_data(setGlobalData, setError);
    
    // Only continue polling if we haven't received data and no critical error occurred
    setTimeout(() => {
        if (pollingActive.current) {
            update_data(setGlobalData,setError)
        }
    }, 50);
  }

  async function update_config(setConfig:Function, setError:Function){
    // Check if polling is still active before making request
    if (!pollingActive.current) return;
    
    await get_config(setConfig, setError);
    
    // Only continue polling if we haven't received config and no critical error occurred
    setTimeout(() => {
        if (pollingActive.current) {
            update_config(setConfig,setError)
        }
    }, 50);
  }
  
  useEffect(() => {
    // Start polling for data and config
    update_data(setGlobalData, setError);
    update_config(setConfig, setError);
    
    // One-time fetches for supported models and styles (no continuous polling needed)
    getSupportedModels(setSupportedModel, setError);
    getAvailableStyles(setHtmlPosibleStyles, setError);
    
    // Cleanup function to stop all polling when component unmounts or dependencies change
    return () => {
      console.log('App unmounting - stopping polling loops');
      pollingActive.current = false;
    };
  }, []);

  if (Error != null) console.log(Error);
  
  // If there's a network error, show the NetworkErrorPage
  if (Error != null && Error !== "all valid") {
    return (
      <>
        <NetworkErrorPage errorMessage={Error} />
      </>
    );
  }
  
  // Check for LM Studio connection issues
  if (IsLmstudio !== "all valid" && IsLmstudio != null) {
    return (
      <>
        <LMStudioConnectionError errorMessage={IsLmstudio} />
      </>
    );
  }
  
  // If no login token, show LoginPage
  if(LogInToken==null){
    return <LoginPage onLoginSuccess={(token: string) => setLogInToken(token)} setError={setError} />;
  }
  
  // If GlobalData is null but there's no error, still show loading (this can happen during initial load)
  if(GlobalData === null && Error == null){
    return <LoadingScreen />;
  }
  
  // Render main app when we have valid data
  return (
    <>
      <Main HtmlPosibleStyles={HtmlPosibleStyles} SupportedModels={SupportedModels} setConfig={setConfig} config={config} onError={setError} GlobalData={GlobalData} />
    </>
  );
}

export default App;
