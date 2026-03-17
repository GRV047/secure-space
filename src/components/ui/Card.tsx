import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className }: CardProps) {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 shadow-card ${className ?? ''}`}>
      {title && (
        <h3 className="text-[11px] font-semibold text-secondary uppercase tracking-widest mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
