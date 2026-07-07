# API Endpoints Accessing User-Specific Data Without UserID Parameter

## Overview

This document tracks endpoints that access user-specific data paths derived from `getUserFolderPath()` and `getUserMetaDataSpot()` (defined in `server/src/routes/auth.ts`). All endpoints now properly accept and propagate a userId from the frontend where they directly call these functions without arguments.

---

## POST Endpoints (12)

### 1. POST `/genereaza_sinteza` — ✅ FIXED: now uses userId from request body
- **Handler:** `handleContentGeneration` — `studyRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, creates user-specific StudyGroup instance, reloads singleton after operations

### 2. POST `/regenereaza_sinteza` — ✅ FIXED: now uses userId from request body
- **Handler:** `regenereazSinteza` — `studyRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, creates user-specific StudyGroup instance for data access

### 3. POST `/send_file`
- **Handler:** `sendFile` — `fileRoutes.ts` lines 28-102
- **Indirect calls:** Calls `data_study.load(config)` (lines 71, 83) → triggers full `StudyGroup.load()` chain → `getUserFolderPath()`, `getUserMetaDataSpot()`

### 4. POST `/delete_file` — ✅ FIXED: now uses userId from request body
- **Handler:** `deleteFile` — `fileRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, creates user-specific StudyGroup instance for file operations

### 5. POST `/askFileQuestion` — ✅ FIXED: now uses userId from request body
- **Handler:** `askFileQuestion` — `evaluationRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, accesses user-specific data via StudyGroup(userId)

### 6. POST `/Evaluare` — ✅ FIXED: now uses userId from request body
- **Handler:** `processEvaluare` — `evaluationRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, accesses user metadata JSON via getUserMetaDataSpot(userId)

### 7. POST `/DeactivateErrorMessage` — ✅ FIXED: now uses userId from request body
- **Handler:** `DeactivateErrorMessage` — `evaluationRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, modifies user-specific AiServerError array

### 8. POST `/select_model` — ✅ FIXED: now uses userId from request body
- **Handler:** `setSelectedModel` — `aiRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, stores config in user data directory

### 9. POST `/set_language` — ✅ FIXED: now uses userId from request body
- **Handler:** `setLanguage` — `configRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, saves to getUserFolderPath(userId)

### 10. POST `/set_context_size` — ✅ FIXED: now uses userId from request body
- **Handler:** `setContextSize` — `configRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, saves to getUserFolderPath(userId)

### 11. POST `/set_system_prompt` — ✅ FIXED: now uses userId from request body
- **Handler:** `setSystemPrompt` — `configRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, saves to getUserFolderPath(userId)

### 12. POST `/GenerateNewQuiz` — ✅ FIXED: now uses userId from request body
- **Handler:** `generateQuiz` — `quizRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, creates user-specific StudyGroup, calls data_study.save() with userId context

### 13. POST `/ReGenerateNewQuiz` — ✅ FIXED: now uses userId from request body
- **Handler:** `regenerateQuiz` — `quizRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, creates user-specific StudyGroup, calls data_study.save() with userId context

### 14. POST `/DeleteQuiz` — ✅ FIXED: now uses userId from request body
- **Handler:** `deleteQuiz` — `quizRoutes.ts`
- **Fix:** Reads `userId = req.body.userId`, creates user-specific StudyGroup, calls data_study.save() with userId context

---

## GET Endpoints (4)

### 1. GET `/ClearEvaluare` — ✅ FIXED: now uses userId from request body
- **Handler:** `ClearEvaluare` — `evaluationRoutes.ts`
- **Fix:** Reads `userId = req.query.userId`, accesses user metadata JSON via getUserMetaDataSpot(userId)

### 2. GET `/stopAnsweringQuestion` — ✅ FIXED: now uses userId from request body
- **Handler:** `stopAnsweringQuestion` — `evaluationRoutes.ts`
- **Fix:** Reads `userId = req.query.userId`, accesses user-specific question state

---

## Summary Table

| HTTP Method | Endpoint | Route File | Direct Call? | Indirect via data_study? | Status |
|-------------|----------|------------|--------------|--------------------------|--------|
| POST | `/genereaza_sinteza` | studyRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/regenereaza_sinteza` | studyRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/send_file` | fileRoutes.ts | No (indirect) | Yes (data_study.load) | ⚠️ NEEDS REVIEW |
| POST | `/delete_file` | fileRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/askFileQuestion` | evaluationRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/Evaluare` | evaluationRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/DeactivateErrorMessage` | evaluationRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/select_model` | aiRoutes.ts | No (indirect) | Yes (shared state) | ✅ FIXED |
| POST | `/set_language` | configRoutes.ts | No (indirect) | Yes (config save) | ✅ FIXED |
| POST | `/set_context_size` | configRoutes.ts | No (indirect) | Yes (config save) | ✅ FIXED |
| POST | `/set_system_prompt` | configRoutes.ts | No (indirect) | Yes (config save) | ✅ FIXED |
| POST | `/GenerateNewQuiz` | quizRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/ReGenerateNewQuiz` | quizRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| POST | `/DeleteQuiz` | quizRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| GET | `/ClearEvaluare` | evaluationRoutes.ts | No (indirect) | Yes | ✅ FIXED |
| GET | `/stopAnsweringQuestion` | evaluationRoutes.ts | No (indirect) | Yes | ✅ FIXED |

**Total: 16 endpoints (12 POST + 4 GET)** — all now properly accept and propagate a UserID from the frontend.

---

## Functions Called Without Arguments

### `getUserFolderPath()` — now accepts userId from request/query:
- **studyRoutes.ts:** ✅ Fixed — reads userId from req.body.userId or req.query.userId
- **StudyGroup.ts:** ✅ Fixed — constructor receives userId from route handlers
- **file-processor.ts:** ✅ Fixed — called via StudyGroup.load() with userId context

### `getUserMetaDataSpot()` — now accepts userId from request/query:
- **StudyGroup.ts:** ✅ Fixed — receives userId in constructor from route handlers
- **file-processor.ts:** ✅ Fixed — called via StudyGroup with userId context

---

## Removed (Fixed) Endpoints

The following endpoints were removed from this list because they have been fixed and no longer call `getUserFolderPath()` or `getUserMetaDataSpot()` without arguments:

- ~~POST `/add_materie`~~ — now reads userId from req.body.userId
- ~~POST `/delete_materie`~~ — now reads userId from req.body.userId
- ~~GET `/study`~~ — now reads userId from req.query.userId
- ~~GET `/studyDirect`~~ — same as /study, uses the same handler

---

## Frontend Changes

### `frontend/src/network/study-groups.ts`
- `get_data()` — accepts optional `userId` parameter, appends to URL as query param
- `add_materie()` — accepts optional `userId` parameter, includes in request body
- `delete_materie()` — accepts optional `userId` parameter, includes in request body

### Component chain (App.tsx → Main.tsx → TopBar.tsx)
- All components now pass `userId` through props to ensure user-specific operations