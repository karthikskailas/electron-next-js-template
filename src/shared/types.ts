// ============================================================
// Shared Type Definitions
// These interfaces are used by both main process and renderer.
// ============================================================

/** Metadata for a file selected through the native dialog */
export interface FileMetadata {
  name: string;
  path: string;
  size: number;
  extension: string;
  lastModified: number;
}

/** Result from a file open dialog */
export interface FileDialogResult {
  canceled: boolean;
  filePaths: string[];
  files: FileMetadata[];
}

/** Result from a file save dialog */
export interface SaveDialogResult {
  canceled: boolean;
  filePath: string | null;
}

/** Options for file dialogs */
export interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  multiSelections?: boolean;
}

/** Application information */
export interface AppInfo {
  version: string;
  platform: NodeJS.Platform;
  arch: string;
}

/** The API shape exposed to the renderer via contextBridge */
export interface ElectronAPI {
  // File System
  openFile: (options?: FileDialogOptions) => Promise<FileDialogResult>;
  saveFile: (options?: FileDialogOptions) => Promise<SaveDialogResult>;
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<void>;

  // Window Controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  isMaximized: () => Promise<boolean>;

  // App
  getAppVersion: () => Promise<string>;

  // Shell
  openExternal: (url: string) => Promise<void>;
  showItemInFolder: (path: string) => void;

  // Platform info
  platform: NodeJS.Platform;
}
