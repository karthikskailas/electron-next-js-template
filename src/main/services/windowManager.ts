// ============================================================
// Window Manager Service
// Utility functions for managing BrowserWindows
// ============================================================

import { BrowserWindow, screen } from 'electron';

/**
 * Centers a window on the primary display
 */
export function centerWindow(win: BrowserWindow): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const [winWidth, winHeight] = win.getSize();

  const x = Math.round((width - winWidth) / 2);
  const y = Math.round((height - winHeight) / 2);

  win.setPosition(x, y);
}

/**
 * Gets window bounds info
 */
export function getWindowBounds(win: BrowserWindow) {
  return {
    bounds: win.getBounds(),
    isMaximized: win.isMaximized(),
    isMinimized: win.isMinimized(),
    isFullScreen: win.isFullScreen(),
  };
}
