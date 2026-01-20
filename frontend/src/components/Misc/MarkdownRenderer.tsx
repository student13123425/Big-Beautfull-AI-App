import React, { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

interface MarkdownProps {
  content: string;
  zoom?: number;
  nested?: boolean;
}

const Container = styled.div<{ zoom: number; $nested?: boolean }>`
  --zoom-factor: ${props => props.zoom};
  margin: 0 auto;
  padding: ${props => props.$nested 
    ? '0' 
    : `calc(2rem * var(--zoom-factor)) calc(1rem * var(--zoom-factor))`};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  scrollbar-width: none;
  -ms-overflow-style: none; 
  *{
      transition:all 0.1s linear;
  }
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  /* Responsive styles for tablets */
  @media (max-width: 768px) {
    padding: ${props => props.$nested ? '0' : 'calc(1rem * var(--zoom-factor))'};
    max-width: 100%;
  }

  /* Compact styles for phones */
  @media (max-width: 500px) {
    padding: ${props => props.$nested 
      ? '0' 
      : `calc(1rem * var(--zoom-factor)) calc(0.5rem * var(--zoom-factor))`};

    h1 { font-size: calc(1.4rem * var(--zoom-factor)); }
    h2 { font-size: calc(1.25rem * var(--zoom-factor)); }
    h3 { font-size: calc(1.1rem * var(--zoom-factor)); }
    h4 { font-size: calc(0.95rem * var(--zoom-factor)); }
    h5 { font-size: calc(0.85rem * var(--zoom-factor)); }
    h6 { font-size: calc(0.75rem * var(--zoom-factor)); }

    p, a, li {
      font-size: calc(0.8rem * var(--zoom-factor));
    }

    ul, ol {
      margin-left: calc(1rem * var(--zoom-factor));
      padding-left: calc(0.5rem * var(--zoom-factor));
    }

    blockquote {
      margin: calc(0.8rem * var(--zoom-factor)) 0;
      padding: 0 calc(1rem * var(--zoom-factor));
    }

    pre {
      margin: calc(0.8rem * var(--zoom-factor)) 0;
    }

    table {
      margin: calc(0.8rem * var(--zoom-factor)) 0;
      th, td {
        padding: calc(0.4rem * var(--zoom-factor)) calc(0.6rem * var(--zoom-factor));
      }
    }

    hr {
      margin: calc(1rem * var(--zoom-factor)) 0;
    }
  }

  & > *:first-child {
    margin-top: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: calc(1.5em * var(--zoom-factor));
    margin-bottom: calc(0.75em * var(--zoom-factor));
    font-weight: 700;
    line-height: 1.25;
    color: #222;
  }

  h1 {
    font-size: calc(2.2rem * var(--zoom-factor));
    padding-bottom: calc(0.3em * var(--zoom-factor));
    border-bottom: calc(1px * var(--zoom-factor)) solid #eaecef;
  }

  h2 {
    font-size: calc(1.8rem * var(--zoom-factor));
    padding-bottom: calc(0.3em * var(--zoom-factor));
    border-bottom: calc(1px * var(--zoom-factor)) solid #eaecef;
  }

  h3 { font-size: calc(1.5rem * var(--zoom-factor)); }
  h4 { font-size: calc(1.3rem * var(--zoom-factor)); }
  h5 { font-size: calc(1.1rem * var(--zoom-factor)); }
  h6 { 
    font-size: calc(1rem * var(--zoom-factor)); 
    color: #666;
  }

  p {
    margin-top: 0;
    margin-bottom: calc(1rem * var(--zoom-factor));
    color: #444;
    font-size: calc(1rem * var(--zoom-factor));
  }

  a {
    color: #0366d6;
    text-decoration: none;
    font-size: calc(1rem * var(--zoom-factor));

    &:hover {
      text-decoration: underline;
    }
  }

  ul, ol {
    margin-left: calc(1.5rem * var(--zoom-factor));
    margin-bottom: calc(1rem * var(--zoom-factor));
    padding-left: calc(1rem * var(--zoom-factor));

    li {
      margin-bottom: calc(0.5rem * var(--zoom-factor));
      line-height: 1.6;
      font-size: calc(1rem * var(--zoom-factor));

      &::marker {
        color: #666;
        font-size: calc(1.4rem * var(--zoom-factor));
      }
    }

    ul, ol {
      margin-top: calc(0.5rem * var(--zoom-factor));
      margin-bottom: calc(0.5rem * var(--zoom-factor));
    }
  }

  blockquote {
    margin: calc(1.5rem * var(--zoom-factor)) 0;
    padding: 0 calc(1.25rem * var(--zoom-factor));
    color: #6a737d;
    border-left: calc(0.25rem * var(--zoom-factor)) solid #dfe2e5;

    p {
      margin: calc(1rem * var(--zoom-factor)) 0;
    }
  }

  code:not([class*="language-"]) {
    background-color: #f6f8fa;
    border-radius: calc(0.25rem * var(--zoom-factor));
    padding: calc(0.2em * var(--zoom-factor)) calc(0.4em * var(--zoom-factor));
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: calc(0.9em * var(--zoom-factor));
    color: #e01e5a;
  }

  pre {
    margin: calc(1.5rem * var(--zoom-factor)) 0;
    border-radius: calc(0.375rem * var(--zoom-factor));
    overflow: hidden;
    box-shadow: 0 calc(0.25rem * var(--zoom-factor)) calc(0.75rem * var(--zoom-factor)) rgba(0,0,0,0.1);
  }

  table {
    width: 100%;
    margin: calc(1.5rem * var(--zoom-factor)) 0;
    border-collapse: collapse;
    overflow: hidden;
    box-shadow: 0 0 0 calc(1px * var(--zoom-factor)) #dfe2e5;
    border-radius: calc(0.375rem * var(--zoom-factor));

    th, td {
      padding: calc(0.75rem * var(--zoom-factor)) calc(1rem * var(--zoom-factor));
      text-align: left;
      border: calc(1px * var(--zoom-factor)) solid #dfe2e5;
      font-size: calc(0.95rem * var(--zoom-factor));
    }

    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: #fafbfc;
    }
  }

  hr {
    height: calc(1px * var(--zoom-factor));
    margin: calc(2rem * var(--zoom-factor)) 0;
    background-color: #e1e4e8;
    border: 0;
  }

  img {
    max-width: 100%;
    display: block;
    margin: calc(1.5rem * var(--zoom-factor)) auto;
    border-radius: calc(0.375rem * var(--zoom-factor));
    box-shadow: 0 calc(0.25rem * var(--zoom-factor)) calc(0.75rem * var(--zoom-factor)) rgba(0,0,0,0.1);
  }
`;


const MathBlock: React.FC<{ children: string }> = ({ children }) => {
  return (
    <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
      <MathJax dynamic>{`$$${children}$$`}</MathJax>
    </div>
  );
};

// Custom component for inline math
const MathInline: React.FC<{ children: string }> = ({ children }) => {
  return <MathJax dynamic inline>{`$${children}$`}</MathJax>;
};

// Function to process math expressions in markdown
const processMathInMarkdown = (content: string): string => {
  // Split the content to preserve code blocks
  const segments: { type: 'text' | 'code'; value: string }[] = [];
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Text before the code block
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: content.substring(lastIndex, match.index) });
    }
    segments.push({ type: 'code', value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  
  // Remaining text after last code block
  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.substring(lastIndex) });
  }

  // Process only text segments for math expressions
  return segments.map(segment => {
    if (segment.type === 'code') {
      return segment.value;
    } else {
      let text = segment.value;
      // Replace display math blocks ($$...$$ on separate lines)
      text = text.replace(/^\$\$([\s\S]*?)\$\$$/gm, (_, mathContent) => {
        return `<MathBlock>${mathContent.trim()}</MathBlock>`;
      });
      
      // Replace inline math expressions ($...$)
      text = text.replace(/\$([^$\n]+)\$/g, (_, mathContent) => {
        return `<MathInline>${mathContent}</MathInline>`;
      });
      
      return text;
    }
  }).join('');
};

