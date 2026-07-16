import path from "path";
import { Request, Response } from "express";
import { convertPowerPointToPDF, onFileCreate, sanitizeFilename, sanitizePath } from "../services/file-processor.js";
import { existsSync, statSync, unlinkSync, createReadStream, accessSync, mkdir, mkdtempSync, rm, copyFileSync, renameSync, readdirSync } from "node:fs";
import os from "node:os";

import {config, broadcastStudyData, isMemOverflow, refresh } from '../index.js';
import { mkdirSync, realpath, realpathSync, rmSync } from "node:fs";
import { data_study } from "../services/state.js";
import { getUserFolderPath } from "./auth.js";
import { FishierMaterie, Materie, MaterieImgGroup } from "../objects/subjects.js";

async function withTempDir(fn: Function) {
  const tempBase = realpathSync(os.tmpdir());
  const tempDirPrefix = 'ppt-convert-';
  const dir = mkdtempSync(path.join(tempBase, tempDirPrefix));
  console.log(`Created temporary directory: ${dir}`);
  try {
    return await fn(dir);
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
      console.log(`Cleaned up temporary directory: ${dir}`);
    } catch (cleanupError) {
      console.error(`Error cleaning up temp directory ${dir}:`, cleanupError);
    }
  }
}
export async function sendFile(
  req: Request & { file?: Express.Multer.File },
  res: Response
): Promise<void> {
  let finalServerPath: string | undefined;

  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded." });
      return;
    }
    if (isMemOverflow) {
      res.status(400).json({ success: false, message: "Memory Full" });
      return;
    }

    const userId = req.body.userId as string | undefined;
    const rawPathFromFrontend = req.body.path as string;
    
    let targetDir: string;
    if (userId) {
      const userFolder = getUserFolderPath(userId); 
      let cleanPath = rawPathFromFrontend.replace(/^\.\//, '');
      targetDir = sanitizePath(path.join(userFolder, cleanPath));
    } else {
      const guestUserId = process.env.GUEST_USER_ID;
      if (!guestUserId) {
        res.status(400).json({ success: false, message: "No user ID provided." });
        return;
      }
      const userFolder = getUserFolderPath(guestUserId);
      let cleanPath = rawPathFromFrontend.replace(/^\.\//, '');
      targetDir = sanitizePath(path.join(userFolder, cleanPath));
    }

    const absFileTempPath = path.resolve(req.file.path);
    const sanitizedName = sanitizeFilename(path.basename(req.file.originalname));
    
    const finalDir = targetDir;
    const absFinalDir = path.resolve(finalDir);

    mkdirSync(absFinalDir, { recursive: true });

    const fileExtension = path.extname(sanitizedName).toLowerCase();
    const isPowerPoint = ['.ppt', '.pptx'].includes(fileExtension);

    if (isPowerPoint) {
      await withTempDir(async (tempDir: string) => {
        const tempInputPath = path.join(tempDir, sanitizedName);
        copyFileSync(absFileTempPath, tempInputPath);
        const baseName = path.basename(sanitizedName, fileExtension);
        const outputPdfName = baseName + '.pdf';
        finalServerPath = sanitizePath(path.join(finalDir, outputPdfName));
        const absFinalServerPath = path.resolve(finalServerPath);

        await convertPowerPointToPDF(tempInputPath, absFinalServerPath);
        onFileCreate(absFinalServerPath, () => {
          data_study.load(config);
          broadcastStudyData();
        }, userId);
      });
    } else {
      finalServerPath = sanitizePath(path.join(finalDir, sanitizedName));
      const absFinalServerPath = path.resolve(finalServerPath);
      renameSync(absFileTempPath, absFinalServerPath);
    }

    if (!isPowerPoint) {
      try {
        data_study.load(config);
        broadcastStudyData();
      } catch (reloadErr: any) {
        console.error(reloadErr);
      }
    }

    refresh();
    res.json({ success: true, filePath: finalServerPath, converted: isPowerPoint });
  } catch (error: any) {
    if (finalServerPath && existsSync(finalServerPath)) {
      try { unlinkSync(finalServerPath); }
      catch (unlinkError) {}
    }
    if (req.file && existsSync(req.file.path)) {
      try { unlinkSync(req.file.path); }
      catch (unlinkError) {}
    }
    refresh();
    res.status(500).json({ success: false, message: `File processing failed: ${(error as Error).message}` });
  }
}

