import path from "path";
import { Request, Response } from "express";
import { convertPowerPointToPDF, onFileCreate, sanitizeFilename, sanitizePath } from "../services/file-processor.js";
import { existsSync, statSync, unlinkSync, createReadStream, accessSync, mkdir, mkdtempSync, rm, copyFileSync, renameSync } from "fs";
import os from "node:os";

import {config, broadcastStudyData, isMemOverflow, refresh } from '../index.js';
import { mkdirSync, realpath, realpathSync, rmSync } from "node:fs";
import { data_study } from "../services/state.js";

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

    const desiredPath = sanitizePath(req.body.path as string);
    if (!desiredPath) {
      res.status(400).json({ success: false, message: "Path is required." });
      return;
    }

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
        });
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
    const { paths }: { paths?: string[] } = req.body;
    if (!paths || !Array.isArray(paths)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const sanitizedPaths = paths.map((it) => sanitizePath(it));
    const existingFiles: string[] = [];

    for (const filePath of sanitizedPaths) {
      try {
        accessSync(filePath);
        existingFiles.push(path.basename(filePath));
      } catch { /* ignore non-existent */ }
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

  try {
    const filePath = sanitizePath(req.body.path);
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
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
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
  try {
    if (!filename) {
      res.status(400).send("`filename` is required");
      return;
    }

    let sanitizedFilename = sanitizePath(path.resolve(filename));
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
