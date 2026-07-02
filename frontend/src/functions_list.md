# Network Functions (from `frontend/src/scripts/network.ts`)

| # | Function Name | Line | Description |
|---|---------------|------|-------------|
| 1 | `DeactivateErrorMessage` | 6 | Deactivates an error message by index; contacts the `/DeactivateErrorMessage` endpoint. |
| 2 | `submiForEvaluation` | 52 | Submits a quiz with answers for evaluation to the `/Evaluare` endpoint. |
| 3 | `clear_evaluare` | 84 | Clears all evaluation data via the `/ClearEvaluare` endpoint. |
| 4 | `get_config` | 97 | Fetches and applies the application configuration from the `/config` endpoint. |
| 5 | `getSupportedModels` | 134 | Retrieves the list of supported AI models from the `/select_model` endpoint. |
| 6 | `selectModel` | 165 | Selects a specific AI model via the `/select_model` endpoint. |
| 7 | `setSystemPromptConfig` | 195 | Sets the system prompt configuration via the `/set_system_prompt` endpoint. |
| 8 | `setContextSizeConfig` | 226 | Sets the context size configuration via the `/set_context_size` endpoint. |
| 9 | `setLanguageConfig` | 263 | Sets the language preference via the `/set_language` endpoint. |
| 10 | `getCustomModels` | 295 | Fetches custom AI models from the `/models_costum_format` endpoint. |
| 11 | `get_data` | 323 | Fetches study group data from the `/study` endpoint. |
| 12 | `getModelsPaths` | 354 | Retrieves available model file paths from the `/models_paths` endpoint. |
| 13 | `getValidStudyLmstudio` | 382 | Validates the LM Studio connection via the `/get_valid_study_lmstudio` endpoint. |
| 14 | `add_materie` | 417 | Adds a new subject (materie) via the `/add_materie` endpoint. |
| 15 | `stopAnsweringQuestion` | 441 | Stops the current question answering process via the `/stopAnsweringQuestion` endpoint. |
| 16 | `AskDocumentQuestion` | 457 | Asks a question about a specific document/file via the `/askFileQuestion` endpoint. |
| 17 | `GenerateNewQuiz` | 496 | Generates a new quiz via the `/GenerateNewQuiz` endpoint. |
| 18 | `ReGenerateNewQuiz` | 527 | Regenerates an existing quiz via the `/ReGenerateNewQuiz` endpoint. |
| 19 | `delete_materie` | 560 | Deletes a subject (materie) via the `/delete_materie` endpoint. |
| 20 | `delete_file` | 583 | Deletes a file via the `/delete_file` endpoint. |
| 21 | `loadDocumentContent` | 624 | Loads and converts document content (DOCX, TXT, MD) from the server via the `/get_file` endpoint. |
| 22 | `fetchFileFromServer` | 657 | Fetches a raw file as Uint8Array from the server via the `/get_file` endpoint. |
| 23 | `getFileType` | 680 | Utility function to determine if a file is PDF or PPTX based on extension. |
| 24 | `DeleteQuiz` | 685 | Deletes a quiz by title and subject via the `/DeleteQuiz` endpoint. |
| 25 | `registerUser` | 717 | Registers a new user account via the `/register` endpoint. |
| 26 | `loginUser` | 748 | Logs in an existing user via the `/login` endpoint. |
| 27 | `verifyToken` | 777 | Verifies an authentication token via the `/verify_token` endpoint. |
| 28 | `generateHTML` | 808 | Generates HTML content from a file via the `/genereaza_html` endpoint. |
| 29 | `getAvailableStyles` | 847 | Retrieves available HTML styling options via the `/sintezaStyles` endpoint. |
| 30 | `getHtmlStyleConfig` | 874 | Fetches the current HTML style configuration from the `/htmlStyle` endpoint. |
| 31 | `setHtmlStyleConfig` | 903 | Sets the HTML style preference via the `/htmlStyle` endpoint. |
| 32 | `getGuestToken` | 936 | Fetches a guest authentication token via the `/guestToken` endpoint. |

## Summary

- **Total functions:** 32
- **Uses axios:** 28 functions
- **Uses fetch:** 4 functions (`GenerateNewQuiz`, `ReGenerateNewQuiz`, `DeleteQuiz`, `loadDocumentContent`, `fetchFileFromServer`)
- **Utility functions (no network calls):** 1 (`getFileType`)