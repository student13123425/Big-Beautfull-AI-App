# API Endpoints Accessing User-Specific Data Without UserID Parameter

## Overview

All endpoints listed below access user-specific data paths derived from `getUserFolderPath()` and `getUserMetaDataSpot()` (defined in `server/src/routes/auth.ts`). These functions are called **without any arguments**, falling back to `process.env.GUEST_USER_ID`. None of these endpoints accept or propagate a userId from the frontend.

The user data is managed through the singleton `data_study` (`StudyGroup` class, initialized in `server/src/services/state.ts`), which stores all Materie/Quiz/File data at paths derived from these two functions.

---

## POST Endpoints (12)

### 1. POST `/add_materie`
- **Handler:** `addMaterie` — `studyRoutes.ts` lines 20-39
- **Direct calls:** `getUserFolderPath()` without arguments (lines 27, 34 in studyRoutes.ts)
- **Indirect calls:** `data_study.load(config)` → `StudyGroup.load()` → `getUserFolderPath()`, `getUserMetaDataSpot()`

### 2. POST `/delete_materie`
- **Handler:** `deleteMaterie` — `studyRoutes.ts` lines 41-60
- **Direct calls:** `getUserFolderPath()` without arguments (lines 48, 51 in studyRoutes.ts)
- **Indirect calls:** `data_study.load(config)` → `StudyGroup.load()` → `getUserFolderPath()`, `getUserMetaDataSpot()`

### 3. POST `/genereaza_sinteza`
- **Handler:** `handleContentGeneration` — `studyRoutes.ts` lines 228-289
- **Indirect calls:** Iterates `data_study.data` → accesses file paths stored under user folder; calls `genereazSinteza()` and `genereazHTML()` which access `data_study.data`

### 4. POST `/regenereaza_sinteza`
- **Handler:** `regenereazSinteza` — `studyRoutes.ts` lines 66-115
- **Indirect calls:** Iterates `data_study.data` → accesses file paths stored under user folder

### 5. POST `/send_file`
- **Handler:** `sendFile` — `fileRoutes.ts` lines 28-102
- **Indirect calls:** Calls `data_study.load(config)` (lines 71, 83) → triggers full `StudyGroup.load()` chain → `getUserFolderPath()`, `getUserMetaDataSpot()`

### 6. POST `/delete_file`
- **Handler:** `deleteFile` — `fileRoutes.ts` lines 166-187
- **Indirect calls:** Calls `data_study.process_file_delete()` — accesses `data_study.data` array containing user folder paths

### 7. POST `/askFileQuestion`
- **Handler:** `askFileQuestion` — `evaluationRoutes.ts` lines 9-61
- **Indirect calls:** Iterates `data_study.data` to find files stored under user folder path; accesses `data_study.CurrentAskedQuestion`

### 8. POST `/Evaluare`
- **Handler:** `processEvaluare` — `evaluationRoutes.ts` lines 68-101
- **Indirect calls:** Accesses and modifies `data_study.AiTextCorrection` — persisted in user metadata JSON file

### 9. POST `/DeactivateErrorMessage`
- **Handler:** `DeactivateErrorMessage` — `evaluationRoutes.ts` lines 123-141
- **Indirect calls:** Modifies `data_study.AiServerError[]` array — broadcast to clients via WebSocket

### 10. POST `/select_model`
- **Handler:** `setSelectedModel` — `aiRoutes.ts`
- **Indirect calls:** Accesses shared state that persists user configuration

### 11. POST `/set_language`
- **Handler:** `setLanguage` — `configRoutes.ts`
- **Indirect calls:** Modifies `config` object saved to user data directory

### 12. POST `/set_context_size`
- **Handler:** `setContextSize` — `configRoutes.ts`
- **Indirect calls:** Modifies `config` object saved to user data directory

### 13. POST `/set_system_prompt`
- **Handler:** `setSystemPrompt` — `configRoutes.ts`
- **Indirect calls:** Modifies `config` object saved to user data directory

### 14. POST `/GenerateNewQuiz`
- **Handler:** `generateQuiz` — `quizRoutes.ts` lines 10-50
- **Indirect calls:** Iterates `data_study.data`, modifies quizs array, calls `data_study.save()` → writes to user metadata JSON

