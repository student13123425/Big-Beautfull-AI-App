# Functions Called Without Token Argument

This document lists all backend locations where `getUserFolderPath(token?: string)` and `getUserMetaDataSpot(token?: string)` from `auth.ts` are called **without** a token argument being passed. These calls rely on the `GUEST_TOKEN` environment variable fallback.

---

## File: `server/src/services/file-processor.ts`

### Line 192 — `get_content_filled_file_list()` function
```typescript
const json: string = readFileSync(getUserMetaDataSpot(), "utf-8");
```
- **Function called:** `getUserMetaDataSpot()` with no arguments.
- **Context:** Used to read the user metadata JSON file to build a list of files that have content loaded.

---

## File: `server/src/objects/StudyGroup.ts`

### Line 13 — Class field initialization
```typescript
file_path:string=getUserMetaDataSpot()
```
- **Function called:** `getUserMetaDataSpot()` with no arguments.
- **Context:** Initializes the default file path for storing study group metadata as a class field.

### Lines 25, 28, 31 — `load()` method
```typescript
let dirs: string[] = getDirectoryContent(getUserFolderPath(), ["temp_uploads", "UserMetadata"]);
```
- **Line 25:** `getUserFolderPath()` with no arguments — reads directory listing to populate study group data.

```typescript
let files: string[] = getDirectoryContent(`${getUserFolderPath()}/${it}`, []);
```
- **Line 28:** `getUserFolderPath()` with no arguments — iterates over files within each materia folder.

```typescript
let path:string=`${getUserFolderPath()}/${it}/${f}`;
```
- **Line 31:** `getUserFolderPath()` with no arguments — constructs full file paths for loading file data.

---

## File: `server/src/routes/studyRoutes.ts`

### Line 27, 34 — `addMaterie()` handler
```typescript
const list: string[] = getDirectoryContent(getUserFolderPath());
```
- **Line 27:** `getUserFolderPath()` with no arguments — checks existing materia folders to avoid duplicates.

```typescript
await mkdirSync(`${getUserFolderPath()}/${name}`, { recursive: true });
```
- **Line 34:** `getUserFolderPath()` with no arguments — creates a new materia folder.

### Lines 48, 51 — `deleteMaterie()` handler
```typescript
const list: string[] = getDirectoryContent(getUserFolderPath());
```
- **Line 48:** `getUserFolderPath()` with no arguments — checks existing materia folders before deletion.

```typescript
await rmSync(`${getUserFolderPath()}/${name}`, { recursive: true, force: true });
```
- **Line 51:** `getUserFolderPath()` with no arguments — removes a materia folder recursively.

---

## Summary

| File | Function Called | Lines | Count |
|------|----------------|-------|-------|
| `server/src/services/file-processor.ts` | `getUserMetaDataSpot()` | 192 | 1 |
| `server/src/objects/StudyGroup.ts` | `getUserMetaDataSpot()` | 13 | 1 |
| `server/src/objects/StudyGroup.ts` | `getUserFolderPath()` | 25, 28, 31 | 3 |
| `server/src/routes/studyRoutes.ts` | `getUserFolderPath()` | 27, 34, 48, 51 | 4 |
| **Total** | | | **9** |

All calls fall back to `process.env.GUEST_TOKEN` when no token is provided.