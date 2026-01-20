import React, { useEffect, useState } from 'react'
import type { AiTextCorectionElement, FileD, Materie, Quiz } from '../../scripts/objects'
import { styled } from 'styled-components'
import QuizDisplay from '../Quiz/QuizDisplay'
import ResourceBrowser from '../Misc/ResourceBrowser'
import QuizDisplayError from '../Quiz/QuizDisplayError'
import { quiz_to_request } from '../../scripts/aox'


const Container=styled.div`
  flex: 1;
  width: 100vw;
  display: flex;
  flex-direction: row;
  height: 100%;
  max-height: 100%;
    min-height: 0;       /* ← allows vertical shrinking */
  min-width: 0;        /* ← allows horizontal shrinking */
`

const QuizContainer=styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  max-height: 100%;
  /* allow its children to shrink */
  min-height: 0;
    min-height: 0;       /* ← allows vertical shrinking */
  min-width: 0;        /* ← allows horizontal shrinking */
`

const Hide=styled.div`
  display: none;
`

export default function Quizs(props:{correction:AiTextCorectionElement,materie:Materie,file_list:FileD[],setError:Function}) {
  const [SelectedQuiz,setSelectedQuiz]=useState<Quiz|null>(null);
  useEffect(()=>{
    setSelectedQuiz(null)
  },[props.materie.name])
  useEffect(()=>{
    if(SelectedQuiz!=null&&!props.materie.quizs.some((it)=>it.title===SelectedQuiz.title))
      setSelectedQuiz(null)
  },[props.materie.quizs])
  if(SelectedQuiz!=null&&(SelectedQuiz.intrebari.length==0||SelectedQuiz.intrebari.every((it)=>it.intrebari.length===0))){
    return (
    <Container>
      {<ResourceBrowser selectedResource={SelectedQuiz} setError={props.setError} setResource={setSelectedQuiz} resourceList={props.materie.quizs} materie={props.materie} type={'quiz'}/>}
      <QuizContainer>
        <QuizDisplayError setError={props.setError} req={quiz_to_request(SelectedQuiz,props.materie.name,props.setError)} quizName={SelectedQuiz.title} errorMessage='Quiz Has No Content'/>
      </QuizContainer>
    </Container>
    )
  }
  return (
    <Container>
      {<ResourceBrowser selectedResource={SelectedQuiz} setError={props.setError} setResource={setSelectedQuiz} resourceList={props.materie.quizs} materie={props.materie} type={'quiz'}/>}
      <QuizContainer>
        <QuizDisplay correction={props.correction} setError={props.setError} quiz={SelectedQuiz}/>
      </QuizContainer>
    </Container>
  )
}
