'use client';

import { useState, useEffect } from 'react';
import { useFileDialog, useIsElectron, useShell } from '../renderer/hooks/useIpc';

export default function HomePage() {
  const isElectron = useIsElectron();
  const { openFile, readFile, isLoading } = useFileDialog();
  const { openExternal } = useShell();
  const [file, setFile] = useState<{ name: string; path: string; content: string } | null>(null);
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (isElectron) window.electronAPI.getAppVersion().then(setVersion);
  }, [isElectron]);

  const handleOpen = async () => {
    const result = await openFile({
      filters: [
        { name: 'Text', extensions: ['txt', 'md', 'json', 'ts', 'tsx', 'js', 'css', 'html'] },
        { name: 'All', extensions: ['*'] },
      ],
    });
    if (result && !result.canceled && result.files[0]) {
      const f = result.files[0];
      const content = await readFile(f.path);
      if (content !== null) setFile({ name: f.name, path: f.path, content });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-dim font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {isElectron ? `electron v${version}` : 'browser mode'}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Electron + Next.js
          </h1>
          <p className="text-sm text-text-muted leading-relaxed max-w-md">
            Desktop app template with secure IPC, custom title bar, and static export. Ready to build on.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            id="btn-open-file"
            onClick={handleOpen}
            disabled={!isElectron || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
            Open File
          </button>

          <button
            id="btn-github"
            onClick={() => openExternal('https://github.com/karthikskailas/electron-next-js-template')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border text-text-muted hover:text-text hover:border-border-hover transition-colors"
          >
            Docs
          </button>
        </div>

        {!isElectron && (
          <p className="text-xs text-text-dim">
            File operations require the Electron runtime.
            Run <code className="font-mono text-text-muted">npm run dev</code> to launch the desktop app.
          </p>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-px rounded-lg border border-border overflow-hidden">
          {[
            { title: 'IPC Bridge', desc: 'Type-safe contextBridge. No nodeIntegration.' },
            { title: 'Next.js 16', desc: 'App Router, React 19, Tailwind CSS v4.' },
            { title: 'Native APIs', desc: 'File dialogs, shell, window controls.' },
          ].map((item) => (
            <div key={item.title} className="bg-bg-subtle p-4 space-y-1">
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="text-xs text-text-dim leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* File viewer */}
        {file && (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-bg-subtle border-b border-border">
              <span className="text-xs font-mono text-text-muted">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-text-dim hover:text-text-muted transition-colors"
              >
                close
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-text-muted overflow-auto max-h-56 bg-bg">
              <code>{file.content}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
