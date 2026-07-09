import path from "path";
import { Request, Response } from "express";
import { convertPowerPointToPDF, onFileCreate, sanitizeFilename, sanitizePath } from "../services/file-processor.js";
import { existsSync, statSync, unlinkSync, createReadStream, accessSync, mkdir, mkdtempSync, rm, copyFileSync, renameSync } from "fs";
import os from "node:os";

import {config, broadcastStudyData, isMemOverflow, refresh } from '../index.js';
import { mkdirSync, realpath, realpathSync, rmSync } from "node:fs";
import { data_study } from "../services/state.js";
import { getUserFolderPath } from "./auth.js";

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
    const desiredPathRaw = sanitizePath(req.body.path as string);
    if (!desiredPathRaw) {
      res.status(400).json({ success: false, message: "Path is required." });
      return;
    }

    // Prepend user folder to path for multi-user support
    const basePath = userId ? getUserFolderPath(userId) : undefined;
    const desiredPath = basePath ? sanitizePath(path.join(basePath, desiredPathRaw)) : desiredPathRaw;

    const absFileTempPath = path.resolve(req.file.path);
    const sanitizedName = sanitizeFilename(path.basename(req.file.originalname));
    const finalDir = path.dirname(desiredPath);
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
        console.log(`Successfully created PDF at: ${absFinalServerPath}`);
      });
    } else {
      finalServerPath = sanitizePath(path.join(finalDir, sanitizedName));
      const absFinalServerPath = path.resolve(finalServerPath);
      renameSync(absFileTempPath, absFinalServerPath);
    }

    if (!isPowerPoint) {
      data_study.load(config);
      broadcastStudyData();
    }

    refresh();
    res.json({ success: true, filePath: finalServerPath, converted: isPowerPoint });
  } catch (error) {
    console.error("Error processing file:", error);
    if (finalServerPath && existsSync(finalServerPath)) {
      try { unlinkSync(finalServerPath); console.log('Cleaned up partial final file:', finalServerPath); }
      catch (unlinkError) { console.error('Error cleaning up final file:', unlinkError); }
    }
    if (req.file && existsSync(req.file.path)) {
      try { unlinkSync(req.file.path); console.log('Cleaned up uploaded file:', req.file.path); }
      catch (unlinkError) { console.error('Error cleaning up uploaded file:', unlinkError); }
    }
    refresh();
    res.status(500).json({ success: false, message: `File processing failed: ${(error as Error).message}` });
  }
}

export async function checkExisting(req: Request, res: Response): Promise<void> {
  try {
    const { paths, userId }: { paths?: string[]; userId?: string } = req.body;
    if (!paths || !Array.isArray(paths)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    // Prepend user folder to path for multi-user support
    const basePath = userId ? getUserFolderPath(userId) : undefined;

    const sanitizedPaths = paths.map((p) => {
        if (basePath) {
            return sanitizePath(path.join(basePath, sanitizePath(p)));
        }
        return sanitizePath(p);
    });
    const existingFiles: string[] = [];

    for (const filePath of sanitizedPaths) {
      try {
        accessSync(filePath);
        existingFiles.push(path.basename(filePath));
      } catch {}
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

    // Prepend user folder to path for multi-user support
    let sanitizedFilename: string;
    const basePath = userId ? getUserFolderPath(userId) : undefined;
    if (basePath) {
      sanitizedFilename = sanitizePath(path.join(basePath, sanitizePath(path.resolve(filename))));
    } else {
      sanitizedFilename = sanitizePath(path.resolve(filename));
    }

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
