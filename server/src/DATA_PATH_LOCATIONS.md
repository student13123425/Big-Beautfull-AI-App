# `./data/` Path Locations in Backend

This document lists all locations where the hardcoded path `./data/` is defined in the backend codebase.

**Total occurrences: 1 reference across 1 file.**

---

## 1. `server/src/services/file-processor.ts` — 1 reference

### Line 21 — Security Whitelist (Path Sanitization)
```typescript
const allowedDir = path.resolve("./data/");
```
**Purpose:** Used in the `sanitizePath()` function to validate that all file paths are within the `./data/` directory. This is a security measure preventing directory traversal attacks.

---

## Summary Table

| File | Line(s) | Type | Purpose |
|------|---------|------|---------|
| `file-processor.ts` | 21 | Static path | Security whitelist for `sanitizePath()` |

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
```

---

## Notes

The following files previously used hardcoded `./data/` paths but have been updated to use dynamic path functions from `auth.ts`:

- **`studyRoutes.ts`**: Now uses `getUserFolderPath()` for material directory operations (add, delete)
- **`StudyGroup.ts`**: Now uses `getUserFolderPath()` for file operations and `getUserMetaDataSpot()` for the StudyGroups JSON path
- **`file-processor.ts`**: Now uses `getUserMetaDataSpot()` in `get_content_filled_file_list()` to read the StudyGroups metadata file
