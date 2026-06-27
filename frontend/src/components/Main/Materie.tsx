import React, { useEffect, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import styled from 'styled-components'
import type { FileD, Materie as Mt, StudyGroup } from '../../scripts/objects'
import { get_file_elements, get_selected } from '../../scripts/aox'

// Hash comparison to detect actual data changes from polling
let lastMaterieDataHash: string = '';
function getMaterieDataHash(data: StudyGroup): string {
  let hash = '';
  for (const m of data.data) {
    hash += `${m.name}:`;
    for (const f of m.files) {
      hash += `${f.path}=${f.sinteza?.length ?? -1},${f.html_file?.length ?? -1}|`;
    }
  }
  return hash;
}
import MaterieMenu from './MaterieMenu'
import Browser from './Browser'
import Sinteza from './Sinteza'
import Quizs from './Quizs'
import { getNoSubjectSelectedText, type PlaceholderLanguage } from '../../lang/placeholders'

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  height: 100%;
`

const None = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-height: 0;
  
  h1 {
    text-align: center;
    width: 350px;
    user-select: none;
    color: #b3b3b3;
    font-weight: 100;
  }
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
  min-width: 0;
  height: 100%;
`

const Hide = styled.div`
  display: none;
`

export default function Materie(props: { 
  selected: string | null, 
  data: StudyGroup, 
  setError: Function,
  language?: string
}) {
  const lang = (props.language as import('../../lang/placeholders').PlaceholderLanguage) || 'Romanian';
  const value: Mt | null = get_selected(props.selected, props.data);

  useEffect(() => {
    if (!value) return;
    
    const currentHash = getMaterieDataHash(props.data);
    if (currentHash !== lastMaterieDataHash) {
      lastMaterieDataHash = currentHash;
    }
  }, [value?.name, props.data, props.selected]);
  const [Mode, setMode] = useState<number>(0);
  const files_list: FileD[] = get_file_elements(value);
  const [File,setFile]=useState<null|FileD>(null);
    useEffect(()=>{
        setFile(null);
    },[value?.name])
    useEffect(()=>{
      if(File!=null&&!value?.files.some((it)=>it.path==File.nume))
        setFile(null);
    },[value?.files.length])
    useEffect(()=>{
      if(Mode==3)
        setFile(null);
    },[Mode])
  if (props.selected == null || value === null) {
    const lang = (props.language as PlaceholderLanguage) || 'Romanian';
    const placeholderTexts = getNoSubjectSelectedText(lang);
    return (
      <None>
        <FaPen size={130} color={"#b3b3b3"}/>
        <h1>{placeholderTexts.noSubjectSelected}</h1>
      </None>
    )
  }
  return (
    <Container>
      <MaterieMenu mode={Mode} setMode={setMode} language={lang} />
      <ContentContainer>
        {Mode === 0 ? <Browser File={File} setFile={setFile} setError={props.setError} materie={value} file_list={files_list} language={lang} /> : <Hide />}
        {Mode === 1 ? <Sinteza File={File} setFile={setFile} AskQustionOutput={props.data.CurrentAskedQuestion} setError={props.setError} materie={value} file_list={files_list} language={lang} /> : <Hide />}
        {Mode === 2 ? <Quizs correction={props.data.AiTextCorrection} setError={props.setError} materie={value} file_list={files_list} language={lang} /> : <Hide />}
      </ContentContainer>
    </Container>
  )
}