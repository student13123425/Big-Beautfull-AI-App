import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FileD, type Materie, type MaterieImgGroup } from '../../scripts/objects'
import PDFViewer from '../Misc/PDFViewer'
import DocViewer from '../Misc/DocViewer'
import FilePlaceholder from '../Misc/FilePlaceholder'
import ImageViewer from '../Misc/ImageViewer'
import ImageGroupViewer from '../Misc/ImageGroupViewer'
import ResourceBrowser, { type ResourceSelection } from '../Misc/ResourceBrowser'

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

function isImageGroup(resource: ResourceSelection): resource is MaterieImgGroup {
  return resource !== null && 'title' in resource && 'images' in resource;
}

export default function Browser(props:{File:ResourceSelection,setFile:Function,materie:Materie,file_list:FileD[],setError:Function,language?:string,userId?:string|null}) {
  const serverUrl = 'http://localhost:3000';

  if(props.File===null)
      return (
                <Container>
                  {<ResourceBrowser selectedResource={props.File} setError={props.setError} setResource={props.setFile} resourceList={props.file_list} materie={props.materie} type={'file'} language={props.language} userId={props.userId}/>}
                  <BrowserContainer>
                    <FilePlaceholder language={props.language}/>
                  </BrowserContainer>
                </Container>
              )

  if (isImageGroup(props.File)) {
    return (
      <Container>
        {<ResourceBrowser selectedResource={props.File} setError={props.setError} setResource={props.setFile} resourceList={props.file_list} materie={props.materie} type={'file'} language={props.language} userId={props.userId}/>}
        <BrowserContainer>
          <ImageGroupViewer 
            group={props.File} 
            serverUrl={serverUrl} 
            userId={props.userId}
            onClose={() => props.setFile(null)}
          />
        </BrowserContainer>
      </Container>
    );
  }

  const file = props.File as FileD;

  return (
    <Container>
          {<ResourceBrowser selectedResource={props.File} setError={props.setError} setResource={props.setFile} resourceList={props.file_list} materie={props.materie} type={'file'} language={props.language} userId={props.userId}/>}
      <BrowserContainer>
        {props.File===null?<FilePlaceholder language={props.language}/>:<Hide/>}
        {(file.tip==='pdf'||file.tip==='ppt'||file.tip==='pptx')?<PDFViewer key={1} serverUrl={serverUrl} filePath={file.nume} userId={props.userId}/>:<Hide/>}
        {((file.tip==='docx'||file.tip==='doc'))?<DocViewer key={2} serverUrl={serverUrl} filePath={file.nume} userId={props.userId}/>:<Hide/>}
        {((file.tip==='jpeg'||file.tip==='png'||file.tip==='jpg'))?<ImageViewer key={2} serverUrl={serverUrl} filePath={file.nume} userId={props.userId}/>:<Hide/>}
      </BrowserContainer>
    </Container>
  )
}