export async function checkExisting(req: Request, res: Response): Promise<void> {
  try {
    const { paths, userId }: { paths?: string[]; userId?: string } = req.body;
    if (!paths || !Array.isArray(paths)) {
      console.error('[checkExisting] Invalid request - missing paths');
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    // Use consistent path resolution with getUserFolderPath (same as sendFile)
    const effectiveUserId = userId || process.env.GUEST_USER_ID;
    if (!effectiveUserId) {
      console.error('[checkExisting] No user ID provided');
      res.status(400).json({ error: "No user ID provided" });
      return;
    }

    const userFolder = getUserFolderPath(effectiveUserId);
    
    const sanitizedPaths = paths.map((p) => {
      let cleanPath = p.replace(/^\.\//, '');
      return sanitizePath(path.join(userFolder, cleanPath));
    });

    console.log('[checkExisting] Checking paths:', sanitizedPaths);
    const existingFiles: string[] = [];

    for (const filePath of sanitizedPaths) {
      console.log('[checkExisting] Checking:', filePath, 'exists:', existsSync(filePath));
      if (existsSync(filePath)) {
        existingFiles.push(path.basename(filePath));
      }
    }

    res.status(200).json({ existingFiles });
  } catch (error) {
    console.error('Error checking existing files:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFile(req: Request, res: Response): Promise<void> {
  if (!req.body.path || typeof req.body.path !== 'string') {
    res.status(400).send("Path is required");
    return;
  }

  const userId = req.body.userId as string | undefined;

  try {
    // Prepend user folder to path for multi-user support
    let filePath: string;
    const basePath = userId ? getUserFolderPath(userId) : undefined;
    if (basePath) {
      const pathSegments = req.body.path.split('/').filter(Boolean);
      const firstSegment = pathSegments[0];

      if (firstSegment === 'data' && pathSegments.length >= 2) {
        if (pathSegments[1] === userId) {
          filePath = sanitizePath(req.body.path);
        } else {
          filePath = sanitizePath(path.join(basePath, sanitizePath(req.body.path)));
        }
      } else if (firstSegment === userId) {
        filePath = sanitizePath(req.body.path);
      } else {
        filePath = sanitizePath(path.join(basePath, sanitizePath(req.body.path)));
      }
    } else {
        filePath = sanitizePath(req.body.path);
    }
    if (!existsSync(filePath)) {
      res.status(404).send("File not found");
      return;
    }

    const stats = statSync(filePath);
    if (!stats.isFile()) {
      res.status(400).send("Path is not a file");
      return;
    }

    const fileName = path.basename(filePath);
    const safeFileName = fileName.replace(/[^\\x20-\\x7E]/g, '');
    const encodedName = encodeURIComponent(fileName).replace(/'/g, "%27");
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}; filename="${safeFileName}"`);
    res.setHeader('Content-Length', stats.size.toString());  
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
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
  const { filename }: { filename?: string } = req.body;
  const userId = req.body.userId as string | undefined;
  try {
    if (!filename) {
      res.status(400).send("`filename` is required");
      return;
    }

    const effectiveUserId = userId || process.env.GUEST_USER_ID;
    if (!effectiveUserId) {
      res.status(400).send("No user ID provided");
      return;
    }
    const basePath = getUserFolderPath(effectiveUserId);
    let cleanPath = filename.replace(/^\.\//, '');
    const sanitizedFilename = sanitizePath(path.join(basePath, cleanPath));

    if (!sanitizedFilename || !existsSync(sanitizedFilename)) {
      res.status(404).send("File not found");
      return;
    }

    unlinkSync(sanitizedFilename);
    data_study.process_file_delete(sanitizedFilename);
    res.sendStatus(204);
  } catch (err: any) {
    console.error("Error deleting file:", err);
    res.status(500).send("Internal server error");
  }
}

export async function uploadImgGroup(req: Request, res: Response): Promise<void> {
  const files = req.files as Express.Multer.File[];
  const { title, userId }: { title?: string; userId?: string } = req.body;

  try {
    if (!title || !title.trim()) {
      res.status(400).json({ success: false, message: "Title is required." });
      return;
    }

    const sanitizedTitle = sanitizeFilename(title);
    const basePath = userId ? getUserFolderPath(userId) : undefined;
    const targetDir = basePath ? sanitizePath(path.join(basePath, sanitizedTitle)) : sanitizePath(sanitizedTitle);

    mkdirSync(targetDir, { recursive: true });

    const movedFiles: string[] = [];
    for (const file of files) {
      const sanitizedName = sanitizeFilename(path.basename(file.originalname));
      const finalPath = path.join(targetDir, sanitizedName);
      renameSync(file.path, finalPath);
      movedFiles.push(finalPath);
    }

    data_study.load(config);

    let targetMaterie: Materie | null = null;
    for (const m of data_study.data) {
      const parts = targetDir.split('/');
      if (m.name === parts[parts.length - 2] || m.name === sanitizedTitle) {
        targetMaterie = m;
        break;
      }
    }

    if (!targetMaterie) {
      for (const m of data_study.data) {
        const parts = targetDir.split('/');
        const expectedMaterieName = parts[parts.length - 2];
        if (m.name === expectedMaterieName) {
          targetMaterie = m;
          break;
        }
      }
    }

    if (!targetMaterie) {
      data_study.data.push(new Materie(sanitizedTitle));
      targetMaterie = data_study.data[data_study.data.length - 1];
    }

    let imgGroup = targetMaterie.imgs.find((g) => g.title === sanitizedTitle);
    if (!imgGroup) {
      imgGroup = new MaterieImgGroup(sanitizedTitle);
      targetMaterie.imgs.push(imgGroup);
    }

    for (const filePath of movedFiles) {
      const existingFishier = imgGroup.images.find((f) => f.path === filePath);
      if (!existingFishier) {
        const materieName = path.basename(path.dirname(filePath));
        imgGroup.images.push(
          new FishierMaterie(filePath, materieName, () => data_study.save(), false, config)
        );
      }
    }

    data_study.save();
    broadcastStudyData();
    refresh();

    res.json({ success: true, filePath: targetDir });
  } catch (error) {
    console.error("Error processing image group upload:", error);
    for (const file of files) {
      if (existsSync(file.path)) {
        try { unlinkSync(file.path); } catch (e) {}
      }
    }
    refresh();
    res.status(500).json({ success: false, message: `Image group upload failed: ${(error as Error).message}` });
  }
}
