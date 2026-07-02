# Old `network.ts` References (Deprecated)

The monolithic `frontend/src/scripts/network.ts` has been removed and split into multiple files under `frontend/src/scripts/network/`.

**This file documents all remaining import references to the old `'../scripts/network'` or `'./scripts/network'` paths.**
No code changes have been made — only a reference list is provided.

---

## 1. `frontend/src/App.tsx`

```ts
import { get_config, get_data, getAvailableStyles, getGuestToken, getSupportedModels, getValidStudyLmstudio } from './scripts/network';
```

| Function | New Location |
|----------|-------------|
| `get_config` | `./network/app-config` |
| `get_data` | `./network/study-groups` |
| `getAvailableStyles` | `./network/html-generator` |
| `getGuestToken` | `./network/auth` |
| `getSupportedModels` | `./network/ai-models` |
| `getValidStudyLmstudio` | `./network/ai-models` |

---

## 2. `frontend/src/pages/Main.tsx`

```ts
import { DeactivateErrorMessage } from '../scripts/network'
```

| Function | New Location |
|----------|-------------|
| `DeactivateErrorMessage` | `../network/app-config` |

---

## 3. `frontend/src/pages/LoginPage.tsx`

```ts
import { registerUser, loginUser } from '../scripts/network';
```

| Function | New Location |
|----------|-------------|
| `registerUser` | `../network/auth` |
| `loginUser` | `../network/auth` |

---

## 4. `frontend/src/pages/SettingsPage.tsx`

```ts
import { setContextSizeConfig, setLanguageConfig, setSystemPromptConfig, getHtmlStyleConfig, setHtmlStyleConfig } from '../scripts/network';
```

| Function | New Location |
|----------|-------------|
| `setContextSizeConfig` | `../network/ai-models` |
| `setLanguageConfig` | `../network/app-config` |
| `setSystemPromptConfig` | `../network/ai-models` |
| `getHtmlStyleConfig` | `../network/html-generator` |
| `setHtmlStyleConfig` | `../network/html-generator` |

---

## Summary

| File | Functions to Import | New Import Paths |
|------|---------------------|------------------|
| `App.tsx` | 6 functions across 3 modules | Split into multiple imports from `./network/app-config`, `./network/study-groups`, `./network/html-generator`, `./network/auth`, `./network/ai-models` |
| `Main.tsx` | 1 function | `../network/app-config` |
| `LoginPage.tsx` | 2 functions | `../network/auth` |
| `SettingsPage.tsx` | 5 functions across 3 modules | Split into imports from `../network/ai-models`, `../network/app-config`, `../network/html-generator` |

---

## New File Map (for reference)

| New File | Functions Exported |
|----------|-------------------|
| `./network/ai-models` | `getSupportedModels`, `selectModel`, `setSystemPromptConfig`, `setContextSizeConfig`, `getCustomModels`, `getModelsPaths`, `getValidStudyLmstudio` |
| `./network/app-config` | `DeactivateErrorMessage`, `get_config`, `setLanguageConfig` |
| `./network/auth` | `registerUser`, `loginUser`, `verifyToken`, `getGuestToken` |
| `./network/documents` | `AskDocumentQuestion`, `stopAnsweringQuestion`, `delete_file`, `loadDocumentContent`, `fetchFileFromServer` |
| `./network/html-generator` | `generateHTML`, `getAvailableStyles`, `getHtmlStyleConfig`, `setHtmlStyleConfig` |
| `./network/quiz` | `submiForEvaluation`, `clear_evaluare`, `GenerateNewQuiz`, `ReGenerateNewQuiz`, `DeleteQuiz` |
| `./network/study-groups` | `get_data`, `add_materie`, `delete_materie` |
| `./network/utils` | `addr`, `getFileType` |

All files export a shared `addr` constant from `./network/utils` for the backend URL.