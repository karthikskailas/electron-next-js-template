// ============================================================
// IPC Channel Constants
// Single source of truth for all IPC communication channels.
// Both main process and renderer reference these constants.
// ============================================================

export const IPC = {
  // File System operations
  OPEN_FILE: 'dialog:open-file',
  SAVE_FILE: 'dialog:save-file',
  READ_FILE: 'fs:read-file',
  WRITE_FILE: 'fs:write-file',

  // Window management
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized',

  // App info
  GET_APP_VERSION: 'app:get-version',
  GET_APP_PATH: 'app:get-path',

  // System
  OPEN_EXTERNAL: 'shell:open-external',
  SHOW_ITEM_IN_FOLDER: 'shell:show-item-in-folder',
} as const;

// Type helper to extract channel string values
export type IpcChannel = (typeof IPC)[keyof typeof IPC];
