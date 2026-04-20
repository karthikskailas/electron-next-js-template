'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowing?: boolean;
  hoverable?: boolean;
  id?: string;
}

export function Card({
  children,
  className = '',
  glowing = false,
  hoverable = false,
  id,
}: CardProps) {
  return (
    <div
      id={id}
      className={`
        rounded-2xl border border-border-subtle bg-bg-card p-6
        ${hoverable ? 'transition-all duration-300 hover:border-border-accent hover:shadow-lg hover:shadow-accent-indigo/5 hover:-translate-y-0.5' : ''}
        ${glowing ? 'animate-pulse-glow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
