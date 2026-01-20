import React from 'react'
import styled from 'styled-components'
import type { FileD, Materie, FishierMaterie, AskQuestion } from '../../scripts/objects'
import DisplaySintezaItem from './DisplaySintezaItem'
import { getMaterieFile } from '../../scripts/aox'
import FilePlaceholder from '../Misc/FilePlaceholder'

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

export default function DisplaySinteza(props: { 
  global: Materie, 
  selected: FileD | null, 
  file_list: FileD[] ,
  setError:Function,
  AskQustionOutput:AskQuestion
}) {
  return (
    <Container>
        <DisplaySintezaItem
              selected={props.selected} 
              key={0} 
              file={getMaterieFile(props.selected===null?"":props.selected.nume, props.global)} 
              materie={props.global}
              AskQustionOutput={props.AskQustionOutput}
              setError={props.setError}
        />
    </Container>
  )
}