import express from 'express';
import multer from "multer";
import os from 'node:os';
import { createReadStream, existsSync, promises as fs, statSync, unlinkSync } from 'fs';
import { LMStudioClient, ModelInfo } from '@lmstudio/sdk';
import findDevices from 'local-devices';
import {AiModel, AiServerError, AiTextCorectionElement, Config, Quiz, QuiZRequestItem, StudyGroup} from "./objects.js"
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import WebSocket, { WebSocketServer } from 'ws';
import { convertPowerPointToPDF, get_file_name, getDirectoryContent, onFileCreate, sanitizeFilename, sanitizePath } from './services/file-processor.js';
import { getSupportedLanguages } from './services/ocr.js';
import { check_evaluation_parameters, compareConfigs, compareStudyGroup, isValidQuizItem } from './services/data_validation.js';
import { checkDependencies, evaluateCodeComplexity, evaluateDataSize, getServerOS, isFolderSizeBiggerThan } from './services/environment.js';
import { addMaterie, deleteMaterie, genereazSinteza, getStudy, regenereazSinteza } from './routes/studyRoutes.js';
import { askFileQuestion, ClearEvaluare, DeactivateErrorMessage, processEvaluare, stopAnsweringQuestion } from './routes/evaluationRoutes.js';
import { deleteQuiz, generateQuiz, regenerateQuiz } from './routes/quizRoutes.js';
import { checkExisting, deleteFile, getFile, sendFile } from './routes/fileRoutes.js';
import { getConfig, getDependencies, getOS, setContextSize, setLanguage, setSystemPrompt } from './routes/configRoutes.js';
import { getIP, getModelPaths, getModels, getSelectedModel, setSelectedModel } from './routes/aiRoutes.js';
import { allowedExtensions, configClients, data_study, deniedExtensions, lastConfigData, lastStudyData, port, setLastConfigData, setLastStudyData, studyClients, v_interval } from './services/state.js';


process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
export let config = new Config();
config.load();
export let ai_models_available: ModelInfo[] = [];
export let device_ip: string | null = null;
const TEMP_UPLOAD_DIR = path.join(__dirname, 'temp_uploads');
const max_size:number=20;
export let isMemOverflow = false;
export let is_dependecy:boolean[]=[]
checkDependencies().then((e)=>{
  is_dependecy=e;
})
export function broadcastStudyData() {
  const currentData = data_study;
  
  if (!compareStudyGroup(lastStudyData, currentData)) {
    setLastStudyData(JSON.parse(JSON.stringify(currentData)))
    
    const message = JSON.stringify({
      type: 'study_update',
      data: currentData
    });
    
    studyClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export function broadcastConfigData() {
  const currentData = config;
  
  if (!compareConfigs(lastConfigData, currentData)) {
    setLastConfigData(JSON.parse(JSON.stringify(currentData)));
    
    const message = JSON.stringify({
      type: 'config_update',
      data: currentData
    });
    
    configClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

setInterval(() => {
  broadcastStudyData();
  broadcastConfigData();
}, 0);

export async function refresh() {
  try {
    isMemOverflow = await isFolderSizeBiggerThan(max_size);
  } catch {
    isMemOverflow = false;
  }
}

refresh();
setInterval(refresh, 0);
if (!existsSync(TEMP_UPLOAD_DIR)) {
    fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });
}

const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: tempStorage ,limits:{fileSize:200 * 1024 * 1024},fileFilter:(req,file,cb)=>{
   const ext = path.extname(file.originalname).toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      return cb(null, false);
    }

    if (deniedExtensions.includes(ext)) {
      return cb(null, false);
    }

    cb(null, true);
}});
getLmStudioDevice().then((it)=>{
  device_ip=it
})
export async function getLmStudioDevice(): Promise<string|null> {
  const targetIp = "127.0.0.1"; 
  const address = `ws://${targetIp}:1234`;

  try {
    console.log(`Attempting to connect to LM Studio at ${address}...`);
    
    const client = new LMStudioClient({ baseUrl: address });
    
    const models = await withTimeout(
      client.system.listDownloadedModels(),
      2000, 
      'Request timed out'
    );

    ai_models_available = models;
    device_ip = address;
    
    console.log(`Successfully connected to LM Studio at ${address}`);
    return address;
  } catch (err) {
    console.error("LM Studio discovery failed:", err);
    return null;
  }
}
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), ms)
  );
  return Promise.race([promise, timeout]);
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/models', async (req, res) => {
  getModels(req,res);
});

