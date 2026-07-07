import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useDocumentTitle from '../hooks/useDocumentTitle'
import type { AiServerError, Config, StudyGroup, StyleConfigList } from '../scripts/objects'

let lastGlobalDataHash: string = '';
function getStudyGroupHash(data: StudyGroup): string {
  let hash = '';
  for (const materie of data.data) {
    hash += `${materie.name}:`;
    for (const file of materie.files) {
      hash += `${file.path}=${file.sinteza?.length ?? -1},${file.html_file?.length ?? -1}|`;
    }
  }
  return hash;
}
import TopBar from '../components/Main/TopBar'
import Materie from '../components/Main/Materie'
import SettingsPage from './SettingsPage'
import ErrorModal from '../components/Misc/ErrorModal'
import { DeactivateErrorMessage } from '../network/app-config'
import LoadingScreen from '../components/Main/LoadingScreen'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  min-height: 0;
  min-width: 0;
`

const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const Hide=styled.div`
  display: none;
`

export default function Main(props: { 
  GlobalData: null | StudyGroup, 
  onError: Function,
  config:Config,
  setConfig:Function,
  SupportedModels:string[],
  HtmlPosibleStyles:StyleConfigList|null,
  onLogout?: () => void,
  userId?: string | null
}) {
  const [Selected, setSelected] = useState<null | string>(null);
  const [IsSetings,setIsSetings]=useState<boolean>(false)
  const [ErrorMessage,setErrorMessages]=useState<AiServerError[]>([])

  // Dynamic page title based on selection state (hook called at top level for React rules compliance)
  const currentTitle = (() => {
    if (!Selected) return 'AI App';
    const file = props.GlobalData?.data.flatMap((m: any) => m.files).find((f: any) => f.path === Selected);
    if (file) {
      const fileName = (file.path as string).split('/').pop()?.split('.')[0] || Selected;
      return `AI App - ${fileName}`;
    }
    return 'AI App';
  })();
  useDocumentTitle(currentTitle);

  useEffect(() => {
    if (props.GlobalData) {
      const currentHash = getStudyGroupHash(props.GlobalData);
      if (currentHash !== lastGlobalDataHash) {
        lastGlobalDataHash = currentHash;
      }
      setErrorMessages(props.GlobalData.AiServerError)
    }
  }, [props.GlobalData?.AiServerError, props.GlobalData]);
  if (props.GlobalData !== null) {
    return (
      <>
      {ErrorMessage.length>0?<ErrorModal key={9999} onClose={()=>{
        DeactivateErrorMessage(ErrorMessage.length-1,props.onError)
      }} error={ErrorMessage[ErrorMessage.length-1]}/>:<Hide/>}
      <Container>
        <TopBar 
        setIsSetings={setIsSetings}
          onDelete={(it) => {}} 
          IsSetings={IsSetings}
          onError={props.onError} 
          onLogout={props.onLogout}
          setSelected={setSelected} 
          Selected={Selected ?? null}
          key={Selected ?? 'none'}
          data={props.GlobalData}
          language={props.config?.limba || 'romana'}
          userId={props.userId}
        />
        <ContentArea>
          {IsSetings===true?<SettingsPage HtmlPosibleStyles={props.HtmlPosibleStyles} SupportedModels={props.SupportedModels} close={()=>{setIsSetings(false)}} setConfig={props.setConfig} config={props.config} setError={props.onError}/>:(<>
            <Materie 
                setError={props.onError} 
                selected={Selected} 
                data={props.GlobalData}
                language={props.config?.limba || 'romana'}
              />
          </>)}
        </ContentArea>
      </Container>
      </>
    )
  }
  
  return <LoadingScreen/>;
}