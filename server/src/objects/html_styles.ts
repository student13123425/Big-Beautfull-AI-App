import { readFileSync } from 'fs';
import path from 'path';


export interface StyleConfig {
  name: string;
  description?: string;
  layout?: { 
    containerMaxWidth?: string | number; 
    gridTemplate?: string; 
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; 
    gap?: string; 
    padding?: string; 
    alignment?: 'start' | 'center' | 'end' | 'stretch'; 
  };
  typography?: { 
    fontFamily: string[]; 
    baseFontSize?: string; 
    headingSizes?: Record<string, string>; 
    lineHeight?: number; 
    letterSpacing?: string; 
    weightScale?: Record<string, number>; 
  };
  colors?: { 
    background: string; 
    surface?: string; 
    text: string; 
    primary: string; 
    secondary?: string; 
    accent?: string[]; 
    darkMode?: Partial<StyleConfig['colors']>; 
  };
  effects?: { 
    borderRadius?: string; 
    boxShadow?: string | string[]; 
    border?: string; 
    backdropBlur?: string; 
    opacity?: number; 
    animations?: Record<string, { duration?: string; easing?: string; keyframes?: string }>; 
    hoverTransform?: string; 
  };
  components?: { 
    cards?: Partial<StyleConfig['effects'] & { padding?: string; background?: string }>; 
    tables?: { headerBg?: string; rowHover?: boolean; striped?: boolean; borderStyle?: 'solid' | 'dashed' | 'none' }; 
    lists?: { bulletStyle?: 'disc' | 'square' | 'none'; icon?: string }; 
    callouts?: { borderLeftWidth?: string; borderColor?: string; background?: string }; 
    badges?: { padding?: string; borderRadius?: string; fontSize?: string }; 
  };
  interactivity?: { 
    hoverEffects?: boolean; 
    scrollReveal?: boolean; 
    themeToggle?: boolean; 
    collapsibleSections?: boolean; 
    transitionDuration?: string; 
  };
  responsive?: { 
    breakpoints?: Record<string, Partial<StyleConfig>>; 
    fluidTypography?: boolean; 
  };
  print?: { 
    pageSize?: 'A4' | 'Letter'; 
    margins?: string; 
    colorAdjust?: 'exact' | 'auto'; 
    pageBreaks?: boolean 
  };
  accessibility?: { 
    contrastRatio?: number; 
    focusVisible?: boolean; 
    reducedMotion?: boolean 
  };
  cssVariables?: Record<string, string>;
}


export type StyleBundle = { 
  base: StyleConfig; 
  variants?: { dark?: Partial<StyleConfig>; print?: Partial<StyleConfig>; mobile?: Partial<StyleConfig> }; 
};


export class StyleConfigList {
  private styles: StyleBundle[];

  constructor() {
    const filePath = './html_styles.json'
    try {
      const rawData = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(rawData) as unknown[];
      if (!Array.isArray(parsed)) throw new Error('Expected an array of style bundles in html_styles.json');
      this.styles = parsed as StyleBundle[];
    } catch (error: any) {
      console.error(`Failed to load styles from ${filePath}:`, error.message);
      throw error;
    }
  }

  getStyles(): StyleBundle[] { 
    return [...this.styles]; 
  }

  getStyleByName(name: string): StyleBundle | undefined { 
    return this.styles.find(s => s.base.name === name); 
  }
}
