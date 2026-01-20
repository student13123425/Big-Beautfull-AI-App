import React, { useEffect, useState } from 'react'
import type { AskQuestion, FileD, Materie } from '../../scripts/objects'
import { styled } from 'styled-components'
import DisplaySinteza from './DisplaySinteza'
import ResourceBrowser from '../Misc/ResourceBrowser'


const Container=styled.div`
  flex: 1;
  width: 100vw;
  display: flex;
  flex-direction: row;
    max-height: 100%;
    min-height: 0;       /* ← allows vertical shrinking */
  min-width: 0;  
`

const BrowserContainer=styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;      
  min-width: 0;   
  width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
    &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`

export default function   Sinteza(props:{File:FileD|null,setFile:Function,AskQustionOutput:AskQuestion,materie:Materie,file_list:FileD[],setError:Function}) {
  return (
    <Container>
      {<ResourceBrowser selectedResource={props.File} setError={props.setError} setResource={props.setFile} resourceList={props.file_list} materie={props.materie} type={'file'}/>}
      <BrowserContainer>
        <DisplaySinteza AskQustionOutput={props.AskQustionOutput} setError={props.setError} global={props.materie} selected={props.File}  file_list={props.file_list} />
      </BrowserContainer>
    </Container>
  )
}
