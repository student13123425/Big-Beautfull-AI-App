import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { setContextSizeConfig, setLanguageConfig, setSystemPromptConfig, selectModel, getHtmlStyleConfig, setHtmlStyleConfig } from '../scripts/network';
import { StyleConfigList, type Config, type StyleBundle, type StyleConfig } from '../scripts/objects';
import AnimatedDropdown from '../components/Settings/AnimatedDropdownProps';
import { getSupportedLanguages } from '../scripts/aox';
import ContextSizeSelector from '../components/Settings/ContextSizeSelector';
import useKeyPress from '../hooks/useKeyPress';
import { FaTimes } from 'react-icons/fa';

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  padding-bottom: 10px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SettingsWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SettingsHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  position: sticky;
  top: 10px;
  width: 100%;
  height: auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  z-index: 100;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 12px 16px;
    top: 5px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color:#fff6;
  }
  &:active {
    background-color:rgba(255, 255, 255, 0.2);
  }
`;

const SettingsCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;

  &:focus-within {
    z-index: 100;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #fffe;
  margin: 0 0 16px 0;
  font-family: 'Inter', sans-serif;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 250px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: rgba(255,255,255,.95);
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  box-shadow: 0 2px 4px rgba(0,0,0,.05);
  transition: all .3s ease;

  overflow-y: auto;           
  -ms-overflow-style: none;    
  scrollbar-width: none;      
  resize: none;
  &::-webkit-scrollbar {   
    width: 0;
    height: 0;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.3);
  }
`;

const SpaceBottom = styled.div`
  height: 300px;
  flex-shrink: 0;
  pointer-events: none;
`;

export default function SettingsPage(props: { setError: Function, config: Config, setConfig: Function, close: Function, SupportedModels: string[],HtmlPosibleStyles:StyleConfigList}) {
    const [contextSize, setContextSize] = useState<number>(props.config.model_token_limit);
    const [tempPrompt, setTempPrompt] = useState(props.config.system_prompt);
    const [language, setLanguage] = useState<string>(props.config.limba);
    const [SelectedStyle,setSelectedStyle]=useState<number>(0);
    const supportedLanguages: string[] = getSupportedLanguages();
    const models = ["lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q3_K_L.gguf","lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf", "openai/gpt-oss-20b"];
    const tags = ["Quality","Balanced", "Speed"];
    const HtmlPosibleStyles=props.HtmlPosibleStyles;
    useEffect(()=>{
      getHtmlStyleConfig((it:any)=>setSelectedStyle(HtmlPosibleStyles.getStyles().map((it:any)=>it.name).indexOf(it)),props.setError);
    },[])
    useKeyPress("Escape", props.close);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (tempPrompt !== props.config.system_prompt) {
                setSystemPromptConfig(tempPrompt, props.setError);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [tempPrompt, props.config.system_prompt, props.setError]);

    useEffect(() => {
        setContextSizeConfig(contextSize, props.setError);
    }, [contextSize, props.setError]);

    const handleLanguageSelect = (selectedLanguage: string) => {
        setLanguage(selectedLanguage);
        setLanguageConfig(selectedLanguage, props.setError);
    };
    
    const handleModelSelect = (selectedTag: string) => {
      const modelPath = models[tags.indexOf(selectedTag)];
      selectModel(modelPath, props.setError);
    };

    const handleStyleSelect= (selectedStyle : string) => {
      const index = HtmlPosibleStyles.getStyles().map((it:StyleBundle)=>it.name).indexOf(selectedStyle);
      setHtmlStyleConfig(index,props.setError);
      setSelectedStyle(index);
    };

    return (
        <PageContainer>
            <SettingsWrapper>
                <SettingsHeader>
                    <HeaderTitle>Application Settings</HeaderTitle>
                    <CloseButton onClick={props.close} aria-label="Close settings">
                        <FaTimes size={20} />
                    </CloseButton>
                </SettingsHeader>
                
                <SettingsCard>
                    <SectionTitle>AI System Prompt</SectionTitle>
                    <TextArea
                        onChange={(e) => setTempPrompt(e.target.value)}
                        value={tempPrompt}
                        placeholder="Define the AI's role and behavior here..."
                    />
                </SettingsCard>
                
                <SectionGrid>
                    <SettingsCard>
                        <SectionTitle>Language</SectionTitle>
                        <AnimatedDropdown
                            selectedOption={language}
                            options={supportedLanguages}
                            onSelect={handleLanguageSelect}
                        />
                    </SettingsCard>

                    <SettingsCard>
                        <SectionTitle>Max Context Size</SectionTitle>
                        <ContextSizeSelector
                            value={contextSize}
                            step={1000}
                            setValue={setContextSize}
                            bounds={[20 * 1000, 64 * 1000]}
                        />
                    </SettingsCard>
                </SectionGrid>
                
                <SettingsCard>
                    <SectionTitle>AI Model Preference</SectionTitle>
                    <AnimatedDropdown
                        selectedOption={tags[models.indexOf(props.config.ai_model_quiz[0])]}
                        options={tags}
                        onSelect={handleModelSelect}
                    />
                </SettingsCard>
                  <SettingsCard>
                    <SectionTitle>HTML Style</SectionTitle>
                    <AnimatedDropdown
                        selectedOption={HtmlPosibleStyles.getStyles().map((it:any)=>it.name)[SelectedStyle]}
                        options={HtmlPosibleStyles.getStyles().map((it:any)=>it.name)}
                        onSelect={handleStyleSelect}
                    />
                </SettingsCard>
                <SpaceBottom />
            </SettingsWrapper>
        </PageContainer>
    );
}