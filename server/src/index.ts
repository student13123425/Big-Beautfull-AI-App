import express from 'express';
import multer from "multer";
import os from 'node:os';
import { createReadStream, existsSync, promises as fs, statSync, unlinkSync } from 'fs';
import { LMStudioClient, ModelInfo } from '@lmstudio/sdk';
import findDevices from 'local-devices';
import {AiModel, AiServerError, AiTextCorectionElement, Config, Quiz, QuiZRequestItem, StudyGroup} from "./objects.js"
import { check_dependecys, compareConfigs, compareStudyGroup, convertPowerPointToPDF, evaluate_code_complexity, evaluateDataSize, extractTextFromImage, get_file_name, getDirectoryContent, getServerOS, getSupportedLanguages, isFolderSizeBiggerThan, isValidQuizItem, onFileCreate, sanitizeFilename, sanitizePath, testConversion} from './aox.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import WebSocket, { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
let config = new Config();
config.load();
let ai_models_available: ModelInfo[] = [];
let device_ip: string | null = null;
const TEMP_UPLOAD_DIR = path.join(__dirname, 'temp_uploads');
const max_size:number=20;
let isMemOverflow = false;
let is_dependecy:boolean[]=[]
check_dependecys().then((e)=>{
  is_dependecy=e;
})
// WebSocket setup
const studyClients = new Set();
const configClients = new Set();
let lastStudyData = null;
let lastConfigData = null;

