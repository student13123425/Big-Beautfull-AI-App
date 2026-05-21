export function promptEvaluareIntrebare(
  question: string,
  userAnswer: string,
  subjectName: string,
  language: string
): string {
  return `
Evaluează răspunsul meu la această întrebare. Nu aștepta un eseu sau răspuns lung - și răspunsurile scurte pot fi corecte dacă acoperă esențialul.


ÎNTREBARE: "${question}"
RĂSPUNSUL MEU: "${userAnswer}"
MATERIA: "${subjectName}"


**IMPORTANT:**
- Acceptă răspunsuri scurte dacă sunt corecte și arată înțelegere
- Nu penaliza pentru lipsa de detalii dacă ideea principală este acoperită
- Concentrează-te pe substanță, nu pe lungime
- Dacă răspunsul este corect dar scurt, dă un scor bun


Oferă-mi feedback direct (folosește "tu") în format JSON:
{
  "score": 0-100,
  "detailed_markdown": "explicație pentru tine"
}


În evaluare:
1. **Verifică dacă ai înțeles ideea principală** - nu dacă ai scris mult
2. **Dacă răspunsul este corect dar scurt**, explică ce ai făcut bine și cum poți extinde (fără să penalizezi)
3. **Dacă răspunsul este parțial corect**, indică doar ce lipsește, nu cere un eseu


Exemple de abordare:
- Răspuns scurt corect: "Ai identificat ideea principală corect. Poți adăuga exemple pentru a fi mai complet."
- Răspuns incomplet: "Ai prins o parte, dar lipsește X. Încearcă să te gândești la Y."
- Răspuns greșit: "Aici ai greșit conceptul. Ideea corectă este Z."


Răspuns JSON:
`;
}

export function prompt_sumarizare(materie: string, nume_materie: string, limbaj: string): string {
  return `
Generează o sinteză completă și autosuficientă în format Markdown pentru materia de ${nume_materie}, bazată exclusiv pe textul furnizat. 


### Cerințe esențiale:
1. **Autosuficiență totală**:
   - Conține TOATE informațiile necesare pentru a învăța materia fără a consulta textul original sau alte resurse
   - Elimină orice mențiune de tip "după cum se vede în text" sau referințe externe


2. **Limbaj de ieșire**
   - Toată sinteza trebuie redactată în limba **${limbaj}** indiferent the limba materialului original.
   - Evită ambiguitățile; folosește un limbaj clar, concis și academic acolo unde este potrivit.



3. **Structură didactică** (folosind titluri Markdown):
   - Introducere conceptuală
   - Teorie esențială (definiții, reguli, formule)
   - Clasificări/tipologii (tabele comparative dacă sunt relevante)
   - Exemple aplicative (cu explicații pas-cu-pas)
   - Concluzii și relații între concepte


4. **Organizare optimă pentru învățare**:
   - Secvențiază informația de la simplu la complex
   - Grupează concepte înrudite
   - Include elemente vizuale mentale (analogii, diagrame mentale descrise textual)
   - Highlight (cu **bold**) termeni-cheie și concepte fundamentale


5. **Formatare specială pentru formule**:
   - Toate formulele matematice/fizice/chimice să fie încadrate în \`\${formula}\` 
   - Exemplu: Pentru ecuația lui Einstein: \`\${E = mc^2}\`
   - Păstrează notația științică corectă în interiorul \`\${}\`


### Text sursă:
${materie}


### Format de ieșire:
Strict Markdown cu:
- Titluri (##, ###) 
- Liste
- Tabele
- **Bold** pentru termeni importanți
- Formule în \`\${formula}\`
- Fără comentarii suplimentare
`.trim();
}

export function prompt_extrage_text_img(nume_materie: string) {
  return `extrage informatia si textul din aceasta imagine la materia ${nume_materie} si schematizeazo si explico cum ar fii probleme formule informati in paragrafe text in altele in cazul in care nu exista informati pertinete acestei materi raspunde explicand dc consideri asa`;
}

export function prompt_quiz(input: string, nume_materie: string, nr_intrebari: number, step: number, is_grila: boolean): string {
  const JsonFormat: string = `{
    "id": 1,
    "raspunsuri": [
      "React este o bibliotecă JavaScript pentru UI-uri",
      "React este un framework CSS",
      "React este un server web",
      "React este o bază de date NoSQL"
    ],
    "text_intrebare": "Ce este React?",
    "raspuns_correct_index": 0
  }`;

  if (step === 0)
    return `${input}\nGenerează un test de ${nr_intrebari} întrebări ${is_grila ? 'cu răspunsuri multiple (a-d)' : 'cu cerinta in text cursiv un eu va trebui sa raspuns in text cursiv'} la materia ${nume_materie}`;
  else
    return `${input}\nconverteste acest test grila intrun array de elemente de exact acest format \n${JsonFormat}\n rapunde duar cu textul json pt acest array`;
}

