import { useEffect, useState } from 'react';
import type { Config, StudyGroup, StyleConfigList } from './scripts/objects';
import { get_config, get_data, getAvailableStyles, getSupportedModels, getValidStudyLmstudio} from './scripts/network';
import Main from './pages/Main';
import "./scss/main.scss";
import NetworkErrorPage from './pages/NetworkErrorPage';
import LMStudioConnectionError from './pages/LMStudioConnectionError';
import LoginPage from './pages/LoginPage';

async function update_data(setGlobalData:Function, setError:Function){
  await get_data(setGlobalData, setError);
  setTimeout(() => {
      update_data(setGlobalData,setError)
  }, 50);
}

async function update_config(setConfig:Function, setError:Function){
  await get_config(setConfig, setError);
  setTimeout(() => {
      update_config(setConfig,setError)
  }, 50);
}


function App() {
  const [GlobalData, setGlobalData] = useState<null | StudyGroup>(null);
  const [Error, setError] = useState<null | string>(null);
  const [IsLmstudio, setIsLmstudio] = useState<string>("all valid");
  const [config, setConfig] = useState<null | Config>(null);
  const [SupportedModels,setSupportedModel]=useState<string[]>([])
  const [LogInToken,setLogInToken]=useState<string|null>('dsgds');
  const [HtmlPosibleStyles,setHtmlPosibleStyles]=useState<StyleConfigList|null>(null)
  useEffect(() => {
    update_data(setGlobalData,setError)
    update_config(setConfig,setError)
    getSupportedModels(setSupportedModel,setError)
    getAvailableStyles(setHtmlPosibleStyles,setError);
  }, []);

  if (Error != null) console.log(Error);
  
  if (Error == null) {
    if(LogInToken==null){
      return <LoginPage onLogin={(u:string,p:string)=>{}} setError={setError} />
    }
    return (
      <>
        <Main HtmlPosibleStyles={HtmlPosibleStyles} SupportedModels={SupportedModels} setConfig={setConfig} config={config} onError={setError} GlobalData={GlobalData} />
      </>
    );
  } else if (IsLmstudio !== "all valid") {
    return (
      <>
        <LMStudioConnectionError errorMessage={IsLmstudio} />
      </>
    );
  } else {
    return (
      <>
        <NetworkErrorPage errorMessage={Error} />
      </>
    );
  }
}

export default App;