const MarkdownRenderer: React.FC<MarkdownProps> = ({ 
  content, 
  zoom = 1,
  nested = false
}) => {
  const [processedContent, setProcessedContent] = useState<string>(processMathInMarkdown(content));
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateContent = () => {
      setProcessedContent(processMathInMarkdown(content));
    };
    
    // Use a 10ms debounce to prevent excessive processing and stack overflow
    timeoutId = setTimeout(updateContent, 10);
    
    // Cleanup function to clear the timeout if content changes again
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [content]);

  const config = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
  };

  // Define CodeBlock inside to access component props
  const CodeBlock: React.FC<{ className?: string; children: string }> = 
    ({ className, children }) => {
      // Check if the code contains mathematical formulas
      const isMathFormula = /\$\{[\s\S]*?\}|\$(.*?)\$|\$\$(.*?)\$\$|\\\(|\\\[|\\begin\{/.test(children);
      if (isMathFormula) {
        return (
          <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
            <MathJax dynamic>{`$${children}$$`}</MathJax>
          </div>
        );
      }
      
      const language = className?.replace('lang-', '') || 'javascript';
      
      // Handle markdown code blocks
      if (language === 'markdown') {
        return (
          <div style={{ 
            padding: '1rem',
            border: '1px solid #eaecef',
            borderRadius: '0.375rem',
            background: '#f6f8fa',
            margin: '1.5rem 0',
            overflowX: 'auto'
          }}>
            <MarkdownRenderer 
              content={children.trim()} 
              zoom={zoom} 
              nested={true}
            />
          </div>
        );
      }
      
      return (
        <SyntaxHighlighter 
          language={language} 
          style={vscDarkPlus}
          customStyle={{ 
            margin: 0, 
            borderRadius: 0,
            fontSize: '1em'
          }}
          showLineNumbers
          lineNumberStyle={{ 
            minWidth: '3em',
            fontSize: '0.9em'
          }}
        >
          {children.trim()}
        </SyntaxHighlighter>
      );
  };

  const markdownOptions = {
    overrides: {
      code: CodeBlock,
      pre: ({ children }: any) => {
        if (children?.type === 'code') {
          return children;
        }
        return <pre>{children}</pre>;
      },
      MathBlock: {
        component: MathBlock,
        props: {
          children: (props: any) => props.children
        }
      },
      MathInline: {
        component: MathInline,
        props: {
          children: (props: any) => props.children
        }
      }
    },
  };

  return (
    <MathJaxContext config={config} version={3}>
      <Container zoom={zoom} $nested={nested}>
        <Markdown options={markdownOptions}>
          {processedContent}
        </Markdown>
      </Container>
    </MathJaxContext>
  );
};

export default MarkdownRenderer;