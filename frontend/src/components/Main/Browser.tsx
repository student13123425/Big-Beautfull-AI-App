import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FileD, type Materie } from '../../scripts/objects'
import PDFViewer from '../Misc/PDFViewer'
import DocViewer from '../Misc/DocViewer'
import FilePlaceholder from '../Misc/FilePlaceholder'
import ImageViewer from '../Misc/ImageViewer'
import ResourceBrowser from '../Misc/ResourceBrowser'

const Container=styled.div`
  flex: 1;
  width: 100vw;
  display: flex;
  flex-direction: row;
  height: 100%;
  max-height: 100%;
    min-height: 0;
  min-width: 0;
`

const BrowserContainer=styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  max-height: 100%;
  min-height: 0;
    min-height: 0;
  min-width: 0;
`

const Hide=styled.div`
  display: none;
`

export default function Browser(props:{File:FileD|null,setFile:Function,materie:Materie,file_list:FileD[],setError:Function,language?:string}) {
  if(props.File===null)
      return (
                <Container>
                  {<ResourceBrowser selectedResource={props.File} setError={props.setError} setResource={props.setFile} resourceList={props.file_list} materie={props.materie} type={'file'} language={props.language}/>}
                  <BrowserContainer>
                    <FilePlaceholder language={props.language}/>
                  </BrowserContainer>
                </Container>
              )
  return (
    <Container>
      {<ResourceBrowser selectedResource={props.File} setError={props.setError} setResource={props.setFile} resourceList={props.file_list} materie={props.materie} type={'file'} language={props.language}/>}
      <BrowserContainer>
        {props.File===null?<FilePlaceholder language={props.language}/>:<Hide/>}
        {(props.File.tip==='pdf'||props.File.tip==='ppt'||props.File.tip==='pptx')?<PDFViewer key={1} serverUrl='http://localhost:3000' filePath={props.File.nume}/>:<Hide/>}
        {((props.File.tip==='docx'||props.File.tip==='doc'))?<DocViewer key={2} serverUrl={'http://localhost:3000'} filePath={props.File.nume}/>:<Hide/>}
        {((props.File.tip==='jpeg'||props.File.tip==='png'||props.File.tip==='jpg'))?<ImageViewer key={2} serverUrl={'http://localhost:3000'} filePath={props.File.nume}/>:<Hide/>}
      </BrowserContainer>
    </Container>
  )
}