export function get_question_prompt(
  materieName: string,
  file_content: string,
  question: string,
  language: string
): string {
  return `
CONȚINUT TEXTUAL PENTRU MATERIA "${materieName}":
${file_content}


ÎNTREBARE: ${question}


INSTRUCȚIUNI:
1. Răspunde EXCLUSIV pe baza informațiilor din textul de mai sus
2. Dacă întrebarea nu are răspuns în text, spune "Nu găsesc informații relevante în text"
3. Formulează răspunsul clar și concis în limba ${language}
4. Păstrează acuratețea informațiilor originale
5. Nu adăuga concluzii sau informații externe textului`;
}

export function to_json_prompt(format: string, content: string, context: string | null = null): string {
  return `convert this plain text data ${content} to json of this exact format ${format} ${context == null ? "" : `this is some more context of what this data is ${context} respond with only the json text with no markdown or any other text or details of any kind`} `;
}

export function generate_quiz_question_prompt(nume_materie: string, file_content: string, numar_intrebari: number, is_grila: boolean, language: string): string {
  return `materie:${nume_materie}\n${file_content}\ncreaza un set de ${numar_intrebari} din a aceasta materie ${is_grila ? 'cu raspunsuri grila abcd fa toate rapunsurile sa para cat mai plauzibile' : 'in text cursiv din teoria din acest text fix sigur ca sa fie posibil sa raspund cu informatia din acest text intrebarie trebuie sa nu fie grila si sa se astepte la un raspuns scris'}fi sigur sa acoperi toata materia din text cat de bine posibil`;
}

export function generate_quiz_json_prompt(
  nume_materie: string,
  file_content: string,
  numar_intrebari: number,
  is_grila: boolean,
  json_format: string,
  context: string | null = null,
  limbaj: string,
): string {
  return `
Generate a SINGLE JSON ARRAY containing ${numar_intrebari} question objects using this exact structure:
${json_format}


### Critical Requirements:
1. Output MUST be a SINGLE JSON ARRAY (e.g., [ {...}, {...} ])
2. Subject: ${nume_materie}
3. Output language: All content must be in ${limbaj}
4. Question type: ${is_grila ? 'Multiple-choice (ABCD) with plausible options' : 'Open-ended requiring written answers'}
5. ${is_grila ? '' : 'Answers must strictly use provided text'}
6. Cover key concepts comprehensively
${context ? `\n### Additional Context:\n${context}` : ''}


### Source Material:
${file_content}


Respond ONLY with valid JSON. No additional text, explanations, or markdown.
`.trim();
}

/**
 * AI Response Parsers
 */

export function extractFinalContent(text: string): string {
  const startMarker = "<|start|>assistant<|channel|>final<|message|>";
  const endMarkers = ["<|end|>", "<|return|>"];
  let lastIndex = 0;
  let result = "";

  // Find the LAST occurrence only
  const lastStartIndex = text.lastIndexOf(startMarker);
  if (lastStartIndex === -1) {
    return ""; // No start marker found
  }
  const contentStart = lastStartIndex + startMarker.length;

  // Find the earliest end marker after the start
  let contentEnd = text.length;
  for (const marker of endMarkers) {
    const markerIndex = text.indexOf(marker, contentStart);
    if (markerIndex !== -1 && markerIndex < contentEnd) {
      contentEnd = markerIndex;
    }
  }

  // Extract only the content from the LAST occurrence
  result = text.substring(contentStart, contentEnd).trim();
  return result; // Fixed: was returning empty in original code
}

export function removeXmlStyleTags(text: string): string {
  if (text.includes("<|message|>"))
    return text.split("<|message|>").pop() || "";
  else if (text.includes("<|channel|>"))
    return "";
  else
    return text;
}

export function get_chain_of_reason(out: string): string {
  if (!out.includes("<think>")) return "";
  return out.slice(7).split("</think>")[0];
}

export function get_output_content(out: string): string {
  if (!out.includes("<think>")) return out;
  return out.slice(7).split("</think>")[1];
}