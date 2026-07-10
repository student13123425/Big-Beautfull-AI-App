import React, { useEffect } from 'react'
import styled from 'styled-components'
import type { FileD, Materie, FishierMaterie, AskQuestion, MaterieImgGroup } from '../../scripts/objects'
import DisplaySintezaItem from './DisplaySintezaItem'
import ImageGroupViewer from '../Misc/ImageGroupViewer'
import { getMaterieFile } from '../../scripts/aox'

export type DisplaySelection = FileD | MaterieImgGroup | null;

let lastDisplaySintezaHash: string = '';
function getDisplaySintezaHash(global: Materie, selected: DisplaySelection): string {
  if (selected && typeof selected === 'object' && 'title' in selected && 'images' in selected) {
    const imgGroup = selected as MaterieImgGroup;
    let hash = `${global.name}:IMG:${imgGroup.title || 'untitled'}:`;
    for (const img of imgGroup.images) {
      hash += `${img.path}|`;
    }
    return hash;
  }
  const file = selected as FileD | undefined;
  let hash = `${global.name}:${file?.nume ?? 'none'}:`;
  for (const f of global.files) {
    hash += `${f.path}=${f.sinteza?.length ?? -1},${f.html_file?.length ?? -1}|`;
  }
  return hash;
}
import FilePlaceholder from '../Misc/FilePlaceholder'
import { FaFilePdf } from 'react-icons/fa'
import { getNoSubjectSelectedText, type PlaceholderLanguage } from '../../lang/placeholders'

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 10px;
  gap: 10px;
  height: 100%;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  max-height: 100%;
  min-height: 0;
  min-width: 0;
`

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-height: 0;

  svg {
    font-size: 130px;
    margin-bottom: 16px;
    color: #b3b3b3;
    opacity: 0.8;
  }

  h1 {
    text-align: center;
    width: 350px;
    user-select: none;
    color: #b3b3b3;
    font-weight: 100;
    font-size: 28px;
    margin: 0;
  }

  div {
    text-align: center;
    width: 350px;
    user-select: none;
    color: #b3b3b3;
    font-weight: 100;
    font-size: 14px;
    margin: 0;
  }
`

export default function DisplaySinteza(props: { 
  global: Materie, 
  selected: DisplaySelection, 
  file_list: FileD[] ,
  setError:Function,
  AskQustionOutput:AskQuestion,
  language?: string,
  serverUrl?: string,
  userId?: string | null
}) {
  useEffect(() => {
    if (!props.selected) return;
    
    const currentHash = getDisplaySintezaHash(props.global, props.selected);
    if (currentHash !== lastDisplaySintezaHash) {
      lastDisplaySintezaHash = currentHash;
    }
  }, [props.global, props.selected]);

  const isImageGroup = (selection: DisplaySelection): selection is MaterieImgGroup => {
    return selection !== null && 'title' in selection && 'images' in selection;
  };

  if (props.selected === null) {
    const lang = (props.language as PlaceholderLanguage) || 'English';
    const placeholderTexts = getNoSubjectSelectedText(lang);
    return (
      <Container>
        <EmptyState>
          <FaFilePdf size={130} />
          <h1>{placeholderTexts.noSintezaSelected}</h1>
          <div>Select a file to generate synthesis</div>
        </EmptyState>
      </Container>
    );
  }

  if (isImageGroup(props.selected)) {
    const serverUrl = props.serverUrl || 'http://localhost:3000';
    return (
      <Container>
        <ImageGroupViewer 
          group={props.selected} 
          serverUrl={serverUrl} 
          userId={props.userId}
          onClose={() => {}}
        />
      </Container>
    );
  }

  return (
    <Container>
        <DisplaySintezaItem
              selected={props.selected as FileD | null} 
              key={(props.selected as FileD)?.nume ?? 'none'} 
              file={getMaterieFile((props.selected as FileD)===null?"":(props.selected as FileD).nume, props.global)} 
              materie={props.global}
              AskQustionOutput={props.AskQustionOutput}
              setError={props.setError}
              language={props.language}
        />
    </Container>
  )
}
