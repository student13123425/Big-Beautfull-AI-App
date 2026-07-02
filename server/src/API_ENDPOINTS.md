# Backend API Endpoints

Generated from `server/src/index.ts`

## HTTP Endpoints

### AI Model Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| GET    | `/models`           | `getModels`          | Get available models     |
| GET    | `/models_paths`     | `getModelPaths`      | Get model file paths     |
| GET    | `/ip`               | `getIP`              | Get IP address           |
| GET    | `/models_costum_format` | *(inline)*       | Get models in custom format |

### Configuration Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| GET    | `/config`           | `getConfig`          | Get configuration        |
| GET    | `/configDirect`     | `getConfig`          | Get configuration (direct) |

### Study Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/add_materie`      | `addMaterie`         | Add a subject            |
| POST   | `/delete_materie`   | `deleteMaterie`      | Delete a subject         |
| POST   | `/genereaza_sinteza`| `handleContentGeneration` | Generate content summary |
| POST   | `/regenereaza_sinteza`| `regenereazSinteza`| Regenerate content summary |
| GET    | `/study`            | `getStudy`           | Get study data           |
| GET    | `/studyDirect`      | `getStudy`           | Get study data (direct)  |
| GET    | `/sintezaStyles`    | `getSintezaHtmlPosilbleStyles` | Get HTML styles for summaries |

### Quiz Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/GenerateNewQuiz`  | `generateQuiz`       | Generate a new quiz      |
| POST   | `/ReGenerateNewQuiz`| `regenerateQuiz`     | Regenerate a quiz        |
| POST   | `/DeleteQuiz`       | `deleteQuiz`         | Delete a quiz            |

### Evaluation Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/askFileQuestion`  | `askFileQuestion`    | Ask a question about a file |
| POST   | `/Evaluare`         | `processEvaluare`    | Process evaluation       |
| GET    | `/ClearEvaluare`    | `ClearEvaluare`      | Clear evaluation state   |
| GET    | `/stopAnsweringQuestion` | `stopAnsweringQuestion` | Stop answering question |

### File Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/send_file`        | `sendFile`           | Upload a file            |
| POST   | `/check_existing`   | `checkExisting`      | Check if file exists     |
| POST   | `/get_file`         | `getFile`            | Download a file          |
| POST   | `/delete_file`      | `deleteFile`         | Delete a file            |

### Model Selection Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/select_model`     | `setSelectedModel`   | Set selected model       |
| GET    | `/select_model`     | `getSelectedModel`   | Get selected model       |

### Configuration Update Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/set_language`     | `setLanguage`        | Set language             |
| POST   | `/set_context_size` | `setContextSize`     | Set context size         |
| POST   | `/set_system_prompt`| `setSystemPrompt`    | Set system prompt        |

### HTML Style Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| GET    | `/htmlStyle`        | `getHtmlStyle`       | Get HTML style           |
| POST   | `/htmlStyle`        | `setHtmlStyle`       | Set HTML style           |

### Authentication Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| POST   | `/register`         | `registerEndpoint`   | Register a new user      |
| POST   | `/login`            | `loginEndpoint`      | Login user               |
| GET    | `/guestToken`       | `getGuestToken`      | Get guest token          |

### System Routes

| Method | Endpoint            | Handler              | Description              |
|--------|---------------------|----------------------|--------------------------|
| GET    | `/dependecys`       | `getDependencies`    | Check dependencies       |
| GET    | `/os`               | `getOS`              | Get OS information       |
| GET    | `/get_valid_study_lmstudio` | *(inline)*   | Validate LMStudio connection |

---

## WebSocket Endpoints

| Path         | Type        | Description             |
|--------------|-------------|-------------------------|
| `/study`     | Subscribe   | Study data updates      |
| `/config`    | Subscribe   | Configuration updates   |

---

## Notes

- All routes are prefixed with the server `port` (configured in `.env`)
- File uploads support: `.pdf`, `.docx`, `.txt`, `.md`, `.pptx`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.tiff`
- Maximum file upload size: 200 MB
- CORS is enabled for all origins