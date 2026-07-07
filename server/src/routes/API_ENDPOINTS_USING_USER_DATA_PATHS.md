# API Endpoints Accessing User-Specific Data Paths with UserID Parameter

## Overview

This document tracks endpoints that access user-specific data paths derived from `getUserFolderPath()` (defined in `server/src/routes/auth.ts`). These endpoints properly accept and propagate a userId from the frontend.

---

## POST Endpoints (4)

### 1. POST `/add_materie`
- **Handler:** `addMaterie` — `studyRoutes.ts` lines 21-42
- **userId source:** `req.body.userId` (line 27)
- **Usage:** Calls `getUserFolderPath(userId)` at line 29, 36

### 2. POST `/delete_materie`
- **Handler:** `deleteMaterie` — `studyRoutes.ts` lines 44-98
- **userId source:** `req.body.userId` (line 51)
- **Usage:** Calls `getUserFolderPath(userId)` at line 53

### 3. POST `/send_file`
- **Handler:** `sendFile` — `fileRoutes.ts` lines 29-108
- **userId source:** `req.body.userId` (line 45)
- **Usage:** Calls `getUserFolderPath(userId)` at line 53, passes userId to `onFileCreate()` callback

### 4. POST `/delete_file`
- **Handler:** `deleteFile` — `fileRoutes.ts` lines 189-219
- **userId source:** `req.body.userId` (line 191)
- **Usage:** Calls `getUserFolderPath(userId)` at line 200

### 5. POST `/checkExisting`
- **Handler:** `checkExisting` — `fileRoutes.ts` lines 110-141
- **userId source:** `req.body.userId` (line 112)
- **Usage:** Calls `getUserFolderPath(userId)` at line 119

### 6. POST `/get_file`
- **Handler:** `getFile` — `fileRoutes.ts` lines 143-187
- **userId source:** `req.body.userId` (line 149)
- **Usage:** Calls `getUserFolderPath(userId)` at line 154

---

## GET Endpoints (1)

### 1. GET `/study`
- **Handler:** `getStudy` — `studyRoutes.ts` lines 100-117
- **userId source:** `req.query.userId` (line 101)
- **Usage:** Creates `new StudyGroup(userId)` at line 108 when userId is provided

---

## Summary Table

| HTTP Method | Endpoint | Route File | Handler | userId Source | Status |
|-------------|----------|------------|---------|---------------|--------|
| POST | `/add_materie` | studyRoutes.ts | addMaterie | req.body.userId | ✅ Uses userId |
| POST | `/delete_materie` | studyRoutes.ts | deleteMaterie | req.body.userId | ✅ Uses userId |
| POST | `/send_file` | fileRoutes.ts | sendFile | req.body.userId | ✅ Uses userId |
| POST | `/delete_file` | fileRoutes.ts | deleteFile | req.body.userId | ✅ Uses userId |
| POST | `/checkExisting` | fileRoutes.ts | checkExisting | req.body.userId | ✅ Uses userId |
| POST | `/get_file` | fileRoutes.ts | getFile | req.body.userId | ✅ Uses userId |
| GET | `/study` | studyRoutes.ts | getStudy | req.query.userId | ✅ Uses userId |

**Total: 7 endpoints (6 POST + 1 GET) — all properly accept and propagate a UserID from the frontend.**

---

## Functions Called Without Arguments

The following functions have optional userId parameters that fall back to `process.env.GUEST_USER_ID` when not provided. These are called indirectly via the singleton `data_study` which stores `_userId`:

### `getUserFolderPath(userId?: string)` — called without arguments from:
- **StudyGroup.ts:** Constructor receives userId and stores it in `_userId` property
- **file-processor.ts:** Called via StudyGroup methods with userId context

---

## Frontend Changes

### Network Layer (`frontend/src/network/documents.ts`)
- `delete_file()` — accepts optional `userId` parameter, includes in request body
- `fetchFileFromServer()` — accepts optional `userId` parameter, includes in request body
- `loadDocumentContent()` — accepts optional `userId` parameter, includes in request body

### Component Chain (userId flows from App.tsx through props):
1. **App.tsx** → passes `userId` to `<Main>`
2. **Main.tsx** → passes `userId` to `<Materie>`, `<UploadPage>`
3. **Materie.tsx** → passes `userId` to `<Browser>`, `<Sinteza>`, `<Quizs>`
4. **Browser.tsx** → passes `userId` to:
   - `<ResourceBrowser>` (file list and upload)
   - `<PDFViewer>` (PDF/PPT viewing)
   - `<DocViewer>` (DOCX viewing)
   - `<ImageViewer>` (image viewing)
5. **ResourceBrowser.tsx** → passes `userId` to:
   - `<BrowserItem>` (file deletion)
   - `<UploadPage>` (file upload)
6. **UploadPage.tsx** → passes `userId` to:
   - `<DocumentUpload>` (document uploads)
   - `<UploadImgGroup>` (image uploads)
7. **BrowserItem.tsx** → passes `userId` to `delete_file()` call

All viewers pass userId when fetching files from server:
- **PDFViewer** → `fetchFileFromServer(path, url, userId)`
- **DocViewer** → `loadDocumentContent({path, userId})`
- **ImageViewer** → POST `/get_file` with userId in body