# `./data/` Path Locations in Backend

This document lists all locations where the hardcoded path `./data/` is defined in the backend codebase.

**Total occurrences: 11 references across 3 files.**

---

## 1. `server/src/services/file-processor.ts` — 2 references

### Line 21 — Security Whitelist (Path Sanitization)
```typescript
const allowedDir = path.resolve("./data/");
```
**Purpose:** Used in the `sanitizePath()` function to validate that all file paths are within the `./data/` directory. This is a security measure preventing directory traversal attacks.

### Line 191 — StudyGroups JSON File Path
```typescript
const json: string = readFileSync("./data/UserMetadata/StudyGroups.json", "utf-8");
```
**Purpose:** Used in `get_content_filled_file_list()` to read the StudyGroups metadata file and retrieve files that have extracted content.

---

## 2. `server/src/routes/studyRoutes.ts` — 4 references

### Line 26 — Check Existing Materials (addMaterie)
```typescript
const list: string[] = getDirectoryContent("./data/");
```
**Purpose:** In `addMaterie()`, retrieves all material folders to check if a material with the given name already exists.

### Line 33 — Create New Material Directory
```typescript
await mkdirSync(`./data/${name}`, { recursive: true });
```
**Purpose:** In `addMaterie()`, creates a new directory for a material (e.g., `./data/Math`).

### Line 47 — Check Existing Materials (deleteMaterie)
```typescript
const list: string[] = getDirectoryContent("./data/");
```
**Purpose:** In `deleteMaterie()`, retrieves all material folders to verify the material exists before deletion.

### Line 50 — Delete Material Directory
```typescript
await rmSync(`./data/${name}`, { recursive: true, force: true });
```
**Purpose:** In `deleteMaterie()`, removes a material's directory and all its contents (e.g., `./data/Math`).

---

## 3. `server/src/objects/StudyGroup.ts` — 4 references

### Line 12 — Default StudyGroups JSON File Path
```typescript
file_path:string="./data/UserMetadata/StudyGroups.json"
```
**Purpose:** Class property defining the default path where the StudyGroups metadata is persisted as JSON. Used by `save()` method to write data.

### Line 24 — Load All Material Directories
```typescript
let dirs: string[] = getDirectoryContent("./data", ["temp_uploads", "UserMetadata"]);
```
**Purpose:** In `load()`, reads all subdirectories from `./data/` (excluding `temp_uploads` and `UserMetadata`). Each subdirectory represents a material.

### Line 27 — Load Files Within Each Material
```typescript
let files: string[] = getDirectoryContent(`./data/${it}`, []);
```
**Purpose:** For each material directory, reads all files/folders inside it to populate the file list.

### Line 30 — Construct Full File Path
```typescript
let path:string=`./data/${it}/${f}`;
```
**Purpose:** Builds the complete path for each file (e.g., `./data/Math/fisier.pdf`) passed to `FishierMaterie` constructor.

---

## Summary Table

| File | Line(s) | Type | Purpose |
|------|---------|------|---------|
| `file-processor.ts` | 21 | Static path | Security whitelist for `sanitizePath()` |
| `file-processor.ts` | 191 | Static path | StudyGroups.json location |
| `studyRoutes.ts` | 26 | Static path | Check existing materials (add) |
| `studyRoutes.ts` | 33 | Dynamic path (`./data/${name}`) | Create material directory |
| `studyRoutes.ts` | 47 | Static path | Check existing materials (delete) |
| `studyRoutes.ts` | 50 | Dynamic path (`./data/${name}`) | Delete material directory |
| `StudyGroup.ts` | 12 | Static path (class property) | Default StudyGroups.json location |
| `StudyGroup.ts` | 24 | Static path | Load all material directories |
| `StudyGroup.ts` | 27 | Dynamic path (`./data/${it}`) | Load files per material |
| `StudyGroup.ts` | 30 | Dynamic path (`./data/${it}/${f}`) | Full file path construction |

---

## Directory Structure Assumed

```
server/
├── data/
│   ├── Material1/          ← Each subdirectory = one material (e.g., "Math")
│   │   └── file.pdf        ← Files within each material
│   ├── Material2/
│   │   └── file.docx
│   └── UserMetadata/
│       └── StudyGroups.json← Metadata persistence file
├── src/
│   ├── services/
│   │   └── file-processor.ts
│   ├── routes/
│   │   └── studyRoutes.ts
│   └── objects/
│       └── StudyGroup.ts