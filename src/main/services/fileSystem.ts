// ============================================================
// File System Service
// Handles all file system operations for the main process
// ============================================================

import { dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import type { FileDialogOptions, FileDialogResult, SaveDialogResult, FileMetadata } from '../../shared/types';

/**
 * Opens a native file dialog and returns selected file metadata
 */
export async function openFileDialog(options?: FileDialogOptions): Promise<FileDialogResult> {
  const win = BrowserWindow.getFocusedWindow();

  const result = await dialog.showOpenDialog(win!, {
    title: options?.title ?? 'Open File',
    defaultPath: options?.defaultPath,
    filters: options?.filters ?? [
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: [
      'openFile',
      ...(options?.multiSelections ? ['multiSelections' as const] : []),
    ],
  });

  if (result.canceled) {
    return { canceled: true, filePaths: [], files: [] };
  }

  const files: FileMetadata[] = await Promise.all(
    result.filePaths.map(async (filePath) => {
      const stat = await fs.stat(filePath);
      return {
        name: path.basename(filePath),
        path: filePath,
        size: stat.size,
        extension: path.extname(filePath),
        lastModified: stat.mtimeMs,
      };
    })
  );

  return {
    canceled: false,
    filePaths: result.filePaths,
    files,
  };
}

/**
 * Opens a native save dialog
 */
export async function saveFileDialog(options?: FileDialogOptions): Promise<SaveDialogResult> {
  const win = BrowserWindow.getFocusedWindow();

  const result = await dialog.showSaveDialog(win!, {
    title: options?.title ?? 'Save File',
    defaultPath: options?.defaultPath,
    filters: options?.filters ?? [
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  return {
    canceled: result.canceled,
    filePath: result.filePath ?? null,
  };
}

/**
 * Reads file content as UTF-8 string
 */
export async function readFileContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Writes content to a file
 */
export async function writeFileContent(filePath: string, content: string): Promise<void> {
  // Ensure directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}
