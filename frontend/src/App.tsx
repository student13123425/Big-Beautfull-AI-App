import { useEffect, useState, useRef } from 'react';
import type { Config, StudyGroup, StyleConfigList } from './scripts/objects';
import { get_config, get_data, getAvailableStyles, getSupportedModels, getValidStudyLmstudio} from './scripts/network';
import Main from './pages/Main';
import LoadingScreen from './components/Main/LoadingScreen';
import "./scss/main.scss";
import NetworkErrorPage from './pages/NetworkErrorPage';
import LMStudioConnectionError from './pages/LMStudioConnectionError';
import LoginPage from './pages/LoginPage';

let isPollingActive = true;

function App() {
  const [GlobalData, setGlobalData] = useState<null | StudyGroup>(null);
  const [Error, setError] = useState<null | string>(null);
  const [IsLmstudio, setIsLmstudio] = useState<string>("all valid");
  const [config, setConfig] = useState<null | Config>(null);
  const [SupportedModels,setSupportedModel]=useState<string[]>([])
  const [LogInToken,setLogInToken]=useState<string|null>("bypassed");
  const [HtmlPosibleStyles,setHtmlPosibleStyles]=useState<StyleConfigList|null>(null)

  async function update_data(setGlobalData:Function, setError:Function){
    if (!isPollingActive) return;

    await get_data(setGlobalData, setError);

    setTimeout(() => {
        if (isPollingActive) {
            update_data(setGlobalData,setError)
        }
    }, 200);
  }

  async function update_config(setConfig:Function, setError:Function){
    if (!isPollingActive) return;

    await get_config(setConfig, setError);

    setTimeout(() => {
        if (isPollingActive) {
            update_config(setConfig,setError)
        }
    }, 200);
  }
  
  useEffect(() => {
    isPollingActive = true;

    update_data(setGlobalData, setError);
    update_config(setConfig, setError);

    getSupportedModels(setSupportedModel, setError);
    getAvailableStyles(setHtmlPosibleStyles, setError);

    return () => {
      isPollingActive = false;
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
  
  if(LogInToken==null){
    return <LoginPage onLoginSuccess={(token: string) => setLogInToken(token)} setError={setError} />;
  }
  
  if(GlobalData === null && Error == null){
    return <LoadingScreen />;
  }
  
  return (
    <>
      <Main HtmlPosibleStyles={HtmlPosibleStyles} SupportedModels={SupportedModels} setConfig={setConfig} config={config} onError={setError} GlobalData={GlobalData} />
    </>
  );
}

export default App;
