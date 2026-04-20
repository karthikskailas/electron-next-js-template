'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FileDialogOptions, FileDialogResult, SaveDialogResult } from '../../shared/types';

/**
 * Check if running inside Electron — deferred to useEffect to avoid hydration mismatch
 */
export function useIsElectron(): boolean {
  const [isElectron, setIsElectron] = useState(false);
  useEffect(() => {
    setIsElectron(!!window.electronAPI);
  }, []);
  return isElectron;
}

/**
 * Hook for file operations via IPC
 */
export function useFileDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const openFile = useCallback(async (options?: FileDialogOptions): Promise<FileDialogResult | null> => {
    if (!window.electronAPI) return null;
    setIsLoading(true);
    try {
      return await window.electronAPI.openFile(options);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFile = useCallback(async (options?: FileDialogOptions): Promise<SaveDialogResult | null> => {
    if (!window.electronAPI) return null;
    setIsLoading(true);
    try {
      return await window.electronAPI.saveFile(options);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const readFile = useCallback(async (filePath: string): Promise<string | null> => {
    if (!window.electronAPI) return null;
    return window.electronAPI.readFile(filePath);
  }, []);

  const writeFile = useCallback(async (filePath: string, content: string): Promise<void> => {
    if (!window.electronAPI) return;
    return window.electronAPI.writeFile(filePath, content);
  }, []);

  return { openFile, saveFile, readFile, writeFile, isLoading };
}

/**
 * Hook for window controls (minimize, maximize, close)
 */
export function useWindowControls() {
  const minimize = useCallback(() => {
    window.electronAPI?.minimizeWindow();
  }, []);

  const maximize = useCallback(() => {
    window.electronAPI?.maximizeWindow();
  }, []);

  const close = useCallback(() => {
    window.electronAPI?.closeWindow();
  }, []);

  const isMaximized = useCallback(async (): Promise<boolean> => {
    if (!window.electronAPI) return false;
    return window.electronAPI.isMaximized();
  }, []);

  return { minimize, maximize, close, isMaximized };
}

/**
 * Hook for shell operations
 */
export function useShell() {
  const openExternal = useCallback(async (url: string) => {
    await window.electronAPI?.openExternal(url);
  }, []);

  const showInFolder = useCallback((path: string) => {
    window.electronAPI?.showItemInFolder(path);
  }, []);

  return { openExternal, showInFolder };
}
