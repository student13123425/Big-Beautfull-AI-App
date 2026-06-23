import React from 'react'
import styled from 'styled-components'
import type { FileD, Materie, FishierMaterie, AskQuestion } from '../../scripts/objects'
import DisplaySintezaItem from './DisplaySintezaItem'
import { getMaterieFile } from '../../scripts/aox'
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
  min-height: 0;       /* ← allows vertical shrinking */
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
  selected: FileD | null, 
  file_list: FileD[] ,
  setError:Function,
  AskQustionOutput:AskQuestion,
  language?: string
}) {
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

  return (
    <Container>
        <DisplaySintezaItem
              selected={props.selected} 
              key={0} 
              file={getMaterieFile(props.selected===null?"":props.selected.nume, props.global)} 
              materie={props.global}
              AskQustionOutput={props.AskQustionOutput}
              setError={props.setError}
              language={props.language}
        />
    </Container>
  )
}
