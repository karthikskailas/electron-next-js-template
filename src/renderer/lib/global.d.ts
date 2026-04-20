// Augment the global Window interface with our Electron API
import type { ElectronAPI } from '../../shared/types';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
