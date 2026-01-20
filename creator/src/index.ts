import { existsSync, mkdirSync, readdir, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { get_compleation } from "./aox.js";
import { join } from "path";
import { log } from "console";

const base_path:string="./data"

type GameGenres = [
  "Action Games",
  "Adventure Games",
  "Role-Playing Games (RPGs)",
  "Simulation Games",
  "Strategy Games",
  "Puzzle Games",
  "Sports Games",
  "Platformers",
  "Open-World Games",
  "Survival Games",
  "Fighting Games",
  "MOBA (Multiplayer Online Battle Arena)",
  "Horror Games",
  "RPG/Action Hybrid (ARPG)",
  "Music/Rhythm Games",
  "Educational/Training Games",
  "All Time Clasic",
  "Experimental/Art Games"
];

function generateDescriptionPrompt(romData: {
  name: string;
  platform: string;
  size: string;
  path: string;
}): string {
  const prompt = `Generate a short, engaging Steam-like description for the retro game "${romData.name}" (Platform: ${romData.platform}, Size: ${romData.size}) based on its file path: "${romData.path}". Include details like gameplay style, nostalgia factor, and historical context. Keep it concise (2-3 sentences).`;
  return prompt;
}

function generateGenreExtractionPrompt(romData: {
  name: string;
  genres: string[];
  platform: string;
  description: string;
  size: string;
  path: string;
}, possibleGenres: string[]): string {
  const genreList = possibleGenres.join(", ");
  const prompt = `Extract relevant game genres from the description of "${romData.name}" (Platform: ${romData.platform}, Size: ${romData.size}) based on this list of possible genres: [${genreList}]. Match only the most accurate ones. Output as a JSON array with no additional text.`;
  return prompt;
}

class Game {
  name: string;
  genres: GameGenres[]; 
  platform: string;
  description: string;
  size: string;
  path:string;
  qulity:number;
  constructor(
    name: string,
    genres: GameGenres[],
    platform: string,
    description: string,
    size: string,
    path:string,
    quality:number
  ) {
    this.name = name;
    this.genres = genres;
    this.platform = platform;
    this.description = description;
    this.size = size;
    this.path=path
    this.qulity=quality
  }
  async generate(depth:number){
    const url="ws://192.168.0.100:1234"
    if(depth>4)
      return
    try{
      const model="lmstudio-community/phi-4-GGUF"
      if(this.description.length==0){
        let prompt=this.generateDescriptionPrompt()
        let description=await get_compleation(prompt,"you are a ai asistent",()=>true,url,model,null,()=>{},()=>{},"")
        if(description==null)
          throw "error generating gescription"
        this.description=description
      }
      if(this.genres.length===0){
        let prompt=this.generateGenreExtractionPrompt()
        let ganras=await get_compleation(prompt,"you are a ai asistent",()=>true,url,model,null,()=>{},()=>{},"")
        if(ganras===null)
          throw "error generating ganras"
        if(ganras.includes('```json'))
          ganras=ganras.replace("```json","").replace("```","")
        this.genres=JSON.parse(ganras)
      }
      if (this.qulity === 0) {
        const qualityPrompt = this.generateQualityEvaluationPrompt();
        const quality = await get_compleation(qualityPrompt, "you are a ai asistent", () => true, url,model, null, () => {}, () => {}, "");
        if (quality !== null) {
          this.qulity = parseFloat(quality);
        }
      }
    }catch(e){
      console.log("erro retrying");
      this.generate(depth+1);
    }
    console.log("generation sucessfull \n"+this.name);
  }
  private generateDescriptionPrompt(): string {
    const { name, platform, size, path } = this;
    return `Generate a short, engaging Steam-like description for the retro game "${name}" (Platform: ${platform}, Size: ${size}) based on its file path: "${path}". Include details like gameplay style, nostalgia factor, and historical context. Keep it concise (2-3 sentences). respond with only the description and no other text`;
  }

  private generateGenreExtractionPrompt(): string {
    const { name, platform, size } = this;
    const genreList = [
      "Action Games",
      "Adventure Games",
      "Role-Playing Games (RPGs)",
      "Simulation Games",
      "Strategy Games",
      "Puzzle Games",
      "Sports Games",
      "Platformers",
      "Open-World Games",
      "Survival Games",
      "Fighting Games",
      "MOBA (Multiplayer Online Battle Arena)",
      "Horror Games",
      "RPG/Action Hybrid (ARPG)",
      "Music/Rhythm Games",
      "Educational/Training Games",
      "All Time Clasic",
      "Experimental/Art Games"
    ];
    return `Extract relevant game genres from the description of "${name}" (Platform: ${platform}, Size: ${size}) based on this list of possible genres: [${genreList}]. Match only the most accurate ones.description ${this.description} Output as a JSON array with no additional text markdown or content. `;
  }
  private generateQualityEvaluationPrompt(): string {
    const { name, platform, size } = this;
    return `Evaluate the retro game "${name}" (Platform: ${platform}, Size: ${size}) based on its reputation, historical significance, critical reception, and player feedback. Assign a quality rating from 1 to 5 considering how well-regarded, well-known, and overall quality it is. Avoid bias - if the description is vague or lacks context, assign a moderate score (2-3). Output only the numerical value as a float (e.g., 4.7) with no additional text.`;
  }
    static fromJson(data: any): Game {
    return new Game(
      data.name,
      data.genres || [],
      data.platform,
      data.description,
      data.size,
      data.path,
      data.qulity===undefined?0:data.qulity
    );
  }
}

function getFilesInDirectory(directoryPath: string) {
  const entries = readdirSync(directoryPath, { withFileTypes: true });
  
  return entries
    .filter(entry => 
      entry.isFile()
    )
    .map(entry => join(directoryPath, entry.name));
}
function getSubFolders(directoryPath: string): string[] {
  const entries = readdirSync(directoryPath, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

function formatFileSize(bytes: number): string {
  const kilobyte = 1024;
  const megabyte = kilobyte * kilobyte;

  if (bytes < kilobyte) {
    return `${bytes}B`;
  } else if (bytes < megabyte) {
    const kb = bytes / kilobyte;
    return Number.isInteger(kb) ? `${kb}KB` : `${kb.toFixed(1)}KB`;
  } else {
    const mb = bytes / megabyte;
    return Number.isInteger(mb) ? `${mb}MB` : `${mb.toFixed(1)}MB`;
  }
}

/**
 * Gets the file size from a relative or absolute path and formats it.
 */
function formatFileSizeFromPath(filePath: string): string {
  try {
    const stats = statSync(filePath);
    return formatFileSize(stats.size);
  } catch (err) {
    throw new Error(`Failed to get file size for "${filePath}": ${err.message}`);
  }
}

// function parseGames():Game[] {
//   const platforms = getSubFolders(base_path);
//   let out:Game[]=[]
//   for (const platform of platforms) {
//     const romsDir = join(base_path, platform, "roms");
//     console.log(`Processing ${platform}...`);
//     console.log("Roms directory:", romsDir);
//     const games = getFilesInDirectory(romsDir);
//     for(let game of games){
//       out.push(new Game(game.split("\\")[game.split("\\").length-1],[],platform,"",formatFileSizeFromPath(game),game))
//     }
//     console.log("Found games:", games);
//   }
//   return out
// }
function saveObjectToJson(obj: any, filePath: string): void {
  try {
    // Ensure directory exists
    const dirPath = filePath.split('/').slice(0, -1).join('/');
    if (dirPath && !existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    // Write the JSON file
    const jsonData = JSON.stringify(obj, null, 2); // Pretty print with indentation
    writeFileSync(filePath, jsonData);

    console.log(`✅ File saved successfully at "${filePath}"`);
  } catch (error) {
    throw new Error(`❌ Failed to save JSON file: ${error.message}`);
  }
}

function loadJsonFromFile(filePath: string): any {
  try {
    // Check if the file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found at "${filePath}"`);
    }

    // Read and parse the file
    const data = readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data);
    console.log(`✅ File loaded successfully from "${filePath}"`);
    return parsedData;
  } catch (error) {
    throw new Error(`❌ Failed to load JSON file: ${error.message}`);
  }
}
async function generate_all() {
  const data = loadJsonFromFile("./games.json");
  const games: Game[] = data.map((gameData: any) => Game.fromJson(gameData));
  let count=0
  for (let it of games) {
    await it.generate(0);
    count+=1;
    console.log(`progess ${count} of ${games.length}`);
    saveObjectToJson(games, "./games.json");
  }
}

function parseGames(): Game[] {
  const platforms = getSubFolders(base_path);
  let out: Game[] = [];
  
  for (const platform of platforms) {
    const romsDir = join(base_path, platform, "roms");
    const games = getFilesInDirectory(romsDir);

    for (let game of games) {
      out.push(
        new Game(
          game.split("\\")[game.split("\\").length - 1],
          [],
          platform,
          "",
          formatFileSizeFromPath(game),
          game,
          0
        )
      );
    }
  }

  return out;
}


generate_all()