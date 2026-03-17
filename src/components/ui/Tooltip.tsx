import { useState, type ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-card border border-border-strong rounded px-2.5 py-1 text-[11px] text-primary whitespace-nowrap pointer-events-none z-[100] shadow-elevated">
          {text}
        </span>
      )}
    </span>
  );
}