app.get('/models_paths', async (req, res) => {
  getModelPaths(req,res);
});

app.get('/ip', async (req, res) => {
  getIP(req,res);
});

app.get('/config', async (req, res) => {
  getConfig(req,res);
});

app.get("/configDirect", (req, res) => {
  getConfig(req,res);
});

app.post("/add_materie", async (req, res) => {
  addMaterie(req,res);
});

app.get("/dependecys", async (req, res) => {
  getDependencies(req,res);
})

app.get("/os", async (req, res) => {
  getOS(req,res);
})

app.post("/delete_materie", async (req, res) => {
  deleteMaterie(req,res);
});

app.post("/genereaza_sinteza", async (req, res) => {
  genereazSinteza(req,res);
});

app.post("/regenereaza_sinteza", async (req, res) => {
  regenereazSinteza(req,res);
});

app.post("/send_file", upload.single('file'), async (req, res) => {
  sendFile(req,res);
});

app.post("/check_existing", async (req, res) => {
  checkExisting(req,res);
});

app.post("/select_model",async (req, res) => {
  setSelectedModel(req,res);
})

app.get("/select_model",async (req, res) => {
  getSelectedModel(req,res);
})

app.post("/set_language", async (req, res) => {
  setLanguage(req,res);
});

app.post("/set_context_size", async (req, res) => {
  setContextSize(req,res);
});

app.post("/set_system_prompt", async (req, res) => {
  setSystemPrompt(req,res);
});

app.post("/get_file", async (req, res) => {
  getFile(req,res);
});

app.post("/delete_file", (req, res) => {
  deleteFile(req,res);
});

app.post("/askFileQuestion", async (req, res) => {
  askFileQuestion(req,res);
});

app.post("/GenerateNewQuiz", async (req, res) => {
  generateQuiz(req,res);
});

app.post("/ReGenerateNewQuiz", async (req, res) => {
  regenerateQuiz(req,res);
});

app.post("/DeleteQuiz", async (req, res) => {
  deleteQuiz(req,res);
});

app.post("/DeactivateErrorMessage", async (req, res) => {
  DeactivateErrorMessage(req,res);
});


app.post("/Evaluare", async (req, res) => {
  processEvaluare(req,res);
});


app.get("/ClearEvaluare", async (req, res) => {
  ClearEvaluare(req,res);
});

app.get('/stopAnsweringQuestion', async (req, res) => {
  stopAnsweringQuestion(req,res);
});

app.get("/models_costum_format", async (req, res) => {
  let output: AiModel[] = ai_models_available.map((it) => {
    return new AiModel(
      it.path,
      it.displayName,
      it.paramsString ? it.paramsString : "unknown",
      it.maxContextLength,
      -1
    );
  });
  res.json(output);
});

app.get("/study", (req, res) => {
  getStudy(req,res);
});

app.get("/studyDirect", (req, res) => {
  getStudy(req,res);
});

app.get('/get_valid_study_lmstudio', async (req, res) => {
  device_ip = await getLmStudioDevice();
  if (!device_ip) res.send("no server running lmstudio was found on local network");
  res.send("all valid");
});

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeMs = diff[0] * 1e3 + diff[1] / 1e6;

    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ` +
      `${res.statusCode} - ${timeMs.toFixed(2)} ms`
    );
  });

  next();
});

// Create HTTP server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});
server.on('error', (err) => {
  console.error('Server listen error:', err);
});
// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;
  
  if (pathname === '/study') {
    studyClients.add(ws);
    
    // Send initial data immediately
    ws.send(JSON.stringify({
      type: 'study_update',
      data: data_study
    }));
    
    ws.on('close', () => {
      studyClients.delete(ws);
    });
    
  } else if (pathname === '/config') {
    configClients.add(ws);
    
    // Send initial data immediately
    ws.send(JSON.stringify({
      type: 'config_update',
      data: config
    }));
    
    ws.on('close', () => {
      configClients.delete(ws);
    });
  } else {
    ws.close();
  }
});

// Handle HTTP server upgrades for WebSockets
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

evaluateCodeComplexity();
evaluateDataSize();
