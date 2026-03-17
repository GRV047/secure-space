import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-accent text-white border-transparent hover:bg-accent-dark',
  secondary: 'bg-white text-primary border border-border-strong hover:bg-card-hover',
  ghost:     'bg-transparent text-secondary border-transparent hover:text-primary',
  danger:    'bg-critical/10 text-critical border border-critical/20 hover:bg-critical/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1 rounded',
  md: 'text-[13px] px-3.5 py-1.5 rounded',
  lg: 'text-sm px-5 py-2 rounded-lg',
};

export function Button({ variant = 'secondary', size = 'md', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-1.5 font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}
