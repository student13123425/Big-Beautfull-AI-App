import tesseract from 'node-tesseract-ocr';

export function getSupportedLanguages(): string[] {
  return [
    "English",
    "Mandarin Chinese",
    "Romanian",
    "Spanish",
    "Modern Standard Arabic",
    "French",
    "Portuguese",
    "Russian",
    "German",
    "Japanese",
    "Vietnamese",
    "Turkish",
    "Telugu",
  ];
}

const LANG_MAP: Record<string, string> = {
  "English": "eng",
  "Mandarin Chinese": "chi_sim",
  "Romanian": "ron",
  "Spanish": "spa",
  "Modern Standard Arabic": "ara",
  "French": "fra",
  "Portuguese": "por",
  "Russian": "rus",
  "German": "deu",
  "Japanese": "jpn",
  "Vietnamese": "vie",
  "Turkish": "tur",
  "Telugu": "tel",
};

export async function imageContainsText(
  imagePath: string, 
  lang: string = "English",
  minTextLength: number = 3
): Promise<boolean> {
  const supportedLanguages = getSupportedLanguages();

  if (!supportedLanguages.includes(lang)) {
    throw new Error(`Unsupported language: ${lang}. Supported languages are: ${supportedLanguages.join(', ')}`);
  }

  const config = {
    lang: LANG_MAP[lang],
    oem: 1,
    psm: 3,
  };

  try {
    const text = await tesseract.recognize(imagePath, config);
    const cleanedText = text.trim().replace(/\s+/g, ' ');
    return cleanedText.length >= minTextLength;
  } catch (error) {
    console.warn(`OCR processing failed: ${(error as Error).message}`);
    return false;
  }
}

export async function extractTextFromImage(
  imagePath: string, 
  lang: string,
  is_check: boolean
): Promise<string> {
  const supportedLanguages = getSupportedLanguages();

  if (!supportedLanguages.includes(lang)) {
    throw new Error(`Unsupported language: ${lang}. Supported languages are: ${supportedLanguages.join(', ')}`);
  }

  const config = {
    lang: LANG_MAP[lang],
    oem: 1,
    psm: 3,
  };

  try {
    const text = await tesseract.recognize(imagePath, config);
    
    if (is_check) {
      const cleanedText = text.trim().replace(/\s+/g, ' ');
      if (cleanedText.length < 3) {
        return "no text has been found in this image Error 404";
      }
    }
    
    return text;
  } catch (error) {
    throw new Error(`Failed to extract text: ${(error as Error).message}`);
  }
}
