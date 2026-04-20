import type { Metadata } from 'next';
import './globals.css';
import { TitleBar } from '../renderer/components/layout/TitleBar';

export const metadata: Metadata = {
  title: 'Electron App',
  description: 'Electron + Next.js desktop application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="flex flex-col h-screen overflow-hidden">
          <TitleBar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
