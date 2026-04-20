'use client';

import { useWindowControls } from '../../hooks/useIpc';

export function TitleBar() {
  const { minimize, maximize, close } = useWindowControls();

  return (
    <header className="titlebar-drag flex items-center justify-between h-9 px-3 bg-bg-subtle border-b border-border select-none shrink-0">
      <span className="text-[11px] font-medium text-text-dim tracking-wide">
        electron-app
      </span>
      <div className="titlebar-no-drag flex items-center">
        <button onClick={minimize} className="w-7 h-7 flex items-center justify-center text-text-dim hover:text-text-muted" aria-label="Minimize">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 12H4" /></svg>
        </button>
        <button onClick={maximize} className="w-7 h-7 flex items-center justify-center text-text-dim hover:text-text-muted" aria-label="Maximize">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        </button>
        <button onClick={close} className="w-7 h-7 flex items-center justify-center text-text-dim hover:text-danger" aria-label="Close">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </header>
  );
}
