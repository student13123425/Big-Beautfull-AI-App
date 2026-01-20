import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import type { AiServerError, Config, StudyGroup } from '../scripts/objects'
import TopBar from '../components/Main/TopBar'
import Materie from '../components/Main/Materie'
import SettingsPage from './SettingsPage'
import ErrorModal from '../components/Misc/ErrorModal'
import { DeactivateErrorMessage } from '../scripts/network'
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
  onError: Function
  config:Config,
  setConfig:Function,
  SupportedModels:string[]
}) {
  const [Selected, setSelected] = useState<null | string>(null);
  const [IsSetings,setIsSetings]=useState<boolean>(false)
  const [ErrorMessage,setErrorMessages]=useState<AiServerError[]>([])
  useEffect(()=>{
    if(props.GlobalData){
      setErrorMessages(props.GlobalData.AiServerError)
    }
  },[props.GlobalData?.AiServerError])
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
          setSelected={setSelected} 
          data={props.GlobalData}
        />
        <ContentArea>
          {IsSetings===true?<SettingsPage SupportedModels={props.SupportedModels} close={()=>{setIsSetings(false)}} setConfig={props.setConfig} config={props.config} setError={props.onError}/>:(<>
            <Materie 
                setError={props.onError} 
                selected={Selected} 
                data={props.GlobalData}
              />
          </>)}
        </ContentArea>
      </Container>
      </>
    )
  }
  
  return <LoadingScreen/>;
}