### 15. POST `/ReGenerateNewQuiz`
- **Handler:** `regenerateQuiz` — `quizRoutes.ts` lines 52-94
- **Indirect calls:** Iterates `data_study.data`, modifies quizs array, calls `data_study.save()` → writes to user metadata JSON

### 16. POST `/DeleteQuiz`
- **Handler:** `deleteQuiz` — `quizRoutes.ts` lines 96-112
- **Indirect calls:** Iterates `data_study.data`, modifies quizs array, calls `data_study.save()` → writes to user metadata JSON

---

## GET Endpoints (4)

### 1. GET `/study`
- **Handler:** `getStudy` — `studyRoutes.ts` lines 62-64
- **Indirect calls:** Returns `data_study` directly — contains all user Materie/Quiz/File data loaded from user folder

### 2. GET `/studyDirect`
- **Handler:** `getStudy` — `studyRoutes.ts` lines 338-340 in index.ts
- **Indirect calls:** Same as above — returns full user study data

### 3. GET `/ClearEvaluare`
- **Handler:** `ClearEvaluare` — `evaluationRoutes.ts` lines 103-121
- **Indirect calls:** Accesses and resets `data_study.AiTextCorrection` — stored in user metadata JSON file

### 4. GET `/stopAnsweringQuestion`
- **Handler:** `stopAnsweringQuestion` — `evaluationRoutes.ts` lines 63-66
- **Indirect calls:** Calls `data_study.CurrentAskedQuestion.stop()` — question state from user data

---

## Summary Table

| HTTP Method | Endpoint | Route File | Direct Call? | Indirect via data_study? |
|-------------|----------|------------|--------------|--------------------------|
| POST | `/add_materie` | studyRoutes.ts | Yes (getUserFolderPath) | Yes |
| POST | `/delete_materie` | studyRoutes.ts | Yes (getUserFolderPath) | Yes |
| POST | `/genereaza_sinteza` | studyRoutes.ts | No | Yes |
| POST | `/regenereaza_sinteza` | studyRoutes.ts | No | Yes |
| POST | `/send_file` | fileRoutes.ts | No | Yes (data_study.load) |
| POST | `/delete_file` | fileRoutes.ts | No | Yes |
| POST | `/askFileQuestion` | evaluationRoutes.ts | No | Yes |
| POST | `/Evaluare` | evaluationRoutes.ts | No | Yes |
| POST | `/DeactivateErrorMessage` | evaluationRoutes.ts | No | Yes |
| POST | `/select_model` | aiRoutes.ts | No | Yes (shared state) |
| POST | `/set_language` | configRoutes.ts | No | Yes (config save) |
| POST | `/set_context_size` | configRoutes.ts | No | Yes (config save) |
| POST | `/set_system_prompt` | configRoutes.ts | No | Yes (config save) |
| POST | `/GenerateNewQuiz` | quizRoutes.ts | No | Yes |
| POST | `/ReGenerateNewQuiz` | quizRoutes.ts | No | Yes |
| POST | `/DeleteQuiz` | quizRoutes.ts | No | Yes |
| GET | `/study` | studyRoutes.ts | No | Yes |
| GET | `/studyDirect` | studyRoutes.ts | No | Yes |
| GET | `/ClearEvaluare` | evaluationRoutes.ts | No | Yes |
| GET | `/stopAnsweringQuestion` | evaluationRoutes.ts | No | Yes |

**Total: 20 endpoints (16 POST + 4 GET)** — all access user-specific data without receiving or propagating a UserID.

---

## Functions Called Without Arguments

### `getUserFolderPath()` — called without arguments in:
- **studyRoutes.ts:** lines 27, 34, 48, 51 (direct)
- **StudyGroup.ts:** lines 13, 25, 28, 31 (via class initialization and `.load()`)
- **file-processor.ts:** line 192 via `get_content_filled_file_list()` → called from StudyGroup

### `getUserMetaDataSpot()` — called without arguments in:
- **StudyGroup.ts:** line 13 (class property initialization)
- **file-processor.ts:** line 192 (`get_content_filled_file_list()`)