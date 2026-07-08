# API Endpoints Accessing User-Specific Data Paths with UserID Parameter

## Overview

This document tracks endpoints that access user-specific data paths derived from `getUserFolderPath()` and `getUserMetaDataSpot()` (both defined in `server/src/routes/auth.ts`). These functions accept an optional `userId` parameter — when not provided, they fall back to `process.env.GUEST_USER_ID`.

---

## POST Endpoints That Properly Accept and Propagate UserID

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

## GET Endpoints That Properly Accept and Propagate UserID

### 1. GET `/study`
- **Handler:** `getStudy` — `studyRoutes.ts` lines 100-117
- **userId source:** `req.query.userId` (line 101)
- **Usage:** Creates `new StudyGroup(userId)` at line 108 when userId is provided

---

## Summary Table: Endpoints That Properly Accept UserID

| HTTP Method | Endpoint | Route File | Handler | userId Source | Status |
|-------------|----------|------------|---------|---------------|--------|
| POST | `/add_materie` | studyRoutes.ts | addMaterie | req.body.userId | ✅ Uses userId |
| POST | `/delete_materie` | studyRoutes.ts | deleteMaterie | req.body.userId | ✅ Uses userId |
| POST | `/send_file` | fileRoutes.ts | sendFile | req.body.userId | ✅ Uses userId |
| POST | `/delete_file` | fileRoutes.ts | deleteFile | req.body.userId | ✅ Uses userId |
| POST | `/checkExisting` | fileRoutes.ts | checkExisting | req.body.userId | ✅ Uses userId |
| POST | `/get_file` | fileRoutes.ts | getFile | req.body.userId | ✅ Uses userId |
| GET | `/study` | studyRoutes.ts | getStudy | req.query.userId | ✅ Uses userId (when provided) |

**Total: 7 endpoints — all properly accept and propagate a UserID from the frontend.**

---

## Endpoints That Default to Guest User (No UserID Passed)

The following HTTP endpoints ultimately call `getUserFolderPath()` or `getUserMetaDataSpot()` **without passing a userId**, causing them to fall back to `process.env.GUEST_USER_ID`.

### 1. Internal: `get_content_filled_file_list()` in file-processor.ts
- **Location:** `file-processor.ts` line 192
- **Call:** `getUserMetaDataSpot()` with no argument
- **Called from:** `StudyGroup._loadWithUserId()` at line 44 — which already has access to `userId` but doesn't thread it through
- **Impact:** Any file content resolution during study group loading uses guest user's metadata

---

## Summary Table: Endpoints That Default to Guest User

| HTTP Endpoint | Method | Root Cause | Always Guest? | Conditional Guest? |
|---|---|---|---|---|
| `POST /add_materie` | POST | `getUserFolderPath(userId)` where userId comes from `req.body.userId` | No | If client omits userId in body |
| `POST /delete_materie` | POST | `getUserFolderPath(userId)` where userId comes from `req.body.userId` | No | If client omits userId in body |

---

## Fixed: GET /study and GET /studyDirect (Previously Defaulted to Guest User)

**Status:** ✅ **Fixed** — These endpoints now always receive a userId parameter from the frontend.

### Changes Made

| File | Change |
|------|--------|
| `frontend/src/network/study-groups.ts` | `get_data()` now always includes `userId` in the URL: `${addr}/study?userId=${encodeURIComponent(userId ?? '')}` |
| `server/src/routes/studyRoutes.ts` | `getStudy()` now creates a fresh `StudyGroup` instance per request instead of returning the singleton. Sets `_userId` when provided, otherwise falls back to guest user consistently. |

### New Code Flow

**Frontend:** Every request to `/study` includes userId:
```typescript
const url = `${addr}/study?userId=${encodeURIComponent(userId ?? '')}`;
```

**Backend:** Always creates a per-user StudyGroup instance:
```typescript
const userStudy = new (data_study.constructor as typeof StudyGroup)();
if (userId) {
  (userStudy as any)._userId = userId;
}
userStudy.load(config);
res.json(userStudy);
```

When `userId` is empty string, both `getUserFolderPath()` and `getUserMetaDataSpot()` fall back to `process.env.GUEST_USER_ID` internally — but this happens **explicitly** rather than silently through the singleton.

## Function Call Sites Summary

### `getUserFolderPath(userId?: string)` — All Call Sites

| File | Line | Call Site | userId Passed? |
|------|------|-----------|----------------|
| `server/src/routes/studyRoutes.ts` | 29 | `getDirectoryContent(getUserFolderPath(userId))` | ✅ Yes (from req.body) |
| `server/src/routes/studyRoutes.ts` | 36 | `mkdirSync(\`${getUserFolderPath(userId)}/${name}\`, ...)` | ✅ Yes (from req.body) |
| `server/src/routes/studyRoutes.ts` | 53 | `const folderPath = getUserFolderPath(userId)` | ✅ Yes (from req.body) |
| `server/src/objects/StudyGroup.ts` | 36 | `getUserFolderPath(userId)` in `_loadWithUserId()` | ✅ Yes (parameter) |

### `getUserMetaDataSpot(userId?: string)` — All Call Sites

| File | Line | Call Site | userId Passed? |
|------|------|-----------|----------------|
| `server/src/objects/StudyGroup.ts` | 20 | `this.file_path = getUserMetaDataSpot(this._userId)` | ✅ Yes (stored property) |
| `server/src/objects/StudyGroup.ts` | 25 | `this.file_path = getUserMetaDataSpot(this._userId)` | ✅ Yes (stored property) |
| `server/src/services/file-processor.ts` | 192 | `readFileSync(getUserMetaDataSpot(), "utf-8")` | ❌ **NO** — always guest user |

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