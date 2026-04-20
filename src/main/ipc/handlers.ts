// ============================================================
// IPC Handlers Registration
// All IPC listeners are registered here (OCP: easy to extend)
// ============================================================

import { ipcMain, BrowserWindow, app, shell } from 'electron';
import { IPC } from '../../shared/constants';
import { openFileDialog, saveFileDialog, readFileContent, writeFileContent } from '../services/fileSystem';

export function registerIpcHandlers(): void {
  // ── File System ──────────────────────────────────────────
  ipcMain.handle(IPC.OPEN_FILE, async (_event, options) => {
    return openFileDialog(options);
  });

  ipcMain.handle(IPC.SAVE_FILE, async (_event, options) => {
    return saveFileDialog(options);
  });

  ipcMain.handle(IPC.READ_FILE, async (_event, filePath: string) => {
    return readFileContent(filePath);
  });

  ipcMain.handle(IPC.WRITE_FILE, async (_event, filePath: string, content: string) => {
    return writeFileContent(filePath, content);
  });

  // ── Window Controls ──────────────────────────────────────
  ipcMain.on(IPC.WINDOW_MINIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.minimize();
  });

  ipcMain.on(IPC.WINDOW_MAXIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on(IPC.WINDOW_CLOSE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });

  ipcMain.handle(IPC.WINDOW_IS_MAXIMIZED, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win?.isMaximized() ?? false;
  });

  // ── App Info ─────────────────────────────────────────────
  ipcMain.handle(IPC.GET_APP_VERSION, () => {
    return app.getVersion();
  });

  ipcMain.handle(IPC.GET_APP_PATH, (_event, name: string) => {
    return app.getPath(name as any);
  });

  // ── Shell ────────────────────────────────────────────────
  ipcMain.handle(IPC.OPEN_EXTERNAL, async (_event, url: string) => {
    await shell.openExternal(url);
  });

  ipcMain.on(IPC.SHOW_ITEM_IN_FOLDER, (_event, path: string) => {
    shell.showItemInFolder(path);
  });
}