// Broadcast study data to all connected clients
function broadcastStudyData() {
  const currentData = data_study;
  
  if (!compareStudyGroup(lastStudyData, currentData)) {
    lastStudyData = JSON.parse(JSON.stringify(currentData));
    
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

// Broadcast config data to all connected clients
function broadcastConfigData() {
  const currentData = config;
  
  if (!compareConfigs(lastConfigData, currentData)) {
    lastConfigData = JSON.parse(JSON.stringify(currentData));
    
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

async function refresh() {
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

const allowedExtensions = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv', 
  '.ods', '.odt', '.rtf', '.ppt', '.pptx',
  '.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'
];
const deniedExtensions = [
  '.exe', '.dll', '.bat', '.com', '.cmd', '.lnk', '.vbs', 
  '.msi', '.scr', '.py', '.js', '.sh', '.jar','.js','.ts','.jsx','.tsx'
];
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
async function getLmStudioDevice(): Promise<string|null> {
  try {
    const devices = await getDevices();
    const ips = [...devices.map(d => d.ip), "localhost", "127.0.0.1"];

    for (const ip of ips) {
      const address = `ws://${ip}:1234`;
      try {
        const client = new LMStudioClient({ baseUrl: address });
        const models = await withTimeout(
          client.system.listDownloadedModels(),
          2000,
          'Request timed out'
        );
        
        ai_models_available = models;
        device_ip = address;
        return address;
      } catch (e) {
        console.debug(`No LM Studio at ${ip}:`, (e as Error).message);
      }
    }
    throw new Error('LM Studio server not found');
  } catch (err) {
    console.error("LM Studio discovery failed:", err);
    return null;
  }
}

async function getDevices(): Promise<any[]> {
  return findDevices();
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

const data_study: StudyGroup = new StudyGroup();
data_study.load(config);
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.get('/models', async (req, res) => {
  try {
    if (ai_models_available.length === 0) {
      device_ip = await getLmStudioDevice();
    }
    res.json(ai_models_available);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/models_paths', async (req, res) => {
  try {
    if (ai_models_available.length === 0) {
      device_ip = await getLmStudioDevice();
    }
    res.json(ai_models_available.map((it) => it.path));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/ip', async (req, res) => {
  if (device_ip === null) {
    try {
      device_ip = await getLmStudioDevice();
    } catch (err) {
      console.error("Error during LM Studio discovery in /ip:", err);
    }
  }
  res.json(device_ip);
});

app.get('/config', async (req, res) => {
  res.json({
    message: 'Use WebSocket connection for real-time config data updates',
    endpoint: 'ws://localhost:3000/config'
  });
});

app.get("/configDirect", (req, res) => {
  res.json(config);
});

app.post("/add_materie", async (req, res) => {
  if (!req.body.name) {
    res.send("n");
    return;
  }
  const name: string = req.body.name;
  const list: string[] = getDirectoryContent("./data/");
  if (list.map((it) => it.toLowerCase()).includes(name.toLowerCase())) {
    let front_end_error_message=new AiServerError(`materia deja exista`,`materia ${name.toLowerCase()} deja exista in system`,true);
    data_study.AiServerError.push(front_end_error_message);
    res.send("n");
  } else {
    await fs.mkdir(`./data/${name}`, { recursive: true });
    data_study.load(config);
    broadcastStudyData();
    res.send("y");
  }
});

const server_os:string= getServerOS()

app.get("/dependecys", async (req, res) => {
  res.json(is_dependecy)
})

app.get("/os", async (req, res) => {
  res.json([server_os])
})

app.post("/delete_materie", async (req, res) => {
  if (!req.body.name) {
    res.send("n");
    return;
  }
  const name: string = req.body.name;
  const list: string[] = getDirectoryContent("./data/");
  if (list.map((it) => it.toLowerCase()).includes(name.toLowerCase())) {
    await fs.rm(`./data/${name}`, { recursive: true, force: true });
    data_study.load(config);
    broadcastStudyData();
    res.send("y");
  } else {
    let front_end_error_message=new AiServerError(`materia nu exista`,`materia ${name.toLowerCase()} nu exista in system`,true);
    data_study.AiServerError.push(front_end_error_message);
    res.send("n");
  }
});

app.post("/genereaza_sinteza", async (req, res) => {
  if (!req.body.name_materie || !req.body.file_name) {
    res.send("n");
    return;
  }
  const name_materie: string = req.body.name_materie;
  const file_name: string = req.body.file_name;
  for (let it of data_study.data) {
    if (it.name === name_materie) {
      for (let j of it.files) {
        let name: string = get_file_name(j.path);
        if (name === file_name) {
          j.genereaza_sinteza(ai_models_available, device_ip, () => {
            data_study.save();
            broadcastStudyData();
          }, config,
          (error:AiServerError)=>{
            j.is_computing=false;
            j.sinteza=null;
            data_study.AiServerError.push(error);
            broadcastStudyData();
          }
          ).then(()=>{
            data_study.save();
            broadcastStudyData();
          });
          res.send("y");
          return;
        }
      }
    }
  }
  const error:AiServerError=new AiServerError(`parametri invalizi sinteza`,`errorare generare sinteza datele name_materie:${name_materie} file_name:${file_name} sunt invalide`)
  data_study.AiServerError.push(error);
  broadcastStudyData();
  res.send("n");
});

app.post("/regenereaza_sinteza", async (req, res) => {
  if (!req.body.name_materie || !req.body.file_name) {
    res.send("n");
    return;
  }
  const name_materie: string = req.body.name_materie;
  const file_name: string = req.body.file_name;
  
  for (let it of data_study.data) {
    if (it.name === name_materie) {
      for (let j of it.files) {
        let name: string = get_file_name(j.path);
        if (name === file_name) {
          j.regenerate_sinteza(ai_models_available, device_ip, () => {
            data_study.save();
            broadcastStudyData();
          }, config,
          (error:AiServerError)=>{
            j.is_computing=false;
            j.sinteza=null
            data_study.AiServerError.push(error);
            broadcastStudyData();
          }
          ).then(()=>{
            data_study.save();
            broadcastStudyData();
          });
          res.send("y");
          return;
        }
      }
    }
  }
  const error:AiServerError=new AiServerError(`parametri invalizi sinteza`,`errorare generare sinteza datele name_materie:${name_materie} file_name:${file_name} sunt invalide`)
  data_study.AiServerError.push(error);
  broadcastStudyData();
  res.send("n");
});

const withTempDir = async (fn) => {
  const tempBase = await fs.realpath(os.tmpdir());
  const tempDirPrefix = 'ppt-convert-';
  const dir = await fs.mkdtemp(path.join(tempBase, tempDirPrefix));
  
  console.log(`Created temporary directory: ${dir}`);
  
  try {
    return await fn(dir);
  } finally {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      console.log(`Cleaned up temporary directory: ${dir}`);
    } catch (cleanupError) {
      console.error(`Error cleaning up temp directory ${dir}:`, cleanupError);
    }
  }
};

app.post("/send_file", upload.single('file'), async (req, res) => {
  let finalServerPath;
  try {
    if (!req.file) 
      return res.status(400).json({ success: false, message: "No file uploaded." });
    if(isMemOverflow)
      return res.status(400).json({ success: false, message: "Memory Full" });
    const desiredPath = sanitizePath(req.body.path);
    if (!desiredPath) 
      return res.status(400).json({ success: false, message: "Path is required." });
    const absUploadsPath = path.resolve('uploads');
    const absFileTempPath = path.resolve(req.file.path);
    const sanitizedName = sanitizeFilename(path.basename(req.file.originalname));
    const finalDir = path.dirname(desiredPath);
    const absFinalDir = path.resolve(finalDir);
    await fs.mkdir(absFinalDir, { recursive: true });
    const fileExtension = path.extname(sanitizedName).toLowerCase();
    const isPowerPoint = ['.ppt', '.pptx'].includes(fileExtension);
    if (isPowerPoint) {
      await withTempDir(async (tempDir) => {
        const tempInputPath = path.join(tempDir, sanitizedName);
        
        await fs.copyFile(absFileTempPath, tempInputPath);
        
        const baseName = path.basename(sanitizedName, fileExtension);
        const outputPdfName = baseName + '.pdf';
        finalServerPath = sanitizePath(path.join(finalDir, outputPdfName));
        const absFinalServerPath = path.resolve(finalServerPath);
        
        await convertPowerPointToPDF(tempInputPath, absFinalServerPath);
        onFileCreate(absFinalServerPath,()=>{
          data_study.load(config);
          broadcastStudyData();
        })
        console.log(`Successfully created PDF at: ${absFinalServerPath}`);
      });
    } else {
      finalServerPath = sanitizePath(path.join(finalDir, sanitizedName));
      const absFinalServerPath = path.resolve(finalServerPath);
      await fs.rename(absFileTempPath, absFinalServerPath);
    }
    if(!isPowerPoint) {
      data_study.load(config);
      broadcastStudyData();
    }
    refresh()
    res.json({
      success: true,
      filePath: finalServerPath,
      converted: isPowerPoint
    });

  } catch (error) {
    console.error("Error processing file:", error);
    
    if (finalServerPath && existsSync(finalServerPath)) {
      try {
        unlinkSync(finalServerPath);
        console.log('Cleaned up partial final file:', finalServerPath);
      } catch (unlinkError) {
        console.error('Error cleaning up final file:', unlinkError);
      }
    }
    if (req.file && existsSync(req.file.path)) {
      try {
        unlinkSync(req.file.path);
        console.log('Cleaned up uploaded file:', req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up uploaded file:', unlinkError);
      }
    }
    refresh()
    res.status(500).json({
      success: false,
      message: `File processing failed: ${error.message}`
    });
  }
});

app.post("/check_existing", async (req, res) => {
  try {
    let { paths } = req.body;
    if (!paths || !Array.isArray(paths)) {
      return res.status(400).json({ error: "Invalid request" });
    }
    paths=paths.map((it)=>sanitizePath(it))
    const existingFiles = [];
    for (const filePath of paths) {
      try {
        await fs.access(filePath);
        existingFiles.push(path.basename(filePath));
      } catch (err) {
        
      }
    }

    res.status(200).json({ existingFiles });
  } catch (error) {
    console.error('Error checking existing files:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const supported_models:string[]=["lmstudio-community/Qwen3-30B-A3B-GGUF/Qwen3-30B-A3B-Q3_K_L.gguf","openai/gpt-oss-20b","lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q3_K_L.gguf"]

app.post("/select_model",async (req, res) => {
  if (!req.body.name) 
    return res.status(400).send("name");
  const name_string:string=req.body.name;
  if(supported_models.includes(name_string)){
    config.set_model(name_string);
    broadcastConfigData();
    res.send("y");
  }else{
    console.log("invalid model select");
    res.send('n')
  }
})

app.get("/select_model",async (req, res) => {
  res.json(supported_models);
})

app.post("/set_language", async (req, res) => {
  if(!req.body.lang)
    return res.status(400).send("name");
  const lang = req.body.lang; 
  if (!lang)             
    return res.status(400).send("language");
  const supportedLangs = getSupportedLanguages(); 
  if (!supportedLangs.includes(lang)) {
    console.log(`invalid language selected: ${lang}`);
    return res.send('n');
  }
  config.set_language(lang);
  broadcastConfigData();
  return res.send("y");
});

app.post("/set_context_size", async (req, res) => {
  if(!req.body.size||typeof req.body.size!=="number")
    return res.status(400).send("name");
  const size:number = req.body.size; 
  config.set_contentx_size(size);
  broadcastConfigData();
  return res.send("y");
});

app.post("/set_system_prompt", async (req, res) => {
  if(!req.body.prompt)
    return res.status(400).send("name");
  const prompt = req.body.prompt; 
  if (!prompt)             
    return res.status(400).send("prompt");
  config.setSystemPrompt(prompt);
  broadcastConfigData();
  return res.send("y");
});

app.post("/get_file", async (req, res) => {
  if (!req.body.path) {
    return res.status(400).send("Path is required");
  }
  
  try {
    const filePath = sanitizePath(req.body.path);
    if (!existsSync(filePath)) {
      return res.status(404).send("File not found");
    }
    
    const stats = statSync(filePath);
    if (!stats.isFile()) {
      return res.status(400).send("Path is not a file");
    }
    
    const fileName = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = createReadStream(filePath);
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) res.status(500).send("Error reading file");
    });
    
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    if (!res.headersSent) res.status(500).send("Internal server error");
  }
});

app.post("/delete_file", (req, res) => {
  let { filename } = req.body;
  try {
    filename=sanitizePath(path.resolve(filename))
    if (!filename) return res.status(400).send("`filename` is required");
    if (!existsSync(filename)) {
      return res.status(404).send("File not found");
    }
    unlinkSync(filename);
    data_study.process_file_delete(filename);
    broadcastStudyData();
    res.sendStatus(204);
  } catch (err: any) {
    console.error("Error deleting file:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/askFileQuestion", async (req, res) => {
  const { quality, question, materie, file } = req.body;
  if (quality === undefined || !question || !materie || !file) {
    res.send("n");
    return;
  }
  let sinteza: string | null = null;
  for (let m of data_study.data) {
    if (m.name.toLowerCase() === materie.toLowerCase()) {
      for (let f of m.files) {
        if (get_file_name(f.path) === get_file_name(file)) {
          sinteza = f.sinteza;
          break;
        }
      }
    }
  }
  
  if (!sinteza) {
    const front_end_error_message=new AiServerError("sinteza negenerata",`sinteza pt acest fishier ${get_file_name(file)} nu este generata`)
    data_study.AiServerError.push(front_end_error_message);
    broadcastStudyData();
    res.send("n");
    return;
  }
  
  if (!device_ip) {
    device_ip = await getLmStudioDevice();
    if (!device_ip) {
      const front_end_error_message=new AiServerError("lmstudio not found",`no lmstudio instance found on the local network`)
      data_study.AiServerError.push(front_end_error_message);
      broadcastStudyData();
      res.send('n');
      return;
    }
  }
  
  data_study.CurrentAskedQuestion.askQuestion(
    ai_models_available,
    device_ip,
    materie,
    sinteza,
    question,
    quality,
    config,
    (e:AiServerError)=>{
      data_study.AiServerError.push(e);
      broadcastStudyData();
    }
  );
  res.send("y");
});

app.post("/GenerateNewQuiz", async (req, res) => {
  if (!req.body.data || typeof req.body.data !== "object") {
    res.send("n");
    return;
  }
  
  const data: QuiZRequestItem = req.body.data;
  let it = data_study.data.find((it) => it.name === data.materie_name);
  if (it && isValidQuizItem(data, it.quizs, it.files)) {
    let nou = new Quiz();
    nou.title = data.title;
    nou.is_grila=data.is_grile
    it.quizs.push(nou);
    
    const materie: string[] = it.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.sinteza || "");
      
    const file_names: string[] = it.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.path);
    
    it.quizs[it.quizs.length - 1].genereate(
      data.nr_intrebari_pe_materie,
      materie,
      file_names,
      data.is_grile,
      ai_models_available,
      device_ip || "",
      () => {},
      config,
      (error:AiServerError)=>{
        data_study.AiServerError.push(error);
        broadcastStudyData();
      }
    ).then(()=>{
      data_study.save();
      broadcastStudyData();
    });
    data_study.save();
    broadcastStudyData();
    res.send("y");
  } else {
    res.send("n");
  }
});

app.post("/ReGenerateNewQuiz", async (req, res) => {
  if (!req.body.data || typeof req.body.data !== "object") {
    res.send("n");
    return;
  }
  const data: QuiZRequestItem = req.body.data;
  console.log(data);
  if(typeof data.materie_name=='string'&&typeof data.title=='string'){
    let materie=data_study.data.find((it) => it.name === data.materie_name);
    if(materie==null){
      res.send('n')
      return;
    }
      
    const m: string[] = materie.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.sinteza || "");
      
    const file_names: string[] = materie.files
      .filter((f) => data.file_nume.includes(f.path) && f.sinteza)
      .map((f) => f.path);
    
    let quiz=materie.quizs.find((it)=>it.title==data.title);
    if(quiz){
        quiz.regenerate(
        data.nr_intrebari_pe_materie,
        m,
        file_names,
        data.is_grile,
        ai_models_available,
        device_ip || "",
        () => {},
        config,
        (error:AiServerError)=>{
          data_study.AiServerError.push(error);
          broadcastStudyData();
        }
      ).then(()=>{
        data_study.save();
        broadcastStudyData();
      });
    }else{
      res.send('n')
      return;
    }
  }
});

app.post("/DeleteQuiz", async (req, res) => {
  const { title, materie } = req.body;
  if (typeof title !== "string" || typeof materie !== "string") {
    res.send("n");
    return;
  }
  
  for (let it of data_study.data) {
    if (it.name === materie) {
      it.quizs = it.quizs.filter((q) => q.title.toLowerCase() !== title.toLowerCase());
      data_study.save();
      broadcastStudyData();
      res.send("y");
      return;
    }
  }
  res.send("n");
});

app.post("/DeactivateErrorMessage", async (req, res) => {
  const { index } = req.body;
  console.log("index:"+index);
  if (typeof index!=="number") {
    res.send("n");
    return;
  }
  
  try{
    data_study.AiServerError=data_study.AiServerError.filter((it,i)=>i!==index);
    console.log(data_study.AiServerError[index]);
    broadcastStudyData();
  }catch(e){
    res.send(`n`);
  }
  res.send("y");
});

import { check_evaluation_parameters} from "./aox.js"

app.post("/Evaluare", async (req, res) => {
  const { quiz, raspunsuri } = req.body;
  
  if (!check_evaluation_parameters(quiz, raspunsuri, true) || device_ip === null) {
    console.log("invalid parameters");
    return res.send("n");
  }
  
  console.log("valid parameters");
  
  try {
    if (data_study.AiTextCorrection.get_is_computiong()) {
      console.log("is pre computing");
      return res.send("y");
    }
    
    data_study.AiTextCorrection = new AiTextCorectionElement(quiz, raspunsuri);
    
    await data_study.AiTextCorrection.evaluare_all(
      "nespecificat", 
      config.limba,
      (error: AiServerError) => {
        data_study.AiServerError.push(error);
        broadcastStudyData();
      }, 
      config, 
      device_ip
    );
    
    console.log("evaluation call successful");
    return res.send("y");
    
  } catch (e) {
    console.log(e);
    return res.send("n");
  }
});

let v_interval:any=null;

app.get("/ClearEvaluare", async (req, res) => {
  if(data_study.AiTextCorrection.get_is_computiong()&&v_interval===null){
    v_interval=setInterval(()=>{
      if(!data_study.AiTextCorrection.get_is_computiong()){
        data_study.AiTextCorrection=new AiTextCorectionElement(null,[]);
        clearInterval(v_interval);
        v_interval=null;
        broadcastStudyData();
      }
    },1000)
    res.send("n");
  }else{
    data_study.AiTextCorrection=new AiTextCorectionElement(null,[]);
    broadcastStudyData();
    res.send('y');
  }
});

app.get('/stopAnsweringQuestion', async (req, res) => {
  data_study.CurrentAskedQuestion.stop();
  res.send("y");
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
  res.json({
    message: 'Use WebSocket connection for real-time study data updates',
    endpoint: 'ws://localhost:3000/study'
  });
});

app.get("/studyDirect", (req, res) => {
  res.json(data_study);
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

evaluate_code_complexity();
evaluateDataSize();
getLmStudioDevice().catch(console.error);