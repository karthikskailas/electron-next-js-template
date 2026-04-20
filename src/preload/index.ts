// ============================================================
// Preload Script — The Context Bridge
// Securely exposes specific APIs to the renderer (ISP)
// ============================================================

import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../shared/constants';
import type { ElectronAPI, FileDialogOptions } from '../shared/types';

const electronAPI: ElectronAPI = {
  // ── File System ──────────────────────────────────────────
  openFile: (options?: FileDialogOptions) =>
    ipcRenderer.invoke(IPC.OPEN_FILE, options),

  saveFile: (options?: FileDialogOptions) =>
    ipcRenderer.invoke(IPC.SAVE_FILE, options),

  readFile: (filePath: string) =>
    ipcRenderer.invoke(IPC.READ_FILE, filePath),

  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke(IPC.WRITE_FILE, filePath, content),

  // ── Window Controls ──────────────────────────────────────
  minimizeWindow: () => ipcRenderer.send(IPC.WINDOW_MINIMIZE),
  maximizeWindow: () => ipcRenderer.send(IPC.WINDOW_MAXIMIZE),
  closeWindow: () => ipcRenderer.send(IPC.WINDOW_CLOSE),
  isMaximized: () => ipcRenderer.invoke(IPC.WINDOW_IS_MAXIMIZED),

  // ── App ──────────────────────────────────────────────────
  getAppVersion: () => ipcRenderer.invoke(IPC.GET_APP_VERSION),

  // ── Shell ────────────────────────────────────────────────
  openExternal: (url: string) => ipcRenderer.invoke(IPC.OPEN_EXTERNAL, url),
  showItemInFolder: (path: string) => ipcRenderer.send(IPC.SHOW_ITEM_IN_FOLDER, path),

  // ── Platform ─────────────────────────────────────────────
  platform: process.platform,
};

// Expose to renderer as window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
